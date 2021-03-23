import os
import pandas as pd

def get_model_stats(folder):

    model_options = os.listdir(folder)
    model_options.sort()
    model_types = []
    for i, model in enumerate(model_options):
        model_types.append({'title': model, 'id':i})
    
    # print(model_options, model_types)
    
    val_precision = []
    train_accuracy = []
    val_accuracy = []
    val_recall = []
    train_f1 = []
    val_f1 = []

    for model in model_options:
        df = pd.read_csv(os.path.join(os.path.join(folder, model), 'log.csv'))
    
        train_accuracy.append(str(round((df['accuracy'].values[-1])*100, 2))+'%')
        val_accuracy.append(str(round(df['val_accuracy'].values[-1]*100, 2))+'%')
        train_f1.append(round(df['f1_m'].values[-1], 3))
        val_f1.append(round(df['val_f1_m'].values[-1],3))
        val_precision.append(round(df['val_precision_m'].values[-1], 3))
        val_recall.append(round(df['val_recall_m'].values[-1], 3))


    

    stats = {
            'baseline_on_original': {
                'precision': '1.0', 
                'accuracy': '99.51%',
                'recall': '1.0',
                'f1': '1.0',
            },
            'baseline_on_augmented': {
                'precision': 0.097, 
                'accuracy': '38.30%',
                'recall': 0.023,
                'f1': 0.037
            },
            'model_options': model_options,
            'model_types': model_types,
            'train_accuracy': train_accuracy,
            'val_accuracy': val_accuracy,
            'train_f1': train_f1, 
            'val_f1': val_f1,
            'val_precision': val_precision,
            'val_recall': val_recall,
        
        }

    return stats


get_model_stats('static/models')