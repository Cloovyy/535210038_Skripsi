import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score
from sklearn.tree import DecisionTreeClassifier
import numpy as np
import sys
import json

# Step 1: Load  dataset
df = pd.read_excel('./public/datasett.xlsx')

# Step 2: Data Preprocessing
df.dropna(inplace=True)  
df['ROUND'] = df['ROUND'].astype(int) 

# Step 3: Data dibagi berdasarkan posisi
positions = ['C', 'G', 'F']
data_by_position = {pos: df[df['POS'] == pos] for pos in positions}

# menghitung Indeks Gini, Entropy dan information gain
def gini_index(y):
    """Calculate Gini Index."""
    total = len(y)
    if total == 0:
        return 0
    proportions = y.value_counts(normalize=True)
    return 1 - sum(proportions**2)

def entropy(y):
    """Calculate Entropy."""
    total = len(y)
    if total == 0:
        return 0
    proportions = y.value_counts(normalize=True)
    return -sum(proportions * np.log2(proportions + 1e-9))  

def information_gain(y, X_feature):
    """Calculate Information Gain for a feature."""
    total_entropy = entropy(y)
    values = X_feature.unique()
    weighted_entropy = 0
    for value in values:
        subset = y[X_feature == value]
        weighted_entropy += (len(subset) / len(y)) * entropy(subset)
    return total_entropy - weighted_entropy

# Step 4: melatih random forest berdasarkan posisi
models = {}
feature_importances = {}
for pos, data in data_by_position.items():
    if pos == 'C':
        features = ['HANDLENGTH', 'HANDWIDTH', 'HEIGHTWOSHOES', 'STANDINGREACH', 'WEIGHT', 'WINGSPAN']
    elif pos == 'G':
        features = ['HANDLENGTH', 'HANDWIDTH', 'HEIGHTWOSHOES', 'HEIGHTWSHOES', 'STANDINGREACH', 'WEIGHT', 'WINGSPAN']
    else:  # F
        features = ['HANDLENGTH', 'HANDWIDTH', 'HEIGHTWOSHOES', 'WEIGHT', 'WINGSPAN']

    X = data[features]
    y = data['ROUND']
    
    # memecahkan tes
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    # melatih random forest
    rf_model = RandomForestClassifier(n_estimators=100, criterion='gini', random_state=42)
    rf_model.fit(X_train, y_train)
    
    # menyimpan model yang dilatih
    models[pos] = {
        'model': rf_model,
        'features': features
    }
    
    # menghitung Gini Index, Entropy, and Information Gain untuk setiap statistik
    gini_values = {}
    entropy_values = {}
    info_gain_values = {}
    for feature in features:
        gini_values[feature] = gini_index(y)
        entropy_values[feature] = entropy(y)
        info_gain_values[feature] = information_gain(y, X[feature])
    
    feature_importances[pos] = {
        'gini': gini_values,
        'entropy': entropy_values,
        'information_gain': info_gain_values
    }

# Step 5: Fungsi Prediksi untuk Pemain Baru
def predict_draft_round(position, player_data):
    """
    Predicts if a player will be selected in round 1, round 2, or not selected.
    
    Parameters:
    - position (str): Position of the player ('C', 'G', 'F')
    - player_data (dict): Dictionary of player's features with keys as feature names
    
    Returns:
    - str: Prediction result ('Round 1', 'Round 2', 'Not Selected')
    """
    # balidasi posisi pemain
    if position not in models:
        return "Invalid position. Choose from 'C', 'G', 'F'."
    
    # mendapatkan fitur yang sesuai dengan posisi 
    model_info = models[position]
    model = model_info['model']
    features = model_info['features']
    
    # memastikan data pemain baru yang dimasukan sesuai
    input_data = np.array([player_data[feature] for feature in features]).reshape(1, -1)
    
    # melakukan prediksi
    prediction = model.predict(input_data)
    
    # menentukan hasi prediksi
    if prediction[0] == 1:
        return "Round 1"
    elif prediction[0] == 2:
        return "Round 2"
    else:
        return "Not Selected"

# menampilkan prediksi
data = json.loads(sys.argv[1])  
position = data['position']  
new_player_data = data['player_data']   


prediction = predict_draft_round(position, new_player_data)
print(f"{prediction}")

