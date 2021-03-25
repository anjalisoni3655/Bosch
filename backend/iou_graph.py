import pandas as pd

def iou_function(df, thrld):
    out = []
    for i in range(50):
        dict_ = {}
        df_i = df[df['labels']==i]
        df_thrld = df_i[df_i['iou']<=thrld]
        
        dict_['label'] = i
        dict_['y']= len(df_thrld)/len(df_i)*100
        out.append(dict_)
    return out