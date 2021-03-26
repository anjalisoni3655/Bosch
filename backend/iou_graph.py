from gradcam import Iou_dataframe_generator
import pandas as pd
import os

Id2Label = {0: 'Speed limit (20km/h)', 1: 'Speed limit (30km/h)', 2: 'Speed limit (50km/h)', 3: 'Speed limit (60km/h)', 4: 'Speed limit (70km/h)', 5: 'Speed limit (80km/h)', 6: 'End of speed limit (80km/h)', 7: 'Speed limit (100km/h)', 8: 'Speed limit (120km/h)', 9: 'No passing', 10: 'No passing for vehicles over 3.5 metric tons', 11: 'Right-of-way at the next intersection', 12: 'Priority road', 13: 'Yield', 14: 'Stop', 15: 'No vehicles', 16: 'Vehicles over 3.5 metric tons prohibited', 17: 'No entry', 18: 'General caution', 19: 'Dangerous curve to the left', 20: 'Dangerous curve to the right', 21: 'Double curve', 22: 'Bumpy road', 23: 'Slippery road', 24: 'Road narrows on the right', 25: 'Road work', 26: 'Traffic signals', 27: 'Pedestrians', 28: 'Children crossing', 29: 'Bicycles crossing', 30: 'Beware of ice/snow', 31: 'Wild animals crossing', 32: 'End of all speed and passing limits', 33: 'Turn right ahead', 34: 'Turn left ahead', 35: 'Ahead only', 36: 'Go straight or right', 37: 'Go straight or left', 38: 'Keep right', 39: 'Keep left', 40: 'Roundabout mandatory', 41: 'End of no passing', 42: 'End of no passing by vehicles over 3.5 metric tons', 43: 'No Stopping', 44: 'Cross Road', 45: 'No passing Cars', 46: 'Route for Pedal Cycles Only', 47: 'Separated Track for Pedal Cyclists and Pedestrians Only', 48: 'Parking Sign', 49: 'Tonnage Limits'}

def iouGraph(thrld, output_folder, val_folder):
    

    if not os.path.exists(os.path.join(output_folder,'prediction_ious.csv')):
        Iou_dataframe_generator(os.path.join(output_folder, 'model.json'),os.path.join(output_folder, 'weights.h5'),'last_conv',
                            os.path.join(output_folder, 'Preds_gradcam.csv'), Dirpath = val_folder, output_folder = output_folder)


    try:
        df = pd.read_csv(os.path.join(output_folder,'prediction_ious.csv'))
        out = []

        for i in range(50):
            #print('hi')

            dict_ = {}
            df_i = df[df['labels']==i]
            df_thrld = df_i[df_i['iou']<=thrld]

            dict_['label'] = Id2Label[int(i)]
            if len(df_i) != 0:
                dict_['y']= len(df_thrld)/len(df_i)*100
            else:
                dict_['y']=0
            out.append(dict_)
        
        return out
    
    except:
        print("ERROR")
        return "ERROR"
        
        
