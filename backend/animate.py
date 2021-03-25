import matplotlib.pyplot as plt 
from matplotlib.animation import FuncAnimation, PillowWriter 
import numpy as np 
import pandas as pd 
import os 
import seaborn as sns

sns.set_style('whitegrid')


def get_data(folder):
    try:
        file_loc = os.path.join(folder, 'log.csv')
        df = pd.read_csv(file_loc)
        return df

    except:
        return None

def get_plot_loss_acc(folder, df):
    
    fig, ax = plt.subplots()
    
    x = []
    y_ta = []
    y_va = []
    y_tl = []
    y_vl = []

    ln1, = plt.plot([], [], "#30a2da", label = 'Train Accuracy')
    ln2, = plt.plot([], [], "#fc4f30", label = 'Val Accuracy')
    ln3, = plt.plot([], [], "#e5ae38", label = 'Train Loss')
    ln4, = plt.plot([], [], "#6d904f", label = 'Val Loss')

    def init():
        ln1.set_data([], [])
        ln2.set_data([], [])
        ln3.set_data([], [])
        ln4.set_data([], [])
        ax.set_xlim(0, len(df))
        ax.set_ylim(0, 1)

        return ln1, ln2, ln3, ln4
    
    def update(i):
        x.append(i)
        y_ta.append(df['accuracy'][i])
        y_va.append(df['val_accuracy'][i])
        y_tl.append(df['loss'][i])
        y_vl.append(df['val_loss'][i])
        ln1.set_data(x, y_ta)
        ln2.set_data(x, y_va)
        ln3.set_data(x, y_tl)
        ln4.set_data(x, y_vl)

        return ln1, ln2, ln3, ln4

    ani = FuncAnimation(fig, update, df['epoch'].values, init_func=init, repeat = False, interval = 200, blit = True)
    plt.legend(fontsize=13)
    plt.xticks(fontsize=13)
    plt.yticks(fontsize=13)
    plt.xlabel('Epochs', fontsize=13)
    plt.ylabel('Loss / Accuracy', fontsize=13)
    
    writer = PillowWriter()  
    ani.save(os.path.join(folder, "loss_acc.gif"), writer=writer)  
    # plt.show()

def get_plot_pr(folder, df):
    
    fig, ax = plt.subplots()
    
    x = []
    y_ta = []
    y_va = []
    y_tl = []
    y_vl = []

    ln1, = plt.plot([], [], "#30a2da", label = 'Train Precision')
    ln2, = plt.plot([], [], "#fc4f30", label = 'Val Precision')
    ln3, = plt.plot([], [], "#e5ae38", label = 'Train Recall')
    ln4, = plt.plot([], [], "#6d904f", label = 'Val Recall')

    def init():
        ln1.set_data([], [])
        ln2.set_data([], [])
        ln3.set_data([], [])
        ln4.set_data([], [])
        ax.set_xlim(0, len(df))
        ax.set_ylim(0, 1)

        return ln1, ln2, ln3, ln4
    
    def update(i):
        x.append(i)
        y_ta.append(df['precision_m'][i])
        y_va.append(df['val_precision_m'][i])
        y_tl.append(df['recall_m'][i])
        y_vl.append(df['val_recall_m'][i])
        ln1.set_data(x, y_ta)
        ln2.set_data(x, y_va)
        ln3.set_data(x, y_tl)
        ln4.set_data(x, y_vl)

        return ln1, ln2, ln3, ln4

    ani = FuncAnimation(fig, update, df['epoch'].values, init_func=init, repeat = False, interval = 200, blit = True)
    plt.legend(fontsize=13)
    plt.xticks(fontsize=13)
    plt.yticks(fontsize=13)
    plt.xlabel('Epochs', fontsize=13)
    plt.ylabel('Precision / Recall', fontsize=13)
    
    writer = PillowWriter()  
    ani.save(os.path.join(folder, "pr.gif"), writer=writer)  
    # plt.show()

def get_plot_f1(folder, df):
    
    fig, ax = plt.subplots()
    
    x = []
    y_ta = []
    y_va = []
 

    ln1, = plt.plot([], [], "#30a2da", label = 'Train F1-Score')
    ln2, = plt.plot([], [], "#fc4f30", label = 'Val F1-Score')

    def init():
        ln1.set_data([], [])
        ln2.set_data([], [])

        ax.set_xlim(0, len(df))
        ax.set_ylim(0, 1)

        return ln1, ln2
    
    def update(i):
        x.append(i)
        y_ta.append(df['f1_m'][i])
        y_va.append(df['val_f1_m'][i])
        ln1.set_data(x, y_ta)
        ln2.set_data(x, y_va)
        
        return ln1, ln2

    ani = FuncAnimation(fig, update, df['epoch'].values, init_func=init, repeat = False, interval = 200, blit = True)
    plt.legend(fontsize=13)
    plt.xticks(fontsize=13)
    plt.yticks(fontsize=13)
    plt.xlabel('Epochs', fontsize=13)
    plt.ylabel('F1-Score', fontsize=13)
    
    
    writer = PillowWriter()  
    ani.save(os.path.join(folder, "f1.gif"), writer=writer)  
    # plt.show()




def PLOT(folder):
    if get_data(folder) is not None:
        df = get_data(folder)
        get_plot_loss_acc(folder, df)
        get_plot_pr(folder, df)
        get_plot_f1(folder, df)

    else:
        print(folder, "-has no log.csv")


# PLOT('static/models/Baseline_v1')
# base_folder = 'static/models/'
# for folder in os.listdir(base_folder):
#     folder = os.path.join(base_folder, folder)
#     PLOT(folder)

