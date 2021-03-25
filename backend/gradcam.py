import torch
import torchvision
from torchvision.models.detection.faster_rcnn import FastRCNNPredictor
import time
import cv2
import numpy as np
import argparse
import matplotlib.pyplot as plt
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import pandas as pd
# from tqdm import tqdm
import tensorflow as tf
import random
import matplotlib.cm as cm
# from IPython.display import Image, display
import keras
from keras import activations
import matplotlib.image as mpimg
import scipy.ndimage as ndimage
from sklearn.metrics import classification_report, confusion_matrix, f1_score,accuracy_score
from PIL import Image as im
import warnings
warnings.filterwarnings("ignore")


if torch.cuda.is_available():
    device = torch.device('cuda')
else:
    device = torch.device('cpu')



torchmodel = torchvision.models.detection.fasterrcnn_resnet50_fpn(pretrained=False)
in_features = torchmodel.roi_heads.box_predictor.cls_score.in_features
torchmodel.roi_heads.box_predictor = FastRCNNPredictor(in_features, 2)
torchmodel.to(device)

########### SET PATH FOR OBJECT DETECTION MODEL INPUT ################
torchmodel.load_state_dict(torch.load('static/models/FasterRCNN_v1/fasterrcnn_augtrained.pth', map_location=device))
######################################################################

torchmodel.eval()




###########################################################3

def gradcam(json_path,weights_path,last_conv,image_path, output_folder):
    """
    Takes an image with model weights and find iou with gradcam and bounding box
    """

    if not os.path.exists(os.path.join(output_folder, 'tmp')):
        os.mkdir(os.path.join(output_folder, 'tmp'))


    json_file = open(json_path, 'r')#-------------->json_path is used here
    loaded_model_json = json_file.read()
    json_file.close()
    model = keras.models.model_from_json(loaded_model_json)
    model.load_weights(weights_path)#--------------->weights_path is used here

    img = plt.imread(image_path)#---------------->image_path is used here

    img = cv2.imread(image_path)#---------------->image_path is used here
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    res = cv2.resize(img, (30, 30))

    def get_img_array(img_path, size):
        # `img` is a PIL image 
        img = keras.preprocessing.image.load_img(img_path, target_size=size)
        # `array` is a float32 Numpy array of shape (299, 299, 3)
        array = keras.preprocessing.image.img_to_array(img)
        # We add a dimension to transform our array into a "batch"
        # of size (1, 299, 299, 3)
        array = np.expand_dims(array, axis=0)
        return array

    def make_gradcam_heatmap(img_array, model, last_conv_layer_name, pred_index=None):
        # First, we create a model that maps the input image to the activations
        # of the last conv layer as well as the output predictions
        grad_model = tf.keras.models.Model([model.inputs], [model.get_layer(last_conv_layer_name).output, model.output])

        # Then, we compute the gradient of the top predicted class for our input image
        # with respect to the activations of the last conv layer
        with tf.GradientTape() as tape:
            last_conv_layer_output, preds = grad_model(img_array)
            if pred_index is None:
                pred_index = tf.argmax(preds[0])
            class_channel = preds[:, pred_index]

        # This is the gradient of the output neuron (top predicted or chosen)
        # with regard to the output feature map of the last conv layer
        grads = tape.gradient(class_channel, last_conv_layer_output)

        # This is a vector where each entry is the mean intensity of the gradient
        # over a specific feature map channel
        pooled_grads = tf.reduce_mean(grads, axis=(0, 1, 2))

        # We multiply each channel in the feature map array
        # by "how important this channel is" with regard to the top predicted class
        # then sum all the channels to obtain the heatmap class activation
        last_conv_layer_output = last_conv_layer_output[0]
        heatmap = last_conv_layer_output @ pooled_grads[..., tf.newaxis]
        heatmap = tf.squeeze(heatmap)

        # For visualization purpose, we will also normalize the heatmap between 0 & 1
        heatmap = tf.maximum(heatmap,0) / tf.math.reduce_max(heatmap)
        return heatmap.numpy()

    def save_and_display_gradcam(img_path, heatmap, cam_path=os.path.join(output_folder, 'tmp', 'cam.jpg'), alpha=0.35):
        # Load the original image
        img = keras.preprocessing.image.load_img(img_path)
        img = keras.preprocessing.image.img_to_array(img)

        # Rescale heatmap to a range 0-255
        heatmap = np.uint8(255 * heatmap)

        # Use jet colormap to colorize heatmap
        jet = cm.get_cmap("jet")

        # Use RGB values of the colormap
        jet_colors = jet(np.arange(256))[:, :3]
        jet_heatmap = jet_colors[heatmap]
        # Create an image with RGB colorized heatmap
        jet_heatmap = keras.preprocessing.image.array_to_img(jet_heatmap)
        jet_heatmap = jet_heatmap.resize((img.shape[1], img.shape[0]))
        jet_heatmap = keras.preprocessing.image.img_to_array(jet_heatmap)

        # Superimpose the heatmap on original image
        superimposed_img = jet_heatmap * alpha + img
        superimposed_img = keras.preprocessing.image.array_to_img(superimposed_img)

        # Save the superimposed image
        superimposed_img.save(cam_path)

        # Display Grad CAM
        #display(Image(cam_path))

    model.layers[-1].activation = None
    size = (30,30)

    img_arr = get_img_array(image_path, size)
    heatmap = make_gradcam_heatmap(img_arr, model, last_conv, pred_index=None) #-----------> last_conv is used here
    save_and_display_gradcam(image_path, (heatmap*255>100)+0, cam_path=os.path.join(output_folder, 'tmp', 'cam.jpg'), alpha=0.35)
    # load bounding box model
    start = time.time()
    image = res.copy()
    image = cv2.resize(image, (50, 50))
    image = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)
    image = image/255.
    image = np.moveaxis(image, -1, 0)
    image = image.reshape(1, 3, 50, 50)
    image = torch.tensor(image, dtype=torch.float32, device=device)

    with torch.no_grad():
        outputs = torchmodel(image)
    #print(f"Processing and Prediction done in {time.time() - start}")

    coords = (outputs[0]['boxes'][0]/50).cpu()

    def thresh(heatmap):
        i = (cv2.resize(heatmap*255, (100,100))>127)+0
        return i

    def cropiou(coords,threshold):
        coords = coords*threshold.shape[0]
        coords = [int(x) for x in coords.numpy().tolist()]
        # coords = [xmin, ymin, xmax, ymax]  crop[ymin:ymax, xmin:xmax]
        crop = threshold[coords[1]:coords[3], coords[0]:coords[2]]
        return crop

    iou = np.sum(cropiou(coords,thresh(heatmap)))/np.sum(thresh(heatmap))
    return (iou,coords)

#########################################


def Iou_dataframe_generator(json_path, weights_path, last_conv, df_path,output_folder,Dirpath = 'Train/'):
    df = pd.read_csv(df_path)
    wron = df[df['predictions'] != df['labels']].index
    wrong_filenames = list(df.loc[wron, 'filenames'])
    wrong_pathlist = [os.path.join(Dirpath, x) for x in wrong_filenames]
    misc_dict,cisc_dict =  checkmisc(json_path,weights_path,last_conv,wrong_pathlist,[],output_folder=output_folder, fulliou=True)
    
    df_aay = pd.DataFrame()
    df_aay['filenames'] = list(df.loc[wron, 'filenames'])
    df_aay['iou'] = list(misc_dict.values())
    df_aay['labels'] = list(df.loc[wron, 'labels'])

    # clean nan values
    df_aay.dropna(inplace=True)
    df_aay.to_csv(os.path.join(output_folder,'prediction_ious.csv'),index=False)
    
    return None

##########################################

def checkmisc(json_path,weights_path,last_conv,misc_pathlist,cisc_pathlist, output_folder, fulliou):
    
    misc_dict = {}
    cisc_dict = {}

    """ FIRST FOUR ARE MISSCLASSIFIED """
    """ LAST FOUR ARE CORRECTLY CLASSIFIED """

    j = 1
    for i in (misc_pathlist):
        iou,coord = gradcam(json_path,weights_path,last_conv,i, output_folder)
        #print("IOU:",iou)
        img = cv2.imread(os.path.join(output_folder, 'tmp', 'cam.jpg'))
        #img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = cv2.resize(img, (100, 100))
        ncoords = [int(x*100) for x in coord.numpy().tolist()]
        data = im.fromarray(cv2.rectangle(res, (ncoords[0],ncoords[1]), (ncoords[2], ncoords[3]), (0,255,0),1))
        if not fulliou:
            data.save(os.path.join(output_folder, f'{j}.png')) #-----------------------------> Image Save Path
        misc_dict['{}.png'.format(j)] = iou
        j = j + 1
    
    for i in (cisc_pathlist):
        iou,coord = gradcam(json_path,weights_path,last_conv,i, output_folder)
        #print("IOU:",iou)
        img = cv2.imread(os.path.join(output_folder, 'tmp', 'cam.jpg'))
        #img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        res = cv2.resize(img, (100, 100))
        ncoords = [int(x*100) for x in coord.numpy().tolist()]
        data = im.fromarray(cv2.rectangle(res, (ncoords[0],ncoords[1]), (ncoords[2], ncoords[3]), (0,255,0),1))
        if not fulliou:
            #print(i)
            data.save(os.path.join(output_folder, f'{j}.png'))#------------------------------> Image Save Path
        cisc_dict['{}.png'.format(j)] = iou
        
        j = j + 1
        
    return misc_dict,cisc_dict




###############################################


def Save_top4(json_path, weights_path, last_conv, df_path, output_folder, Dirpath = 'augmentations_level 3/'):

    df = pd.read_csv(df_path)

    ######## DELETE BEFORE PUSH ###################
    df = df.sample(50).reset_index(drop=True)
    ###############################################
    #In rememberance of Yerram Varun, Rambatla Amey & AayushCode Sharma
    ###############################################

    for i in (range(len(df))):
        name = df.loc[i, 'filenames']
        path = os.path.join(Dirpath, name)
        iou, _ = gradcam(json_path,weights_path,last_conv,path,output_folder)
        df.loc[i, 'iou'] = iou

    dfcisc = df[df['predictions'] == df['labels']]
    dfmisc = df[df['predictions'] != df['labels']]

    dfcisc = dfcisc.sort_values(by='iou', ascending=False).head(4)
    dfmisc = dfmisc.sort_values(by='iou', ascending=True).head(4)

    misc_pathlist = [os.path.join(Dirpath, x) for x in list(dfmisc['filenames'])]
    cisc_pathlist = [os.path.join(Dirpath, x) for x in list(dfcisc['filenames'])]

    _ = checkmisc(json_path,weights_path,last_conv,misc_pathlist,cisc_pathlist, output_folder, fulliou=False)

# if __name__ == '__main__':
    # Save_top4('baseline_augmented.json','baseline_augmented.h5','last_conv','Preds_MBNV2.csv','OUTPUT/')
    # Iou_dataframe_generator('baseline_augmented.json','baseline_augmented.h5','last_conv','kuchbhi.csv','Train/')
