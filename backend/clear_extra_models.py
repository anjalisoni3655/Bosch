import os

import shutil

path = "./static/models/"
lis=os.listdir(path)
for model in lis:
    version = int(list(model.split('_'))[1][1:])
    if(version >1):
        shutil.rmtree(os.path.join(path,model))