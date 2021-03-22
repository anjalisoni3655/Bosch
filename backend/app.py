import os
from flask import Flask, flash, request, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask_cors import CORS, cross_origin
import json
import zipfile
from augmentations import *
from sample import *
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

ALLOWED_EXTENSIONS = {'zip'}

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

id_label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons'}
label_id = {v: k for k, v in id_label.items()}

app.config.update(SECRET_KEY=os.urandom(24))
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


folder_to_augment = ""
augmentedfolder = ""
className=""
currentNo = 0

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def create_folder(foldername):
    if not os.path.exists(foldername):
        os.makedirs(foldername)

def create_folder_entry(root,foldername):
    lis = os.listdir(root)
    
    maxn = 0
    for i in lis:
        if os.path.isdir(os.path.join(root,i)):
            
            maxn = max(maxn,int(list(i.split('_'))[1]))

    maxn+=1
    create_folder(os.path.join(root,foldername+"_"+str(maxn)))
    return os.path.join(root,foldername+"_"+str(maxn))

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
            shutil.rmtree(app.config["GRID_EXTRACTED_FOLDER"]) 
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
        sampleDataStratified(folder_to_extract_from, folder_to_extract_to, data['sample'])

        folder_to_augment = folder_to_extract_to
        shutil.rmtree(app.config["GRID_EXTRACTED_FOLDER"]) 
        create_folder(app.config["GRID_EXTRACTED_FOLDER"])
        currentNo = 0
        copy_rename_recursive(folder_to_augment, app.config["GRID_EXTRACTED_FOLDER"])
        className="NULL"
        return str(len(os.listdir(app.config["GRID_EXTRACTED_FOLDER"])))
    return "0"


@app.route('/train-percent', methods = ['POST'])
@cross_origin()
def trainPercent():
    global augmentedfolder
    if request.method == "POST":

        data = request.get_json()
        print(data)
        """COMPLETE THIS : ADD to dataset
        """
        if(augmentedfolder==""):
            augmentedfolder = folder_to_augment
            return "Did not find augmented images"
        trainValSplit(augmentedfolder,app.config["TRAIN_FOLDER"],app.config["VALIDATION_FOLDER"],data["train"])


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
        shutil.rmtree(app.config["GRID_AUGMENTED_FOLDER"]) 
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
        folder = app.config['TRAIN_FOLDER']
        # print(folder)
        stats = getCardStats(folder)
        # print(stats)
        dataOG, dataAUG = getGraphStats(folder)
        data = {'cardData': stats, 'dataOG': dataOG, 'dataAUG': dataAUG}
    return jsonify(data)


if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=8000)                               
