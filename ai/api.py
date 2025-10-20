# src/ai/api.py
from fastapi import FastAPI
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib

app = FastAPI(title="Q-Chain Real-Time Fraud Detection")

# Load model
model = joblib.load("model/model.pkl")
features = joblib.load("model/features.pkl")

# In-memory sender history
sender_history = {}

class Transaction(BaseModel):
    amount: float
    fee: float
    sender_wallet: str
    receiver_wallet: str
    timestamp: str  # ISO 8601
    transaction_type: str = "transfer"

@app.post("/predict-fraud-real-time")
def predict_fraud(tx: Transaction):
    df = pd.DataFrame([tx.dict()])
    df["hour"] = pd.to_datetime(df["timestamp"]).dt.hour
    df["day_of_week"] = pd.to_datetime(df["timestamp"]).dt.dayofweek
    df["is_weekend"] = df["day_of_week"].isin([5,6]).astype(int)
    df["log_amount"] = np.log1p(df["amount"])

    # Sender history features
    sender_tx = sender_history.get(tx.sender_wallet, [])
    df["sender_tx_count"] = len(sender_tx) + 1
    df["avg_sender_amount"] = np.mean([t['amount'] for t in sender_tx] + [tx.amount])
    df["max_sender_amount"] = max([t['amount'] for t in sender_tx] + [tx.amount])
    df["std_sender_amount"] = np.std([t['amount'] for t in sender_tx] + [tx.amount])
    df["unique_receiver_count"] = len(set([t['receiver_wallet'] for t in sender_tx] + [tx.receiver_wallet]))
    df["amount_ratio"] = df["amount"] / (df["avg_sender_amount"] + 1e-6)
    df["fee_ratio"] = df["fee"] / (df["amount"] + 1e-6)

    # Ensure all features exist
    for f in features:
        if f not in df:
            df[f] = 0

    X = df[features].fillna(0)
    pred = model.predict(X)[0]
    proba = float(model.predict_proba(X)[:, list(model.classes_).index(1)][0])
    severity = "Low" if proba < 0.4 else "Medium" if proba < 0.7 else "High"

    # Update sender history
    sender_tx.append(tx.dict())
    sender_history[tx.sender_wallet] = sender_tx

    return {
        "fraud": bool(pred),
        "probability": proba,
        "severity": severity,
        "reason": "Suspicious transaction pattern"
    }
