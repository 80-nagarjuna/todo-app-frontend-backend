from flask import Flask, request, jsonify
from flask_cors import CORS
from jose import jwt
import requests

app = Flask(__name__)
CORS(app)

# 👇 Your Cognito details
USERPOOL_ID = "us-east-1_v56kyf0zh"
CLIENT_ID = "7jc9hfga5mmhm4e8tnht8p8akq"
REGION = "us-east-1"

# JWKS URL
JWKS_URL = f"https://cognito-idp.{REGION}.amazonaws.com/{USERPOOL_ID}/.well-known/jwks.json"
JWKS = requests.get(JWKS_URL).json()

def verify_jwt(token):
    try:
        headers = jwt.get_unverified_header(token)
        kid = headers["kid"]

        key = next(
            (k for k in JWKS["keys"] if k["kid"] == kid),
            None,
        )
        if key is None:
            raise Exception("Public key not found in JWKS")

        public_key = jwt.construct_public_key(key)

        payload = jwt.decode(
            token,
            public_key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
        )
        return payload
    except Exception as e:
        print("JWT verification failed:", e)
        return None

@app.route("/tasks", methods=["GET"])
def get_tasks():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing Authorization header"}), 401

    token = auth_header.split(" ")[1]
    user = verify_jwt(token)

    if not user:
        return jsonify({"error": "Invalid or expired token"}), 401

    # Example response – replace with DB later
    tasks = [
        {"id": 1, "task": "Learn AWS"},
        {"id": 2, "task": "Build Enterprise Project"},
    ]
    return jsonify({"user": user["email"], "tasks": tasks})

if __name__ == "__main__":
    app.run(debug=True)

