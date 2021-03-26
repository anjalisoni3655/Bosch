import cv2
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import os
import pandas as pd
# from tqdm.notebook import tqdm
import numpy as np
from PIL import Image
import tensorflow as tf
import random
random.seed(1)
import matplotlib.cm as cm
# from IPython.display import Image, display
import keras
from keras import activations
import matplotlib.image as mpimg
import scipy.ndimage as ndimage
import keras as K
from keras.preprocessing import image,image_dataset_from_directory
from keras.engine import Layer
from keras.layers import Conv2D, InputLayer, Input, Reshape, merge, BatchNormalization, LeakyReLU, add, concatenate, MaxPooling2D
from keras.layers import Activation, Dense, Dropout, Flatten
from keras.layers.normalization import BatchNormalization
from keras.callbacks import ModelCheckpoint, ReduceLROnPlateau
from keras.models import Sequential, Model, model_from_json
from keras.preprocessing.image import ImageDataGenerator, array_to_img, img_to_array, load_img
from sklearn import manifold
from time import time
import numpy as np
import os
import random
import tensorflow as tf
from PIL import Image, ImageFile
# # from tqdm import tqdm
import cv2


#image_folder='Images/'
#model_folder="models"

# physical_devices = tf.config.experimental.list_physical_devices('GPU')
# assert len(physical_devices) > 0, "Not enough GPU hardware devices available"
# tf.config.experimental.set_memory_growth(physical_devices[0], True)

def get_data(ROOT_DIR,SIZE):
    classes = sorted(os.listdir(ROOT_DIR))
    dfs = {}
    for cls in classes:
        path = f'{ROOT_DIR}{cls}/GT-{cls}.csv'
        dfs[cls] = path
    resizedimages = []
    labels = []
    for i, cls in (enumerate(classes)):
        pathtoimages = f'{ROOT_DIR}{cls}'
        images = os.listdir(pathtoimages)
        for image in tqdm(images):
            # print(image[-3:])
            if image[-3:] == 'csv':
                continue
            img = cv2.imread(f'{ROOT_DIR}{cls}/{image}')
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            res = cv2.resize(img, (SIZE, SIZE))
            resizedimages.append(res)
            labels.append(i)
    data = np.array(resizedimages)
    labs = np.array(labels)

    return data, labs

from keras import backend as K

def get_model(model_folder, model_type):
    model_dict = {
        'mobilenetv2': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'mobilenetv3': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'resnet50': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'inceptionv3': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'baseline': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'baselineaugmented': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'model.json'),
            'tsne': os.path.join(model_folder, 'model_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'weights_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        }
    }

    json_file = open(model_dict[model_type]['tsne'], 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    loaded_model.summary()
    # load weights into new model
    loaded_model.load_weights(model_dict[model_type]['tsne_weights'])
    print("Loaded model from disk")
    return loaded_model, model_dict[model_type]['image_size']




def tsne_dict(tsnepred, labels):
    sign_list = ['Speed limit (20km/h)', 'Speed limit (30km/h)', 'Speed limit (50km/h)', 'Speed limit (60km/h)',
                 'Speed limit (70km/h)', 'Speed limit (80km/h)', 'End of speed limit (80km/h)', 'Speed limit (100km/h)',
                 'Speed limit (120km/h)', 'No passing', 'No passing for vehicles over 3.5 metric tons',
                 'Right-of-way at the next intersection', 'Priority road', 'Yield', 'Stop', 'No vehicles',
                 'Vehicles over 3.5 metric tons prohibited', 'No entry', 'General caution',
                 'Dangerous curve to the left', 'Dangerous curve to the right', 'Double curve', 'Bumpy road',
                 'Slippery road', 'Road narrows on the right', 'Road work', 'Traffic signals', 'Pedestrians',
                 'Children crossing', 'Bicycles crossing', 'Beware of ice/snow', 'Wild animals crossing',
                 'End of all speed and passing limits', 'Turn right ahead', 'Turn left ahead', 'Ahead only',
                 'Go straight or right', 'Go straight or left', 'Keep right', 'Keep left', 'Roundabout mandatory',
                 'End of no passing', 'End of no passing by vehicles over 3.5 metric tons', 'No Stopping', 'Cross Road',
                 'No passing Cars', 'Route for Pedal Cycles Only',
                 'Separated Track for Pedal Cyclists and Pedestrians Only', 'Parking Sign', 'Tonnage Limits']
    
    #input will consist of x and y coordinated and class
    colors = ['#0cc3ba', '#ec6387', '#300936', '#b70870', '#d500d2', '#be6222', '#b86b46', '#348642', '#8d2b02', '#9ccdcb',
           '#79b7fd', '#34ac66', '#846610', '#81cfd1', '#ade01a', '#97af10', '#7b802d', '#7150a5', '#0757b5', '#2fe49e',
           '#539ae4', '#79a230', '#0a527a', '#e994b0', '#6feb2e', '#84ad2e', '#ca1fed', '#178db4', '#9c1c29', '#f68a45',
           '#284a90', '#4311c0', '#23658b', '#38ccb5', '#e698ea', '#248789', '#33ebcd', '#b00af2', '#622d5f', '#1957bb',
           '#54b0e6', '#20bdf1', '#c36fa7', '#209efb', '#db5d82', '#53c87b', '#48df8b', '#38f9d7', '#940f5f', '#db3d69'
          ]
    color_dict = {}
    for i in range(len(colors)):
        color_dict[str(i)] = colors[i]
    
    x = tsnepred[:,0]
    y = tsnepred[:,1]

    list_ = []
    for i in range(len(x)):
        dict_ = {"x":x[i],
                 "y":y[i],
                 "name":sign_list[labels[i]],
                "color": color_dict[str(labels[i])]}
        list_.append(dict_)
        
    return list_


def get_tsne(model_type,image_folder, model_folder):
    #model_folder=os.path.join(model_folder,model_type)
    model, size= get_model(model_folder, model_type)
    data, labs=get_data(image_folder, size)
    s = np.arange(data.shape[0])
    np.random.seed(43)
    np.random.shuffle(s)
    data = data[s]
    labs = labs[s]
    if (len(data)>5000):
        data=data[:5000]
        labs=labs[:5000]
    model.compile(loss='categorical_crossentropy',
                    optimizer='sgd',
                    metrics=['accuracy'])
    pred = model.predict(data)
    tsne = manifold.TSNE(n_components=3, init='pca')
    tsnepred = tsne.fit_transform(pred)
    #fig = plt.figure(num=None, figsize=(10, 10), dpi=80, facecolor='w', edgecolor='k')
    #sp1 =plt.scatter(tsnepred[:, 0], tsnepred[:, 1], marker='.', c=labs, label='all')
    #plt.colorbar(sp1)
    #plt.show()
    return tsne_dict(tsnepred, labs)


#print(get_tsne('inceptionv3', image_folder,model_folder))
