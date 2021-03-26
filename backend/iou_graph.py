from gradcam import Iou_dataframe_generator
import pandas as pd
import os


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

            dict_['label'] = i
            if len(df_i) != 0:
                dict_['y']= len(df_thrld)/len(df_i)*100
            else:
                dict_['y']=0
            out.append(dict_)
        
        return out
    
    except:
        print("ERROR")
        return "ERROR"
        
        
