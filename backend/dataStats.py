import os
import numpy as np 

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
        class_sizes[subfolder] = len(os.listdir(os.path.join(folder, subfolder)))

    vals = list(class_sizes.values())
    vals = np.array(vals)
    keys = list(class_sizes.keys())
    
    stats['num_classes'] = len(subfolders)
    stats['avg_class_size'] = int(np.mean(vals))
    stats['total_images'] = int(np.sum(vals))
    stats['max_class'] = int(keys[np.argmax(vals)])


    return stats

# print(cardStats('dataset'))
    


        
