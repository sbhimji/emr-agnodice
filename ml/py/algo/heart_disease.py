import numpy as np
import pandas as pd

import sklearn
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib


dataset = pd.read_csv('../data/heart_upd.csv')

Y = dataset['HeartDisease']
X = dataset.drop(['Unnamed: 7', 'Sex', 'ChestPainType', 'ExerciseAngina', 'HeartDisease'], axis=1)

X_train, X_test, Y_train, Y_test = train_test_split(X, Y, test_size = .15, random_state = 0)

sc = StandardScaler()
X_train = sc.fit_transform(X_train)
X_test = sc.transform(X_test)

classifier = LogisticRegression(random_state = 0)
classifier.fit(X_train, Y_train)

Y_pred = classifier.predict(X_test)

joblib.dump(classifier, 'heart_dis_pred.pkl')