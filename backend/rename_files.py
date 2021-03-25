import os 
import cv2



root='./static/dataset/train/'
for folder in os.listdir(root):
    i = 0
    files=os.listdir(os.path.join(root,folder))
    for file in files:
        filepath = os.path.join(root,folder,file)
        newfilepath=filepath[:-4]+".png"
        img=cv2.imread(filepath)
        cv2.imwrite(newfilepath,img)
        os.remove(filepath)
        # print(filepath)
        # print(newfilepath)
        i+=1


root='./static/dataset/validation/'
for folder in os.listdir(root):
    i = 0
    files=os.listdir(os.path.join(root,folder))
    for file in files:
        filepath = os.path.join(root,folder,file)
        newfilepath=filepath[:-4]+".png"
        img=cv2.imread(filepath)
        cv2.imwrite(newfilepath,img)
        os.remove(filepath)
        # print(filepath)
        # print(newfilepath)
        i+=1

