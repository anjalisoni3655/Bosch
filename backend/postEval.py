import os 
import pandas as pd 


def get_model_types(folder):
    models = os.listdir(folder)
    models.sort()
    temp = []
    i = 0
    for model in models:
        if os.path.isfile(os.path.join(os.path.join(folder, model), "cm_csv.csv")):
            temp.append({"title": model, "id": i})
            i+=1

    return temp


def get_misclassifications(cm, n=5):
    sign_list = ['Speed limit (20km/h)', 'Speed limit (30km/h)', 'Speed limit (50km/h)', 'Speed limit (60km/h)', 'Speed limit (70km/h)', 'Speed limit (80km/h)', 
                 'End of speed limit (80km/h)', 'Speed limit (100km/h)', 'Speed limit (120km/h)', 'No passing', 'No passing for vehicles over 3.5 metric tons', 
                 'Right-of-way at the next intersection', 'Priority road', 'Yield', 'Stop', 'No vehicles', 'Vehicles over 3.5 metric tons prohibited', 'No entry', 
                 'General caution', 'Dangerous curve to the left', 'Dangerous curve to the right', 'Double curve', 'Bumpy road', 'Slippery road', 
                 'Road narrows on the right', 'Road work', 'Traffic signals', 'Pedestrians', 'Children crossing', 'Bicycles crossing', 'Beware of ice/snow', 
                 'Wild animals crossing', 'End of all speed and passing limits', 'Turn right ahead', 'Turn left ahead', 'Ahead only', 'Go straight or right', 
                 'Go straight or left', 'Keep right', 'Keep left', 'Roundabout mandatory', 'End of no passing', 'End of no passing by vehicles over 3.5 metric tons', 
                 'No Stopping', 'Cross Road', 'No passing Cars', 'Route for Pedal Cycles Only', 'Separated Track for Pedal Cyclists and Pedestrians Only', 
                 'Parking Sign', 'Tonnage Limits']
    
    
    misclassified_predictions = []
    for row in range(50):
        for col in range(50):
            if cm[row][col] and row != col:
                misclassified_predictions.append((cm[row][col], row, col))
    
    misclassified_predictions = sorted(misclassified_predictions, key=lambda x: x[0], reverse=True)

    predicted = []
    actual = []
    number_misclassifications = []
    
    for i in range(n):
         predicted.append(sign_list[misclassified_predictions[i][2]])
         actual.append(sign_list[misclassified_predictions[i][1]])
         number_misclassifications.append(int(misclassified_predictions[i][0]))
    

    out = []

    for i in range(len(predicted)):
        out.append({"id": i, "pred": predicted[i], "act": actual[i], "num": number_misclassifications[i]})


    return out

def get_cmdata(folder):
    try:
        cm_csv = os.path.join(folder, 'cm_csv.csv')
        cm = pd.read_csv(cm_csv, header=None).values

        return get_misclassifications(cm)

    except:
        print("cm_csv.csv Not Found")


def acc_loss(OUTPUT_FOLDER):
    log_file = os.path.join(OUTPUT_FOLDER, 'log.csv')
    log_csv = pd.read_csv(log_file)
    tail = log_csv.tail(15)
    acc_diff = tail['accuracy'] - tail['val_accuracy']
    if tail['accuracy'].mean() < 0.9:
        str1 = 'The model is Underfitting.'
        str2 = "Suggested Network Changes: \nYou can increase the number of epochs or reduce the learning rate. You can also switch to a fast optimizer like Adam or train deeper networks."
        str3 = "Suggested Dataset Changes: \nIf you can't change the network, you can decrease the dataset difficulty level."
    elif acc_diff.mean() > 0.2:
        str1 = 'The model is Overfitting.'
        str2 = "Suggested Network Changes: \nYou can reduce the number of epochs or increase the learning rate. You can also reduce the number of layers or you can increase the dropout value."
        str3 = "Suggested Dataset Changes: \nYou can increase the number of training images or you can increase the dataset difficulty level."
    else:
        str1 = 'Good Fit!'
        str2 = 'The Network and the Dataset seem to be fine.'
        str3 = '' 
    
    return str1, str2, str3

# print(get_model_types('static/models/'))
# print(get_cmdata('static/models/Baseline_v1'))