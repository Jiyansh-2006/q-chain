from nacl.signing import SigningKey

# Generate a new random signing key (private key)
signing_key = SigningKey.generate()

# Obtain verify key (public key)
verify_key = signing_key.verify_key

# Message to sign
message = b"Q-Chain Transaction"

# Sign the message
signed = signing_key.sign(message)
print("Signed message:", signed)

# Verify the message
try:
    verify_key.verify(signed)
    print("Signature verified successfully ✅")
except:
    print("Verification failed ❌")
