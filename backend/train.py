import os
import time
import numpy as np
import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt
import keras
from keras import backend as K
from keras.callbacks import CSVLogger
from keras.models import model_from_json
from keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix
from animate import * 
from tsne import *
from gradcam import *

def recall_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    possible_positives = K.sum(K.round(K.clip(y_true, 0, 1)))
    recall = true_positives / (possible_positives + K.epsilon())
    return recall


def precision_m(y_true, y_pred):
    true_positives = K.sum(K.round(K.clip(y_true * y_pred, 0, 1)))
    predicted_positives = K.sum(K.round(K.clip(y_pred, 0, 1)))
    precision = true_positives / (predicted_positives + K.epsilon())
    return precision


def f1_m(y_true, y_pred):
    precision = precision_m(y_true, y_pred)
    recall = recall_m(y_true, y_pred)
    return 2 * ((precision * recall) / (precision + recall + K.epsilon()))

def get_model(model_folder, model_type):
    model_dict = {
        'mobilenetv2': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'mobilenetv3': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'inceptionv3': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'baseline': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'baselineaugmented': {
            'image_size': 30,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        },
        'resnet50': {
            'image_size': 96,
            'json_file': os.path.join(model_folder, 'model.json'),
            'h5_file': os.path.join(model_folder, 'weights.h5')
        }
    }

    json_file = open(model_dict[model_type]['json_file'], 'r')
    loaded_model_json = json_file.read()
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights(model_dict[model_type]['h5_file'])
    if model_type not in ['baseline', 'baselineaugmented']:
        for layers in loaded_model.layers[:-5]:
            print(layers)
            layers.trainable = False
    return loaded_model, model_dict[model_type]['image_size']


def train_model(TRAIN_FOLDER, VALID_FOLDER, OUTPUT_FOLDER, model_type, EPOCHS, learning_rate=1e-2, optimizer='Adam'):
    config = tf.compat.v1.ConfigProto()
    config.gpu_options.per_process_gpu_memory_fraction = 0.9  # 0.6 sometimes works better for folks
    tf.compat.v1.keras.backend.set_session(tf.compat.v1.Session(config=config))

    BATCH_SIZE = 128
    SEED = 1
    TRAIN_IMAGE_DIR = TRAIN_FOLDER
    VALID_IMAGE_DIR = VALID_FOLDER
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


    model, SIZE = get_model(model_folder=OUTPUT_FOLDER, model_type=model_type)

    datagen = ImageDataGenerator(rescale=1. / 255)
    train = datagen.flow_from_directory(TRAIN_IMAGE_DIR,
                                        target_size=(SIZE, SIZE),
                                        batch_size=BATCH_SIZE,
                                        shuffle=True,
                                        seed=SEED)

    val = datagen.flow_from_directory(VALID_IMAGE_DIR,
                                      target_size=(SIZE, SIZE),
                                      batch_size=BATCH_SIZE,
                                      shuffle=False,
                                      seed=SEED)

    csv_logger = CSVLogger(filename=f"{OUTPUT_FOLDER}/log.csv")
    class TimeHistory(keras.callbacks.Callback):
        def on_train_begin(self, logs={}):
            self.times = []
            self.recalculated_time = []
            self.file = open(f'{OUTPUT_FOLDER}/../../epoch.txt', "w")
            self.file.close()

        def on_epoch_begin(self, epoch, logs={}):
            self.epoch_time_start = time.time()

        def on_epoch_end(self, epoch, logs={}):
            self.times.append(time.time() - self.epoch_time_start)
            cal_time = (EPOCHS - epoch) * (time.time() - self.epoch_time_start) * 1000
            self.recalculated_time.append(cal_time)
            self.file = open(f'{OUTPUT_FOLDER}/../../epoch.txt', "a")  # append mode
            self.file.write(str(int(cal_time)) + "\n")
            self.file.close()
            PLOT(OUTPUT_FOLDER)

    time_history = TimeHistory()
    callbacks = [csv_logger, time_history]
    

    if optimizer == 'Adam':
        optimizer = keras.optimizers.Adam(learning_rate=learning_rate)
    elif optimizer == 'RMSprop':
        optimizer = keras.optimizers.RMSprop(learning_rate=learning_rate)
    elif optimizer == 'SGD':
        optimizer = keras.optimizers.SGD(learning_rate=learning_rate)
    
    model.compile(
        loss='categorical_crossentropy',
        optimizer=optimizer,
        metrics=['accuracy', f1_m, precision_m, recall_m]
    )
    num_train_samples = len(train.classes)

    history = model.fit(train,
                        validation_data=val,
                        callbacks=callbacks,
                        epochs=EPOCHS,
                        steps_per_epoch=num_train_samples//BATCH_SIZE,
                        batch_size=BATCH_SIZE)

    val_preds = model.predict(val)
    val_preds = np.argmax(val_preds, axis=1)
    cr = classification_report(val.classes, val_preds)
    cm = confusion_matrix(val.classes, val_preds)

    valpreds_forgrad = {'filenames': val.filenames,
                        'predictions': val_preds,
                        'labels': val.classes}
    pd.DataFrame(valpreds_forgrad).to_csv(f'{OUTPUT_FOLDER}/Preds_gradcam.csv', index=False)

    training_stats = {'train_loss': history.history["loss"],
                      'train_accuracy': history.history["accuracy"],
                      'train_f1': history.history["f1_m"],
                      'train_precision': history.history["precision_m"],
                      'train_recall': history.history["recall_m"],
                      'valid_loss': history.history["val_loss"],
                      'valid_accuracy': history.history["val_accuracy"],
                      'valid_f1': history.history["val_f1_m"],
                      'valid_precision': history.history["val_precision_m"],
                      'valid_recall': history.history["val_recall_m"],
                      'total_model_parameters': model.count_params(),
                      'classification_report': cr,
                      'confusion_matrix': cm}

    plt.figure(figsize=(50, 50))
    sns.set(font_scale=4)
    sns.heatmap(training_stats['confusion_matrix'], cmap='coolwarm', linewidths=2, linecolor='black',
                yticklabels=sign_list, xticklabels=list(range(0, 50)))
    cm_filename = os.path.join(OUTPUT_FOLDER, "cm.png")
    plt.savefig(cm_filename, bbox_inches='tight')

    cm_csv = os.path.join(OUTPUT_FOLDER, 'cm_csv.csv')
    np.savetxt(cm_csv, cm, delimiter=",")

    return training_stats

def estimate_time(model_type, EPOCHS):
    model_type=model_type.lower()
    if model_type == 'mobilenetv2':
        time = 36.5
    elif model_type == 'mobilenetv3':
        time = 35.66
    elif model_type == 'inceptionv3':
        time = 36.166
    elif model_type == 'resnet50':
        time = 27.166
    elif model_type == 'baseline':
        time = 26
    elif model_type == 'baselineaugmented':
        time = 26    
    else:
        time=0
        print("ERROR", model_type)
    total_time = int(time * EPOCHS * 1000)
    return total_time


def get_gradcam(output_folder, valid_folder):
    jsonfile = os.path.join(output_folder, 'model.json')
    weights = os.path.join(output_folder, 'weights.h5')
    csvf = os.path.join(output_folder, 'Preds_gradcam.csv')
    
    Save_top4(jsonfile, weights, 'last_conv', csvf, output_folder, valid_folder)

def final_training_call(TRAIN_FOLDER, VALID_FOLDER, OUTPUT_FOLDER, model_type, EPOCHS, learning_rate=1e-2, optimizer='Adam'):
    train_model(TRAIN_FOLDER, VALID_FOLDER, OUTPUT_FOLDER, model_type, EPOCHS, learning_rate, optimizer)
    get_gradcam(OUTPUT_FOLDER, VALID_FOLDER)

    
