import os
from flask import Flask, flash, request, redirect, url_for
from werkzeug.utils import secure_filename
from flask import send_from_directory
from flask_cors import CORS, cross_origin
import json
import zipfile
from augmentations import *
UPLOAD_FOLDER = 'uploads'
EXTRACTION_FOLDER = 'extracted'
AUGMENTATION_FOLDER = 'augmented'
DATASET_FOLDER = 'dataset'
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
            filename = secure_filename(file.filename)
            create_folder(app.config["UPLOAD_FOLDER"])
            create_folder(app.config["EXTRACTION_FOLDER"])
            uploaded_folder = create_folder_entry(app.config['UPLOAD_FOLDER'],"uploaded")
            file.save(os.path.join(uploaded_folder, filename))
            
            
            print("File uploaded to "+os.path.join(app.config['UPLOAD_FOLDER'],filename))
            print("Unzipping "+ filename)
            newfoldername = create_folder_entry(app.config['EXTRACTION_FOLDER'],"extracted")
            with zipfile.ZipFile(os.path.join(uploaded_folder, filename), 'r') as zip_ref:
                zip_ref.extractall(newfoldername)
            print("Unzipped to "+newfoldername)
            folder_to_augment = newfoldername

            return 'OK'

    return 'OK'



@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

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



if __name__ == "__main__":
    app.secret_key = os.urandom(24)
    app.run(debug=True, port=8000)                               

