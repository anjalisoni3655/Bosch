import os
# We'll render HTML templates and access data sent by POST
# using the request object from flask. Redirect and url_for
# will be used to redirect the user once the upload is done
# and send_from_directory will help us to send/show on the
# browser the file that the user just uploaded
from flask import Flask, flash, render_template, request, redirect, url_for, send_from_directory, session
# from werkzeug import secure_filename
from werkzeug.utils import secure_filename
from werkzeug.datastructures import  FileStorage
from flask_cors import CORS
import logging

# Initialize the Flask application
app = Flask(__name__)

# This is the path to the upload directory
app.config['UPLOAD_FOLDER'] = 'uploads/'
# These are the extension that we are accepting to be uploaded
app.config['ALLOWED_EXTENSIONS'] = set(['txt', 'pdf', 'png', 'jpg', 'jpeg', 'gif', 'zip'])
CORS(app, expose_headers='Authorization')

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger('HELLO WORLD')

# For a given file, return whether it's an allowed type or not
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1] in app.config['ALLOWED_EXTENSIONS']

# This route will show a form to perform an AJAX request
# jQuery is loaded to execute the request and update the
# value of the operation
@app.route('/')
def index():
    return render_template('index.html')


# Route that will process the file upload
@app.route('/upload', methods=['POST'])
def upload():
    # # Get the name of the uploaded files
    # print(request)
    # uploaded_files = request.files('file')
    # filenames = []
    # for file in uploaded_files:
    #     # Check if the file is one of the allowed types/extensions

    #     if file:
    #         # Make the filename safe, remove unsupported chars
    #         filename = secure_filename(file.filename)
    #         print(file.filename)
    #         # Move the file form the temporal folder to the upload
    #         # folder we setup
    #         file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
    #         # Save the filename into a list, we'll use it later
    #         filenames.append(filename)
    #         # Redirect the user to the uploaded_file route, which
    #         # will basicaly show on the browser the uploaded file
    # # Load an html page with a link to each uploaded file
    # return render_template('upload.html', filenames=filenames)
    # target = os.path.join(app.config['UPLOAD_FOLDER'], 'test')
    # if not os.path.isdir(target):
    #     os.mkdir(target)
    # logger.info("welcome to upload`")
    # file = request.files['file']
    # filename = secure_filename(file.filename)
    # destination = "/".join([target, filename])
    # file.save(destination)
    # session['uploadFilePath'] = destination
    # response = "Whatever you wish too return"
    # return response
    if request.method == 'POST':
        # check if the post request has the file part
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        # if user does not select file, browser also
        # submit an empty part without filename
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return redirect(url_for('uploaded_file',
                                    filename=filename))
    return '''
    <!doctype html>
    <title>Upload new File</title>
    <h1>Upload new File</h1>
    <form method=post enctype=multipart/form-data>
      <input type=file name=file>
      <input type=submit value=Upload>
    </form>
    '''

# This route is expecting a parameter containing the name
# of a file. Then it will locate that file on the upload
# directory and show it on the browser, so if the user uploads
# an image, that image is going to be show after the upload
@app.route('/uploads/<filename>')
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'],
                               filename)

if __name__ == '__main__':
    app.secret_key = os.urandom(24)    
    app.run(
        host="0.0.0.0",
        port=int("80"),
        debug=True
    )