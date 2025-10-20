# src/ai/train_model_crypto.py
import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score
import joblib

# Load dataset
df = pd.read_csv("data/crypto_transactions_new.csv", parse_dates=["timestamp"])

# Feature Engineering
df["hour"] = df["timestamp"].dt.hour
df["day_of_week"] = df["timestamp"].dt.dayofweek
df["is_weekend"] = df["day_of_week"].isin([5,6]).astype(int)
df["log_amount"] = np.log1p(df["amount"])

# Sender behavior features
df["sender_tx_count"] = df.groupby("sender_wallet")["sender_wallet"].transform("count")
df["avg_sender_amount"] = df.groupby("sender_wallet")["amount"].transform("mean")
df["max_sender_amount"] = df.groupby("sender_wallet")["amount"].transform("max")
df["std_sender_amount"] = df.groupby("sender_wallet")["amount"].transform("std").fillna(0)
df["unique_receiver_count"] = df.groupby("sender_wallet")["receiver_wallet"].transform("nunique")
df["amount_ratio"] = df["amount"] / (df["avg_sender_amount"] + 1e-6)
df["fee_ratio"] = df["fee"] / (df["amount"] + 1e-6)

# Define features and target
features = [
    "log_amount", "fee", "hour", "day_of_week", "is_weekend",
    "sender_tx_count", "avg_sender_amount", "max_sender_amount",
    "std_sender_amount", "unique_receiver_count", "amount_ratio", "fee_ratio"
]
X = df[features].fillna(0)
y = df["fraud"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, stratify=y, test_size=0.2, random_state=42)

# Train model
rf = RandomForestClassifier(n_estimators=200, random_state=42)
rf.fit(X_train, y_train)

# Evaluate
y_pred = rf.predict(X_test)
print(classification_report(y_test, y_pred))
auc = roc_auc_score(y_test, rf.predict_proba(X_test)[:, list(rf.classes_).index(1)])
print("AUC:", auc)

# Save model
joblib.dump(rf, "model/model.pkl")
joblib.dump(features, "model/features.pkl")
print("✅ Model saved with enhanced features.")
