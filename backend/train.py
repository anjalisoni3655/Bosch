import os
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
from keras import backend as K
from keras.layers import Conv2D, MaxPool2D
from keras.layers import Dense, Dropout, Flatten
from keras.callbacks import CSVLogger
from keras.models import Sequential, model_from_json
from keras.preprocessing.image import ImageDataGenerator
import tensorflow as tf
from skimage.color import rgb2gray
from sklearn.metrics import classification_report, confusion_matrix


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
            'image_size': 75,
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
        }
    }

    json_file = open(model_dict[model_type]['json_file'], 'r')
    loaded_model_json = json_file.read()
    
    json_file.close()
    loaded_model = model_from_json(loaded_model_json)
    # load weights into new model
    loaded_model.load_weights(model_dict[model_type]['h5_file'])
    print("\nLoaded model from disk\n")
    if model_type not in ['baseline', 'baselineaugmented']:
        for layers in loaded_model.layers[:-5]:
            layers.trainable = False
    return loaded_model, model_dict[model_type]['image_size']


def train_model(TRAIN_FOLDER, VALID_FOLDER, MODEL_FOLDER, model_type, EPOCHS = 1):
    config = tf.compat.v1.ConfigProto()
    config.gpu_options.per_process_gpu_memory_fraction = 0.9  # 0.6 sometimes works better for folks
    tf.compat.v1.keras.backend.set_session(tf.compat.v1.Session(config=config))

    BATCH_SIZE = 128
    SEED = 1
    TRAIN_IMAGE_DIR = TRAIN_FOLDER
    VALID_IMAGE_DIR = VALID_FOLDER
    model_type = model_type.lower()
    model, SIZE = get_model(model_folder=MODEL_FOLDER, model_type=model_type)

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

    csv_logger = CSVLogger(filename=f"{MODEL_FOLDER}/log.csv")
    callbacks = [csv_logger]

    model.compile(
        loss='categorical_crossentropy',
        optimizer='adam',
        metrics=['accuracy', f1_m, precision_m, recall_m]
    )

    history = model.fit(train,
                        validation_data=val,
                        callbacks=callbacks,
                        epochs=EPOCHS,
                        batch_size=BATCH_SIZE)

    val_preds = model.predict(val)
    val_preds = np.argmax(val_preds, axis=1)
    cr = classification_report(val.classes, val_preds)
    cm = confusion_matrix(val.classes, val_preds)

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
    sns.heatmap(cm, annot=True, cmap='coolwarm', linewidths=2, linecolor='black')
    cm_filename = os.path.join(MODEL_FOLDER, "cm.png")
    plt.savefig(cm_filename, bbox_inches='tight')


# get_model('static/models/Baseline_v1', 'baseline')