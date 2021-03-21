import os
import numpy as np 

Id2Label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons'}

def getCardStats(folder):
    
    '''
    total_images = 0
    num_classes = 0
    avg_class_size = 0
    max_class = ''
    '''

    stats = {}

    subfolders = os.listdir(folder)
    class_sizes = {}
    
    for subfolder in subfolders:
        class_sizes[subfolder] = len(os.listdir(os.path.join(folder, subfolder)))-1

    vals = list(class_sizes.values())
    vals = np.array(vals)
    keys = list(class_sizes.keys())
    
    stats['num_classes'] = len(subfolders)
    stats['avg_class_size'] = int(np.mean(vals))
    stats['total_images'] = int(np.sum(vals))
    stats['max_class'] = Id2Label[int(keys[np.argmax(vals)])]


    return stats




def getGraphStats(folder):
    ORIGINAL_DATA = {0: 211, 1: 2221, 10: 2011, 11: 1321, 12: 2101, 13: 2161, 14: 781, 15: 631, 16: 421, 17: 1111, 18: 1201, 19: 211, 2: 2251, 20: 361, 21: 331, 22: 391, 23: 511, 24: 271, 25: 1501, 26: 601, 27: 241, 28: 541, 29: 271, 3: 1411, 30: 451, 31: 781, 32: 241, 33: 690, 34: 421, 35: 1201, 36: 391, 37: 211, 38: 2071, 39: 301, 4: 1981, 40: 361, 41: 241, 42: 241, 5: 1861, 6: 421, 7: 1441, 8: 1411, 9: 1471}
    
    subfolders = os.listdir(folder)
    subfolders.sort()
    class_sizes = {}
    
    for subfolder in subfolders:
        class_sizes[int(subfolder)] = len(os.listdir(os.path.join(folder, subfolder))) - ORIGINAL_DATA[int(subfolder)]+100

    outAug = []
    for i in class_sizes.keys():
        outAug.append({'label': Id2Label[i], 'y': class_sizes[i]})
    
    outOg = []
    for i in class_sizes.keys():
        outOg.append({'label': Id2Label[i], 'y': ORIGINAL_DATA[i]})
    
    return outOg, outAug

# print(getGraphStats('dataset'))
    


        
