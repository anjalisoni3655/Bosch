import os
import shutil
import random
def create_folder(foldername):
    if not os.path.exists(foldername):
        os.makedirs(foldername)
def getMaxFile(foldername,prefix=''):
    i =0
    if(prefix==''):
        for x in os.listdir(foldername):
            i=max(i,int(list(list(x.split('.'))[0])[0]))
    else:
        for x in os.listdir(foldername):
            i=max(i,int(list(list(x.split('.'))[0].split(prefix))[0]))
    
    return i

def sampleDataStratified(folder_to_extract_from, folder_to_extract_to, percent):

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

    # total number of classes
    num_classes = len(sub_folders)


    
    
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
