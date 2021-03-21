import os
from flask import Flask, flash, request, redirect, url_for
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


UPLOAD_FOLDER = 'static/uploads'
EXTRACTION_FOLDER = 'static/extracted'
AUGMENTATION_FOLDER = 'static/augmented'
DATASET_FOLDER = 'static/dataset'
ALLOWED_EXTENSIONS = {'zip'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['EXTRACTION_FOLDER'] = EXTRACTION_FOLDER
app.config['AUGMENTATION_FOLDER'] = AUGMENTATION_FOLDER
app.config['DATASET_FOLDER'] = DATASET_FOLDER


app.config.update(SECRET_KEY=os.urandom(24))
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


folder_to_augment = ""

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


@app.route('/upload', methods=[ 'POST','GET'])
@cross_origin()
def upload_file():

    global folder_to_augment
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            return "No file part"

        file = request.files['file']

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
            
            print("File uploaded to "+os.path.join(app.config['UPLOAD_FOLDER'],filename))
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

    if request.method == "POST":

        data = request.get_json()
        create_folder(app.config["EXTRACTION_FOLDER"])
        folder_to_extract_to = create_folder_entry(app.config['EXTRACTION_FOLDER'], "extracted")
        folder_to_extract_from = app.config['DATASET_FOLDER']
        sampleData(folder_to_extract_from, folder_to_extract_to, data['sample'])

        global folder_to_augment
        folder_to_augment = folder_to_extract_to
        print(folder_to_augment)

    return 'OK'



@app.route('/augment', methods=[ 'POST','GET'])
@cross_origin()
def augmentation():

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
    
            apply_augmentation(folder_to_augment, augmentedfolder, data)
        print("Augmentation complete")
    print("Aug comp")
    return 'OK'

@app.route("/static/<path:path>" , methods=['GET'])
@cross_origin()
def static_dir(path):
    return send_from_directory("static", path)    

if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.run(debug=True, port=8000)                               

