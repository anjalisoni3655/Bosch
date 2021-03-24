import os
import numpy as np 

Id2Label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons', 43: 'No Stopping', 44: 'Cross Road', 45: 'No passing Cars', 46: 'Route for Pedal Cycles Only', 47: 'Separated Track for Pedal Cyclists and Pedestrians Only', 48: 'Parking Sign', 49: 'Tonnage Limits'}

def getCardStats(folder1, folder2):
    
    '''
    total_images = 0
    num_classes = 0
    avg_class_size = 0
    max_class = ''
    '''

    stats = {}

    subfolders = os.listdir(folder1)
    class_sizes = {}
    
    for subfolder in subfolders:
        class_sizes[subfolder] = len(os.listdir(os.path.join(folder1, subfolder))) + len(os.listdir(os.path.join(folder2, subfolder)))

    vals = list(class_sizes.values())
    vals = np.array(vals)
    keys = list(class_sizes.keys())
    
    stats['num_classes'] = len(subfolders)
    stats['avg_class_size'] = int(np.mean(vals))
    stats['total_images'] = int(np.sum(vals))
    stats['max_class'] = Id2Label[int(keys[np.argmax(vals)])]

    return stats




def getGraphStats(folder1, folder2):
    ORIGINAL_DATA = {0: 210, 1: 2220, 2: 2250, 3: 1410, 4: 1980, 5: 1860, 6: 420, 7: 1440, 8: 1410, 9: 1470, 10: 2010, 11: 1320, 12: 2100, 13: 2160, 14: 780, 15: 630, 16: 420, 17: 1110, 18: 1200, 19: 210, 20: 360, 21: 330, 22: 390, 23: 510, 24: 270, 25: 1500, 26: 600, 27: 240, 28: 540, 29: 270, 30: 450, 31: 780, 32: 240, 33: 689, 34: 420, 35: 1200, 36: 390, 37: 210, 38: 2070, 39: 300, 40: 360, 41: 240, 42: 240, 43: 559, 44: 800, 45: 930, 46: 430, 47: 1305, 48: 1000, 49: 1490}
    
    subfolders = os.listdir(folder1)
    subfolders.sort(key = int)
    class_sizes = {}
    
    for subfolder in subfolders:
        class_sizes[int(subfolder)] = len(os.listdir(os.path.join(folder1, subfolder))) + len(os.listdir(os.path.join(folder2, subfolder))) - ORIGINAL_DATA[int(subfolder)]

    outAug = []
    for i in class_sizes.keys():
        outAug.append({'label': Id2Label[i], 'y': class_sizes[i]})
    
    outOg = []
    for i in class_sizes.keys():
        outOg.append({'label': Id2Label[i], 'y': ORIGINAL_DATA[i]})
    
    return outOg, outAug

# print(getGraphStats('dataset'))
    


        
