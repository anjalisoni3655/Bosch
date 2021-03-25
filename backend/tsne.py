import cv2
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import os
import pandas as pd
from tqdm.notebook import tqdm
import numpy as np
from PIL import Image
import tensorflow as tf
import random
import matplotlib.cm as cm
from IPython.display import Image, display
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
from tqdm import tqdm
import cv2

image_folder="Images/"
model_folder="models"

physical_devices = tf.config.experimental.list_physical_devices('GPU')
assert len(physical_devices) > 0, "Not enough GPU hardware devices available"
tf.config.experimental.set_memory_growth(physical_devices[0], True)

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
            'json_file': os.path.join(model_folder, 'mobilenetv2.json'),
            'tsne': os.path.join(model_folder, 'mobilenetv2_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'mobilenetv2_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'mobilenetv2.h5')
        },
        'mobilenetv3': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'mobilenetv3.json'),
            'tsne': os.path.join(model_folder, 'mobilenetv3_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'mobilenetv3_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'mobilenetv3.h5')
        },
        'inceptionv3': {
            'image_size': 75,
            'json_file': os.path.join(model_folder, 'inceptionv3.json'),
            'tsne': os.path.join(model_folder, 'inceptionv3_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'inception_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'inception.h5')
        },
        'baseline': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'baseline.json'),
            'tsne': os.path.join(model_folder, 'baseline_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'baseline_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'baseline.h5')
        },
        'baseline_augmented': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'baseline.json'),
            'tsne': os.path.join(model_folder, 'baseline_tsne.json'),
            'tsne_weights': os.path.join(model_folder, 'baseline_tsne.h5'),
            'h5_file': os.path.join(model_folder, 'baseline.h5')
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
    #aishik's input will consist of x and y coordinated and class
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
    for i in range(len(X)):
        dict_ = {"x":x[i],
                 "y":y[i],
                 "label":labels[i],
                "color": color_dict[str(labels[i])]}
        list_.append(dict_)
    return list_

def tsne(model_type,image_folder):
    model, size= get_model(model_folder, model_type)
    data, labs=get_data(image_folder, size)
    model.compile(loss='categorical_crossentropy',
                    optimizer='sgd',
                    metrics=['accuracy'])
    pred = model.predict(data[:100])
    tsne = manifold.TSNE(n_components=3, method='barnes_hut')
    tsnepred = tsne.fit_transform(pred)
    return tsne_dict(tsnepred, labs)


print(tsne('inceptionv3', image_folder))
