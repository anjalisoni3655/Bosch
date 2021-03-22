import cv2 
import os
import albumentations as A

id_label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons'}
label_id = {v: k for k, v in id_label.items()}

def create_folder(foldername):
    if not os.path.exists(foldername):
        os.makedirs(foldername)
        
# -1 : 1 (double slider with step = 0.1)
def brightness(params, p):
    low, high = params
    return A.RandomBrightness(limit = (low, high), p = p)

# -1 : 1 (double slider with step = 0.1)
def contrast(params, p):
    low, high = params
    return A.RandomContrast(limit = (low, high), p = p)


# 0:50 (double slider with step = 1)
def noise(params, p):
    low, high = params
    return A.GaussNoise(var_limit = (low, high), p = p)

# 0:1 (double slider)
def fog(params, p):
    low, high = params
    return A.RandomFog(fog_coef_lower = low, fog_coef_upper = high, p = p)


# 0:5 (double slider with step = 1)
def shadow(params, p):
    low, high = params
    return A.RandomShadow(num_shadows_lower = low, num_shadows_upper = high, p = p)

# 0:1 (double slider with step = 0.1)
def snow(params, p):
    low, high = params
    return A.RandomSnow(snow_point_lower = low, snow_point_upper = high, p = p)

# 0:20 (double slider with step = 1)
def sunflare(params, p):
    low, high = params
    return A.RandomSunFlare(num_flare_circles_lower = low, num_flare_circles_upper = high, p = p)

# 0:1 (single slider with step = 0.1)
def shear(params, p):
    shear = params
    return A.IAAAffine(shear = shear, p = p)

# no input
def blur(params, p):
    low, high = params
    return A.Blur(p = p)

# no input
def degrade(params, p):
    return A.Downscale(p = p)

# radio -- One of [None, "drizzle", "heavy", "torrestial"]
def rain(params, p):
    rain_types = {0:"drizzle", 1:"heavy", 2:"torrestial"}
    rain_type = rain_types[params[0]]
    return A.RandomRain(rain_type = rain_type, p = p)

def augmentImgs(imgs, parameters):
    augs = {"brightness":brightness, "contrast":contrast,  "noise":noise, "fog":fog, "shadow": shadow, "snow": snow, "sunflare": sunflare, "shear": shear, "blur":blur, "degrade":degrade,  "rain":rain}
    out_imgs = []
    
    for img in imgs:
        transforms = []

        for aug in augs:
            if(aug in parameters):
                
                params = parameters[aug]
                p = params[-1]
                param = params[:-1]
                transforms.append(augs[aug](param, p))

        transform = A.Compose(transforms)
        out_img = transform(image = img)
        out_img = out_img['image']
        out_imgs.append(out_img)
    
    return out_imgs


def apply_augmentation(folder,outfolder,parameters):
    print(folder)
    print(outfolder)
    imgs = []
    imgnames = []
    if not os.path.exists(outfolder):
        os.makedirs(outfolder)
    for file in os.listdir(folder):
        
        img = cv2.imread(os.path.join(folder ,file))
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        imgs.append(img)
        imgnames.append(file)
    
    out_imgs = augmentImgs(imgs, parameters)

    for i, img in enumerate(out_imgs):
        img = cv2.cvtColor(img, cv2.COLOR_RGB2BGR)
    
        cv2.imwrite(os.path.join(outfolder,imgnames[i]), img)
def isOnlyFiles(folder):
    lis = os.listdir(folder)
    x = 1
    for i in lis:
        if(os.path.isdir(os.path.join(folder,i))):
            x=0
            break
    return x
def isOnlyFolders(folder):
    lis = os.listdir(folder)
    x = 1
    for i in lis:
        if(os.path.isfile(os.path.join(folder,i))):
            x=0
            break
    return x

def apply_augmentation_recursive(folder,outfolder,parameters,classId="NULL"):
    
    if(classId!="NULL"):
        lis = os.listdir(folder)
        if(isOnlyFiles(folder)):
            apply_augmentation(folder,os.path.join(outfolder,classId),parameters)
        elif(len(lis)==1 and isOnlyFiles(os.path.join(folder,lis[0]))):
            apply_augmentation(os.path.join(folder,lis[0]),os.path.join(outfolder,classId),parameters)
    else:
        lis=os.listdir(folder)
        print(lis)
        
        if(len(lis)==1 and isOnlyFolders(os.path.join(folder,lis[0]))):
            apply_augmentation_recursive(os.path.join(folder,lis[0]),outfolder,parameters,classId)
        elif(isOnlyFolders(folder)):
            print(lis[0])
            if int(lis[0]) in id_label:
                labels=0
            elif lis[0] in label_id:
                labels=1
            else:
                print("Incorrect directory naming")
                return
            for x in lis:
                if(labels==1):
                    create_folder(os.path.join(outfolder,str(label_id[x])))
                    apply_augmentation(os.path.join(folder,x), os.path.join(outfolder,str(label_id[x])),parameters)
                else:
                    create_folder(os.path.join(folder,str(x)))
                    apply_augmentation(os.path.join(folder,x), os.path.join(outfolder,str(x)),parameters)
        else:
            print("Incorrect Directory format")

