### German Traffic Sign Recognition Website
<h1 align="left">
  <br>
    <img src="/images/logo.jpeg" align="right" height=400px >
  <br>
  German Traffic Sign
</h1>

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![GitHub Issues](https://img.shields.io/github/issues/MLH-Fellowship/Auto-Tagger.svg)](https://github.com/anjalisoni3655/Bosch/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/MLH-Fellowship/Auto-Tagger.svg)](https://github.com/anjalisoni3655/Bosch/pulls)

<h4 align="left">An Artificial Intelligence tool that predicts Traffic signs based on various pre-trained models and allows user to manipulate datasets.  <br><br>
This repo contains:</h4>

* **A React-Flask Based ML Web App**

<br><br>
## Our Web Application
<p align="center">
<img src="/images/Demo.gif" >
</p>

## Explainable AI

GradCam Technique to identify mislabelling hotspots
<p align="center">
<img src="/images/gradcam.png" >
</p>

</br>

Using TSNE plots to visualize and evaluate model performance
<p align="center">
<img src="/images/bad_tsne.png" > 
</p>

</br>

<p align="center">
<img src="/images/good_tsne.png" > 
</p>

## Key Features 

- [x]  Create a complex Dataset    
- [x]  Train additional images on the fly    
- [x]  View model performances across different metrics    
- [x]  Visualize model performance   
- [x] Get suggestions to various shortcomings in model training    
- [x]  An explainable AI-based solution to comprehend network failures


-------

### Prerequisites

1.  [Git](https://git-scm.com/downloads).
2.  [Node & npm](https://nodejs.org/en/download/) _(version 12 or greater)_.
3.  A fork of the repo.
4. Python3 environment to install flask

### Directory Structure

The following is a high-level overview of relevant files and folders.

```
backend/
├── backend/
│   ├── template/
│   └── app.py

└── frontend/
    ├── public/
    │   ├── index.html
    │   └── ...
    ├── images/
    │   └── logo.png
    ├── src/
    │   ├── assets/
    │   │   ├── css
    │   │   └── fonts...
    │   ├── components/
    │   │   ├── Sidebar 
    │   │   └── Navbars
    │   └── views/
 
         ├── routes.js
         ├── package.json
       ├── local_vm.sh
       └── .gitignore
       
```

## Installation

### Clone

- Clone this repo to your local machine using `https://github.com/anjalisoni3655/Bosch`

### Steps to run backend

In order to install all packages follow the steps below:

1. Download the static folder from this drive: https://drive.google.com/file/d/149fh2lq7fT35RQVP5rmTgUfcYPorE9kX/view
2. Put it in the `backend/`
 3. Move to backend folder
 4. For installing virtual environment - `python3 -m pip install --user virtualenv`
 5. Create A Virtual env - `python3 -m venv env`
 6. Activate virtual env - `source env/bin/activate`
 7. `pip3 install -r requirements.txt`
 8. `flask run`

### Steps To Set Up Frontend
 1. Move to frontend folder
 2. `npm install`
 3. `npm start`



> The model will be served on **http://127.0.0.1:5000/**

-------


## License
This project is licensed under the [Apache License, Version 2.0]("licence).

