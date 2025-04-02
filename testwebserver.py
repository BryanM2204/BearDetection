from flask import Flask, request, jsonify, session, send_from_directory
import os
from flask_cors import CORS  # Allow React frontend to communicate with Flask

import socket
import json

PI_IP = "127.0.0.1"  # Replace with actual IP of your Pi
PI_PORT = 9000

def send_to_pi(payload):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(3)  # optional: avoid hang
        s.connect((PI_IP, PI_PORT))
        s.sendall(json.dumps(payload).encode())
        response = s.recv(4096)
        return json.loads(response)


#app = Flask(__name__, static_folder="frontend/build", static_url_path="")
app = Flask(__name__, static_folder="frontend/build", static_url_path=None)
app.secret_key = "supersecretkey"  # Required for session management

CORS(app, supports_credentials=True)  # Allow CORS requests

# Temporary in-memory user database (storing plain text passwords)
users_db = {}

# Signup API (NO Password Hashing)
@app.route("/api/signup", methods=["POST"])
def signup():
    """Handles user signup (PLAIN TEXT passwords, for testing only)"""
    data = request.get_json()

    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data"}), 400

    username = data["username"].strip()
    password = data["password"].strip()

    if not username or not password:
        return jsonify({"error": "Username and password cannot be empty"}), 400

    if username in users_db:
        return jsonify({"error": "User already exists"}), 400

    # Store password as plain text (for testing only)
    users_db[username] = password

    print(f"User '{username}' registered successfully.")  # Debugging output
    return jsonify({"message": "Signup successful"}), 200

# Login API (PLAIN TEXT Passwords)
@app.route("/api/login", methods=["POST"])
def login():
    """Handles user login (NO password hashing)"""
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if username not in users_db or users_db[username] != password:
        print(f"Login failed for '{username}'. Incorrect username or password.")  # Debugging output
        return jsonify({"error": "Invalid username or password"}), 401

    # Login successful Set session
    session["username"] = username
    print(f"Login successful for '{username}'.")  # Debugging output
    print("Login successful, session =", dict(session)) # Debugging output
    return jsonify({"message": "Login successful"}), 200

# Logout API
@app.route("/api/logout", methods=["POST"])
def logout():
    """Ends user session"""
    session.pop("username", None)
    print("User logged out successfully.") # Debugging output
    return jsonify({"message": "Logged out"}), 200

# Authentication Check API
@app.route("/api/check-auth")
def check_auth():
    """Check if user is authenticated"""
    print("Current session contents:", dict(session)) # Dbugging output
    is_authenticated = "username" in session
    return jsonify({"authenticated": is_authenticated})

# Test Dashboard API (returns test image list)
@app.route("/api/detections")
def get_detections():
    """Fetch test detected images"""
    detections_folder = os.path.join("frontend", "public", "detections")

    # Ensure detections folder exists
    if not os.path.exists(detections_folder):
        os.makedirs(detections_folder)

    images = [img for img in os.listdir(detections_folder) if img.endswith(".jpg") or img.endswith(".png")]
    return jsonify({"message": "Welcome to the dashboard!", "detections": images})
    #return jsonify(images)

@app.route("/api/dashboard")
def dashboard():
    detections_path = os.path.join(os.path.dirname(__file__), "frontend", "public", "detections")
    return jsonify({"message": "Welcome to the dashboard!", "detections": os.listdir(detections_path)})

# Serve detection images
@app.route("/detections/<path:filename>")
def serve_detection_image(filename):
    return send_from_directory("frontend/public/detections", filename)

@app.route("/static/<path:filename>")
def serve_static(filename):
        return send_from_directory(os.path.join(app.static_folder, "static"), filename)

@app.route("/api/pi/config", methods=["GET"])
def get_pi_config():
    return send_to_pi({"type": "get_config"})

@app.route("/api/pi/config", methods=["POST"])
def set_pi_config():
    data = request.get_json()
    return send_to_pi({"type": "set_config", "payload": data})


# Serve React frontend
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    """
    Serve React frontend for all routes except API endpoints.
    """
    # If the request is for an API endpoint, return a 404
    if path.startswith("api/"):
        return jsonify({"error": "API endpoint not found"}), 404

    # Serve the frontend React app
    return send_from_directory(app.static_folder, "index.html")

# Run Flask Server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

