import os
import shutil
import random

def sampleData(folder_to_extract_from, folder_to_extract_to, percent):

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
    sub_folders = [os.path.join(folder_to_extract_from, sub_folder) for sub_folder in sub_folders]

    # total number of classes
    num_classes = len(sub_folders)

    # total number of images
    total_imgs = 0
    for sub_folder in sub_folders:
        total_imgs += len(os.listdir(sub_folder))

    # getting the required number of images using percentage of sampling     
    percent_of_imgs = percent*total_imgs//100

    # number of images to extract from each class (for balanced sampling)
    imgs_per_class = percent_of_imgs//num_classes + 1
    
    i = 1
    for sub_folder in sub_folders:
        imgs = os.listdir(sub_folder)
        imgs = [os.path.join(sub_folder, img) for img in imgs]
        n = min(imgs_per_class, len(imgs))
        sample_imgs = random.sample(imgs, n)
                
        for img in sample_imgs:
            ext = '.' + img.split('.')[-1]
            dest = os.path.join(folder_to_extract_to, str(i)+ext)
            i += 1
            shutil.copy(img, dest)
        
    print(f'{i-1} Images Sampled.')
