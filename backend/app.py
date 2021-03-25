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
from postEval import *
from threading import Thread
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

DISP_IMG_SIZE = 600

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
delete_folder(app.config["GRID_AUGMENTED_FOLDER"])
delete_folder(app.config["GRID_EXTRACTED_FOLDER"])

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
            
            # i = cv2.imread(os.path.join(src,x))
            filename = str(currentNo)+".png"
            # i = cv2.resize(i, (DISP_IMG_SIZE,DISP_IMG_SIZE))
            # cv2.imwrite(os.path.join(dest,filename),i)  
            img = Image.open(os.path.join(src,x))
            img = img.resize((DISP_IMG_SIZE,DISP_IMG_SIZE),Image.NEAREST)
            img.save(os.path.join(dest,filename))
            # shutil.copy(os.path.join(src,x),os.path.join(dest,filename))
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
            return "No file part",201

        file = request.files['file']
        className = str(request.args.get('className'))
        print("Url ", request.url)
        print("Class name : ",className)
        # if user does not select file, browser also
        # submit an empty part without filename
        
        if file.filename == '':
            
            return "No file selected",201

        elif not allowed_file(file.filename):
            print("Unsupported file extension, Please upload .zip")
            return "Unsupported file extension, Please use .zip",201
        
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


    return "Malformed query",201




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
    return "request malformed",201


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

        return str(len(os.listdir(app.config["GRID_AUGMENTED_FOLDER"])))
    return 'Request malformed',201
@app.route('/train-model', methods = ['POST'])
@cross_origin()
def trainModel():
    
    if request.method == "POST":

        data = request.get_json()
        model_type = data['model']
        epochs=data['epochs']
        lr=data['lr']
        optimizer=data['optimizer']
        print(data)
        output_folder = create_folder_entry(app.config["MODELS_FOLDER"],model_type,"v")
        
        
        model_loc = os.path.join(app.config["MODELS_FOLDER"], model_type+'_v1')
        weights_loc = os.path.join(model_loc, 'weights.h5')
        json_loc = os.path.join(model_loc, 'model.json')
        img_loc = os.path.join(model_loc, 'model.svg')
        
        
        for i in range(8):
            gc_loc = os.path.join(model_loc, f'{i}.png')
            if os.path.exists(gc_loc):
                shutil.copy(gc_loc, output_folder)
        
        if(os.path.exists(weights_loc)):
            shutil.copy(weights_loc, output_folder)
        if(os.path.exists(json_loc)):
            shutil.copy(json_loc, output_folder)
        if(os.path.exists(img_loc)):
            shutil.copy(img_loc, output_folder)
        model_type_lower = model_type.lower()
        thread = Thread(target=final_training_call, kwargs={'TRAIN_FOLDER':app.config['TRAIN_FOLDER'] ,'VALID_FOLDER' : app.config["VALIDATION_FOLDER"], 'OUTPUT_FOLDER':output_folder, 'model_type':model_type_lower,'EPOCHS':epochs,'learning_rate':lr,'optimizer':optimizer})
        thread.start()
        # final_training_call(app.config['TRAIN_FOLDER'], app.config["VALIDATION_FOLDER"], output_folder, model_type.lower(),epochs,lr, optimizer)
        time_estimate = str(estimate_time(model_type,epochs))
        print("ESTIMATED TIME : ",time_estimate)
        return time_estimate
    return 'Request malformed',201

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
            return "Augmentation folder not found",201
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
        

    return 'Request malformed',201

@app.route("/static/<path:path>" , methods=['GET'])
@cross_origin()
def static_dir(path):
    return send_from_directory("static", path)    


@app.route("/delete-file", methods=["POST"])
@cross_origin()
def delete_file():
    if request.method == 'POST':
       
        fileid = str(request.args.get('fileid'))
        print(request.files)
        print("File Id : ",fileid)
        os.remove(os.path.join(app.config["GRID_AUGMENTED_FOLDER"],str(fileid)+".png"))
    return "File deleted succesfully"


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

@app.route('/post-evaluation', methods = ['POST', 'GET'])
@cross_origin()
def post_eval():
    
    if request.method == "POST":

        data = request.get_json()
        model_type = data['newValue']['title']
        model_loc = os.path.join(app.config['MODELS_FOLDER'], model_type)
        cmData = get_cmdata(model_loc)
        tsne = [{"x": 1, "y": 2, "name":"hello", "color": "#3CB371"}, {"x": 3, "y": 1, "name":"hello", "color": "#2F4F4F"}, {"x": 1, "y": 4, "name":"hello", "color": "#008080"}, {"x": 4, "y": 7, "name":"hello", "color": "#90EE90"}]
        model_behavior1, dataset_changes, netwok_changes = acc_loss(model_loc)
        data = {
            "cmData": cmData,
            'tsneData': tsne,
            "model_behavior1": model_behavior1,
            "dataset_changes": dataset_changes,
            "network_changes": netwok_changes,
            "suggestions": "Model Parameters: [lr = 0.01]",
        }

        return jsonify(data)

    elif request.method == 'GET':
        print(app.config["MODELS_FOLDER"])
        model_types = get_model_types(app.config["MODELS_FOLDER"])

        data = {
            "model_types": model_types,
        }

        return jsonify(data)

    return 'OK'

@app.route('/explainable-ai', methods = ['POST', 'GET'])
@cross_origin()
def get_ai_stats():

    if request.method == 'GET':
        model_types = get_model_types(app.config["MODELS_FOLDER"])

        data = {
            "model_types": model_types,
        }

        return jsonify(data)    

    elif request.method == "POST":
        data = request.get_json()
        print(data)


        folder1 = app.config['TRAIN_FOLDER']
        folder2 = app.config['VALIDATION_FOLDER']
        
        dataOG, dataAUG = getGraphStats(folder1, folder2)
        
        data = {'plotdata': dataOG}
        
        return jsonify(data)

    return "OK"

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=8000)                               
