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

ROOT_FOLDER="../frontend/src/data/"
UPLOAD_FOLDER = ROOT_FOLDER+'uploads/'
EXTRACTION_FOLDER = ROOT_FOLDER+'extracted/'
AUGMENTATION_FOLDER = ROOT_FOLDER+'augmented/'
DATASET_FOLDER = ROOT_FOLDER+'dataset/'
TRAIN_FOLDER = DATASET_FOLDER+'train/'
VALIDATION_FOLDER = DATASET_FOLDER+'validation/'
TEST_FOLDER = DATASET_FOLDER+'test/'


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

app.config.update(SECRET_KEY=os.urandom(24))
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


folder_to_augment = ""
augmentedfolder = ""
className=""
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

create_folder(app.config["ROOT_FOLDER"])
create_folder(app.config["UPLOAD_FOLDER"])
create_folder(app.config["EXTRACTION_FOLDER"])
create_folder(app.config["AUGMENTATION_FOLDER"])
create_folder(app.config["DATASET_FOLDER"])
create_folder(app.config["TRAIN_FOLDER"])
create_folder(app.config["VALIDATION_FOLDER"])
create_folder(app.config["TEST_FOLDER"])

@app.route('/upload-file', methods=[ 'POST','GET'])
@cross_origin()
def upload_file():

    global folder_to_augment,className
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return "No file part"

        file = request.files['file']
        className = request.args.get('className')
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
            
            shutil.rmtree(os.path.splitext(os.path.join(app.config['EXTRACTION_FOLDER'], 'images'))[0]) 
            filename = secure_filename(file.filename)
            create_folder(app.config["UPLOAD_FOLDER"])
            create_folder(app.config["EXTRACTION_FOLDER"])
            # uploaded_folder = create_folder_entry(app.config['UPLOAD_FOLDER'],"uploaded")
            file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))  
            
            print("File uploaded to "+os.path.join(uploaded_folder,filename))
            print("Unzipping "+ filename)
            # newfoldername = create_folder_entry(app.config['EXTRACTION_FOLDER'],"extracted")

            with zipfile.ZipFile(os.path.join(app.config["UPLOAD_FOLDER"], filename), 'r') as zip_ref:
                print(zip_ref)
                zip_ref.extractall(app.config['EXTRACTION_FOLDER'])
                # zip_ref.extractall('../frontend/src/assets/uploaded')                
            
            print("Unzipped to "+app.config['EXTRACTION_FOLDER'])
            folder_to_augment = os.path.splitext(os.path.join(app.config['EXTRACTION_FOLDER'], filename))[0]

            # change_name(os.path.splitext(os.path.join(newfoldername, filename))[0])
            # print(os.path.splitext(os.path.join('../frontend/src/assets/uploaded', filename)))
            
            change_name(os.path.splitext(os.path.join(app.config['EXTRACTION_FOLDER'], filename))[0])
            print('Number Of Images')
            entries = os.listdir(os.path.splitext(os.path.join(app.config['EXTRACTION_FOLDER'], filename))[0])
            print(len(entries))
            return str(len(entries))
            # test_name(os.path.splitext(os.path.join('../frontend/src/assets/uploaded', filename))[0])

    return 'OK'

def change_name(upload_folder):
    entries = os.listdir(upload_folder)
    print('No of files')
    print(entries)
    i =0
    for entry in entries:
        filename, file_extension = os.path.splitext(entry)
        # print(entry)
        os.rename(os.path.join(upload_folder,entry),os.path.join(upload_folder,str(i)+'.png'))
        i=i+1


# def test_name(upload_folder):
#     entries = os.listdir(upload_folder)
#     i =0
#     for entry in entries:
#         print(entry)


@app.route('/get-images', methods=['GET'])
@cross_origin()
def images_number():
    entries = os.listdir('../frontend/src/assets/uploaded/images')
    print(len(entries))
    return str(len(entries))



@app.route('/uploads/extracted/images/<filename>', methods=['GET'])
@cross_origin()
def uploaded_file(filename):
    return send_from_directory(app.config['EXTRACTION_FOLDER'],
                               filename)



@app.route('/sample', methods = ['POST'])
@cross_origin()
def sampling():
    global folder_to_augment, augmentedfolder
    if request.method == "POST":

        data = request.get_json()
        create_folder(app.config["EXTRACTION_FOLDER"])
        folder_to_extract_to = create_folder_entry(app.config['EXTRACTION_FOLDER'], "extracted")
        folder_to_extract_from = app.config['TRAIN_FOLDER']
        sampleData(folder_to_extract_from, folder_to_extract_to, data['sample'])

        augmentedfolder = folder_to_extract_to
        folder_to_augment = folder_to_extract_to
        print(folder_to_augment)

    return 'OK'


@app.route('/train-percent', methods = ['POST'])
@cross_origin()
def trainPercent():
    global augmented_folder
    if request.method == "POST":

        data = request.get_json()
        print(data)
        """COMPLETE THIS : ADD to dataset
        """
        if(augmentedfolder==""):
            return "Did not find images to augment"
        imgs = os.listdir(augmentedfolder)
        trainLen = len(imgs) * (data['train']/100)
        trainImgs = random.sample(imgs, trainLen)
        valImgs = [x for x in imgs if x not in trainImgs]
        # Rename images in train folder to match
        maxnTrain = max(list(map(int, [list(x.split('.'))[0] for x in os.listdir(app.config["TRAIN_FOLDER"])])))
        maxnVal = max(list(map(int, [list(x.split('.'))[0] for x in os.listdir(app.config["VALIDATION_FOLDER"])])))
        i = maxnTrain+1
        for img in trainImgs:
            ext = '.' + img.split('.')[-1]
            dest = os.path.join(app.config["TRAIN_FOLDER"], str(i)+ext)
            i += 1
            shutil.copy(os.path.join(augmentedfolder,img), dest)
        i = maxnVal+1
        for img in valImgs:
            ext = '.' + img.split('.')[-1]
            dest = os.path.join(app.config["VALIDATION_FOLDER"], str(i)+ext)
            i += 1
            shutil.copy(os.path.join(augmentedfolder,img), dest)


    return 'OK'

@app.route('/augment', methods=[ 'POST','GET'])
@cross_origin()
def augmentation():
    global augmentedfolder, folder_to_augment,className
    if request.method == "POST":
        data = request.get_json()
        for key in data:
            for i in range(len(data[key])):
                if(isinstance(data[key][i], str)):
                    data[key][i] = float(data[key][i]) if data[key][i]!="" else 0
        
    
        if(folder_to_augment==""):
            print("Augmentation folder not found")
            return 'Augmentation folder not found'
        else:
            create_folder(app.config["AUGMENTATION_FOLDER"])
            augmentedfolder = create_folder_entry(app.config["AUGMENTATION_FOLDER"], "augmented")
    
            apply_augmentation_recursive(folder_to_augment, augmentedfolder, data,className)
        print("Augmentation complete")
    
    return 'OK'

@app.route("/static/<path:path>" , methods=['GET'])
@cross_origin()
def static_dir(path):
    return send_from_directory("static", path)    

@app.route('/view-data-stats', methods = ['POST', 'GET'])
@cross_origin()
def view_data_stats():
    if request.method == 'GET':
        folder = app.config['DATASET_FOLDER']
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

