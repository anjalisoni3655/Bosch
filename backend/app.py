import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask_cors import CORS, cross_origin
import json
import zipfile
from augmentations import *
from sample import *
from modelStats import *
from train import *
from animate import *

import shutil 
from PIL import Image

import sys
import requests

number_of_images = 0 


from dataStats import *

import random
import shutil
import cv2
ROOT_FOLDER="static/"
UPLOAD_FOLDER = ROOT_FOLDER+'uploads/'
EXTRACTION_FOLDER = ROOT_FOLDER+'extracted/'
AUGMENTATION_FOLDER = ROOT_FOLDER+'augmented/'
DATASET_FOLDER = ROOT_FOLDER+'dataset/'
TRAIN_FOLDER = DATASET_FOLDER+'train/'
VALIDATION_FOLDER = DATASET_FOLDER+'validation/'
TEST_FOLDER = DATASET_FOLDER+'test/'
GRID_FOLDER = ROOT_FOLDER+"grid/"
GRID_AUGMENTED_FOLDER = GRID_FOLDER + "augmented/"
GRID_EXTRACTED_FOLDER = GRID_FOLDER + "extracted/" 
MODELS_FOLDER = ROOT_FOLDER+"models/"


ALLOWED_EXTENSIONS = {'zip'}
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

app = Flask(__name__)
app.config['ROOT_FOLDER'] = ROOT_FOLDER
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXTRACTION_FOLDER'] = EXTRACTION_FOLDER
app.config['AUGMENTATION_FOLDER'] = AUGMENTATION_FOLDER
app.config['DATASET_FOLDER'] = DATASET_FOLDER
app.config["TRAIN_FOLDER"] = TRAIN_FOLDER
app.config["VALIDATION_FOLDER"] = VALIDATION_FOLDER
app.config["TEST_FOLDER"] = TEST_FOLDER
app.config["GRID_FOLDER"] = GRID_FOLDER
app.config["GRID_AUGMENTED_FOLDER"] = GRID_AUGMENTED_FOLDER
app.config["GRID_EXTRACTED_FOLDER"] = GRID_EXTRACTED_FOLDER
app.config["MODELS_FOLDER"] = MODELS_FOLDER


delete_folder(app.config["UPLOAD_FOLDER"])
delete_folder(app.config["EXTRACTION_FOLDER"])
delete_folder(app.config["AUGMENTATION_FOLDER"])  


app.config.update(SECRET_KEY=os.urandom(24))
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


folder_to_augment = ""
augmentedfolder = ""
className=""
currentNo = 0



def copy_rename_recursive(src, dest):
    global currentNo
    for x in os.listdir(src):
        if(os.path.isdir(os.path.join(src,x))):
            copy_rename_recursive(os.path.join(src,x),dest)
        else:
            
            i = cv2.imread(os.path.join(src,x))
            filename = str(currentNo)+".png"
            cv2.imwrite(os.path.join(dest,filename),i)  
            currentNo+=1


create_folder(app.config["ROOT_FOLDER"])
create_folder(app.config["UPLOAD_FOLDER"])
create_folder(app.config["EXTRACTION_FOLDER"])
create_folder(app.config["AUGMENTATION_FOLDER"])
create_folder(app.config["DATASET_FOLDER"])
create_folder(app.config["TRAIN_FOLDER"])
create_folder(app.config["VALIDATION_FOLDER"])
create_folder(app.config["TEST_FOLDER"])
create_folder(app.config["GRID_FOLDER"])
create_folder(app.config["GRID_AUGMENTED_FOLDER"])
create_folder(app.config["GRID_EXTRACTED_FOLDER"])
create_folder(app.config["MODELS_FOLDER"])

@app.route('/upload', methods=[ 'POST','GET'])
@cross_origin()
def upload_file():

    global folder_to_augment,className, currentNo
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return "No file part"

        file = request.files['file']
        className = str(request.args.get('className'))
        print("Url ", request.url)
        print("Class name : ",className)
        # if user does not select file, browser also
        # submit an empty part without filename
        
        if file.filename == '':
            
            return "No file selected"

        elif not allowed_file(file.filename):
            print("Unsupported file extension, Please upload .zip")
            return "Unsupported file extension, Please use .zip"
        
        elif file and allowed_file(file.filename):
            
            
            filename = secure_filename(file.filename)
            uploaded_folder = create_folder_entry(app.config['UPLOAD_FOLDER'],"uploaded")
            file.save(os.path.join(uploaded_folder, filename))  
            
            print("File uploaded to "+os.path.join(uploaded_folder,filename))
            print("Unzipping "+ filename)
            folder_to_augment = create_folder_entry(app.config['EXTRACTION_FOLDER'],"extracted")

            with zipfile.ZipFile(os.path.join(uploaded_folder, filename), 'r') as zip_ref:
                zip_ref.extractall(folder_to_augment)
            print("Unzipped to "+folder_to_augment)
            delete_folder(app.config["GRID_EXTRACTED_FOLDER"]) 
            create_folder(app.config["GRID_EXTRACTED_FOLDER"])
            currentNo = 0
            copy_rename_recursive(folder_to_augment, app.config["GRID_EXTRACTED_FOLDER"])
            
            
            # print(str(len(os.listdir(app.config["GRID_EXTRACTED_FOLDER"])))) 
            return str(len(os.listdir(app.config["GRID_EXTRACTED_FOLDER"])))


    return str(len(os.listdir(app.config["GRID_EXTRACTED_FOLDER"])))




@app.route('/get-images', methods=['GET'])
@cross_origin()
def images_number():
    entries = os.listdir('static/grid/extracted')
    print(len(entries))
    return str(len(entries))





@app.route('/sample', methods = ['POST'])
@cross_origin()
def sampling():
    global folder_to_augment, augmentedfolder,currentNo,className
    if request.method == "POST":

        data = request.get_json()
        create_folder(app.config["EXTRACTION_FOLDER"])
        folder_to_extract_to = create_folder_entry(app.config['EXTRACTION_FOLDER'], "extracted")
        folder_to_extract_from = app.config['TRAIN_FOLDER']
        sampleDataStratified(folder_to_extract_from, folder_to_extract_to, data['sample'],data['className'])

        folder_to_augment = folder_to_extract_to
        delete_folder(app.config["GRID_EXTRACTED_FOLDER"]) 
        create_folder(app.config["GRID_EXTRACTED_FOLDER"])
        currentNo = 0
        copy_rename_recursive(folder_to_augment, app.config["GRID_EXTRACTED_FOLDER"])
        className="NULL"
        return str(len(os.listdir(app.config["GRID_EXTRACTED_FOLDER"])))
    return "0 Images sampled"


@app.route('/train-percent', methods = ['POST'])
@cross_origin()
def trainPercent():
    global augmentedfolder
    if request.method == "POST":

        data = request.get_json()
        
        if(augmentedfolder==""):
            if(folder_to_augment==""):
                return "Images not found"
            augmentedfolder = folder_to_augment
        trainValSplit(augmentedfolder,app.config["TRAIN_FOLDER"],app.config["VALIDATION_FOLDER"],data["train"])


    return 'OK'
@app.route('/train-model', methods = ['POST'])
@cross_origin()
def trainModel():
    
    if request.method == "POST":

        data = request.get_json()
        model_type = data['model']
        epochs=data['epochs']
        output_folder = create_folder_entry(app.config["MODELS_FOLDER"],model_type,"v")
        
        model_loc = os.path.join(app.config["MODELS_FOLDER"], model_type+'_v1')
        weights_loc = os.path.join(model_loc, 'weights.h5')
        json_loc = os.path.join(model_loc, 'model.json')
        img_loc = os.path.join(model_loc, 'model.svg')

        shutil.copy(weights_loc, output_folder)
        shutil.copy(json_loc, output_folder)
        shutil.copy(img_loc, output_folder)

        train_model(app.config['TRAIN_FOLDER'], app.config["VALIDATION_FOLDER"], output_folder, model_type)
        PLOT(output_folder)

    return 'OK'

@app.route('/augment', methods=[ 'POST','GET'])
@cross_origin()
def augmentation():
    global augmentedfolder, folder_to_augment,className,currentNo
    if request.method == "POST":
        data = request.get_json()
        for key in data:
            for i in range(len(data[key])):
                if(isinstance(data[key][i], str)):
                    data[key][i] = float(data[key][i]) if data[key][i]!="" else 0
        
    
        if(folder_to_augment==""):
            print("Augmentation folder not found")
            return "0"
        else:
            create_folder(app.config["AUGMENTATION_FOLDER"])
            augmentedfolder = create_folder_entry(app.config["AUGMENTATION_FOLDER"], "augmented")

            classId = str(label_id[className]) if className!="NULL" else "NULL"
            if(classId!="NULL"):
                create_folder(os.path.join(augmentedfolder,classId))
            apply_augmentation_recursive(folder_to_augment, augmentedfolder, data,classId)
        print("Augmentation complete")
        delete_folder(app.config["GRID_AUGMENTED_FOLDER"]) 
        create_folder(app.config["GRID_AUGMENTED_FOLDER"])
        currentNo = 0
        copy_rename_recursive(augmentedfolder, app.config["GRID_AUGMENTED_FOLDER"])

        return str(len(os.listdir(app.config["GRID_AUGMENTED_FOLDER"])))
        

    return 'OK'

@app.route("/static/<path:path>" , methods=['GET'])
@cross_origin()
def static_dir(path):
    return send_from_directory("static", path)    

@app.route('/view-data-stats', methods = ['POST', 'GET'])
@cross_origin()
def view_data_stats():
    if request.method == 'GET':
        folder1 = app.config['TRAIN_FOLDER']
        folder2 = app.config['VALIDATION_FOLDER']
        # print(folder)
        stats = getCardStats(folder1, folder2)
        # print(stats)
        dataOG, dataAUG = getGraphStats(folder1, folder2)
        data = {'cardData': stats, 'dataOG': dataOG, 'dataAUG': dataAUG}
    return jsonify(data)



@app.route('/model-performance', methods = ['POST', 'GET'])
@cross_origin()
def model_stats():

    if request.method == 'GET':
        stats = get_model_stats(app.config["MODELS_FOLDER"])       

    return jsonify(stats)


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=8000)                               
