import os
import shutil
import random

id_label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons'}
label_id = {v: k for k, v in id_label.items()}

def create_folder(foldername):
    if not os.path.exists(foldername):
        os.makedirs(foldername)

def delete_folder(foldername):
    if not os.path.exists(foldername):
        shutil.rmtree(foldername)

def getMaxFile(foldername,prefix=''):
    return len(os.listdir(foldername))-1




def create_folder_entry(root,foldername,prefix=""):
    lis = os.listdir(root)
    
    maxn = 0
    for i in lis:
        if os.path.isdir(os.path.join(root,i)):
            first = list(i.split('_'))[1][len(prefix):]
            
            if(list(i.split('_'))[0]==foldername):
                maxn = max(maxn,int(first))

    maxn+=1
    
    create_folder(os.path.join(root,foldername+"_"+prefix+str(maxn)))
    return os.path.join(root,foldername+"_"+prefix+str(maxn))

def sampleDataStratified(folder_to_extract_from, folder_to_extract_to, percent,className):

    '''
    Directory structure of the folder where images have to be sampled from
    |---Dataset   
    |   |
    |   |---class1
    |   |   |---img1
    |   |   |---img2
    |   |   |---img3
    |   |   
    |   |---class2
    |   |   |---img1
    |   |   |---img2
    |   |   |---img3
    '''

    sub_folders = os.listdir(folder_to_extract_from)
    # sub_folders = [os.path.join(folder_to_extract_from, sub_folder) for sub_folder in sub_folders]

    if(className!="NULL"):
        sub_folders=[str(label_id[className])]
        


    
    
    i = 0
    for sub_folder in sub_folders:
        src = os.path.join(folder_to_extract_from, sub_folder)
        imgs = os.listdir(src)
        imgs = [os.path.join(src, img) for img in imgs]
        dest = os.path.join(folder_to_extract_to,sub_folder)
        create_folder(dest)
        imgs_per_class = (len(os.listdir(src))*percent)//100
        n = min(imgs_per_class, len(imgs))
        sample_imgs = random.sample(imgs, n)
                
        for img in sample_imgs:
            ext = '.' + img.split('.')[-1]
            destFinal = os.path.join(dest, str(i)+ext)
            i += 1
            shutil.copy(img, destFinal)
        
    print(f'{i} Images Sampled.')


def trainValSplit(folder_to_extract_from, trainDir,valDir, trainPercent):

    '''
    Directory structure of the folder where images have to be sampled from
    |---Dataset   
    |   |
    |   |---class1
    |   |   |---img1
    |   |   |---img2
    |   |   |---img3
    |   |   
    |   |---class2
    |   |   |---img1
    |   |   |---img2
    |   |   |---img3
    '''

    sub_folders = os.listdir(folder_to_extract_from)
      
    
    
    for sub_folder in sub_folders:
        src = os.path.join(folder_to_extract_from, sub_folder)
        imgs = os.listdir(src)
        imgs = [os.path.join(src, img) for img in imgs]
        destTrain = os.path.join(trainDir,sub_folder)
        destVal = os.path.join(valDir,sub_folder)
        create_folder(destTrain)
        create_folder(destVal)
        imgs_per_class = (len(os.listdir(src))*trainPercent)//100
        n = min(imgs_per_class, len(imgs))
        sample_imgs_train = list(random.sample(imgs, n))
        sample_imgs_val = [x for x in imgs if x not in sample_imgs_train]
        i = getMaxFile(destTrain) +1
        for img in sample_imgs_train:
            ext = '.' + img.split('.')[-1]
            destFinal = os.path.join(destTrain, str(i)+ext)
            i += 1
            shutil.copy(img, destFinal)
        i = getMaxFile(destVal)+1
        for img in sample_imgs_val:
            ext = '.' + img.split('.')[-1]
            destFinal = os.path.join(destVal, str(i)+ext)
            i += 1
            shutil.copy(img, destFinal)
        
    print("Train test split done")
