from flask import Flask, request, jsonify
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import seaborn as sns
from sklearn.model_selection import train_test_split
import sys
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import confusion_matrix


app = Flask(__name__)

@app.route('/predict', methods=['POST'])
def predict():
    dataset = pd.read_csv('training-data/diabetes.csv')

    X = dataset['Blood Pressure', 'BMI', 'Age']
    Y = dataset['Outcome']


    X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = .15, random_state = 0)


    model = LogisticRegression(random_state = 0)
    model.fit(X_train, Y_train)

    Y_pred = model.predict(X_test)


    # Your machine learning code to make predictions here
    # You'll receive input data from the request and return predictions as JSON
    # Example:
    input_data = request.get_json()

    # Replace this with your actual machine learning model code
    prediction = model.predict(input_data)

    return jsonify({'prediction': prediction})

if __name__ == '__main__':
    app.run(debug=True)