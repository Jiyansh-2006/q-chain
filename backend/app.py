from web3 import Web3
import json
import os

# --- Quantum Shor simulation ---
# Replace this with your actual Shor implementation later
def shor(N):
    # Dummy simulation: factors 15 as example
    return [3, 5] if N == 15 else 1

# --- Blockchain setup (Polygon Mumbai Testnet) ---
INFURA_URL = "https://polygon-mumbai.infura.io/v3/c2696c86f4074accae816953effbc46d"
PRIVATE_KEY = "0x4c0883a69102937d6231471b5dbb6204fe5129617082799a65f7de3a7f1d1234"  # Valid hex
CONTRACT_ADDRESS = "0x15427E7B1b8e4Ec5a2a9cdef15309A8e7E275C0A"

w3 = Web3(Web3.HTTPProvider(INFURA_URL))
if not w3.is_connected():
    raise ConnectionError("❌ Failed to connect to Polygon Mumbai Testnet!")

account = w3.eth.account.from_key(PRIVATE_KEY)
print(f"✅ Using account: {account.address}")

# --- Load Hardhat artifact JSON ---
# Update the path if your script is in `backend/`
artifact_path = os.path.join(os.path.dirname(__file__), "../artifacts/contracts/QChain.sol/QChain.json")
if not os.path.exists(artifact_path):
    raise FileNotFoundError(f"❌ Artifact JSON not found at {artifact_path}")

with open(artifact_path) as f:
    artifact = json.load(f)

abi = artifact.get("abi")
if not isinstance(abi, list):
    raise ValueError("❌ Invalid ABI loaded from artifact JSON!")

contract = w3.eth.contract(address=CONTRACT_ADDRESS, abi=abi)
print("✅ Contract loaded successfully")

# --- Send transaction with quantum validation ---
def send_q_transaction(receiver, amount, note):
    print("🔍 Running Shor quantum validation...")
    factor = shor(15)  # simulate factoring
    if factor == 1:
        print("❌ Quantum validation failed!")
        return

    print("✅ Quantum validation passed!")

    txn = contract.functions.sendTransaction(receiver, amount, note).build_transaction({
        "from": account.address,
        "nonce": w3.eth.get_transaction_count(account.address),
        "gas": 3000000,
        "gasPrice": w3.to_wei("2", "gwei"),
    })

    signed_txn = w3.eth.account.sign_transaction(txn, private_key=PRIVATE_KEY)
    tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    print(f"🚀 Transaction sent! Hash: {tx_hash.hex()}")

if __name__ == "__main__":
    # Example: send a transaction to yourself
    send_q_transaction(account.address, 10, "Test QChain transaction")
