from flask import Flask, request, abort, render_template, redirect, session, request, jsonify, send_from_directory, g, current_app
from flask_cors import CORS, cross_origin
import requests
import mysql.connector
import pymysql
from mysql.connector import Error
import time
import logging
import threading
import cv2
import json
import pandas as pd
import os
from filelock import FileLock, Timeout

inst = Flask(__name__, static_folder=r"static") # create flask instance
CORS(inst, supports_credentials=True, origins=["http://localhost:3000"]) # enable CORS for all routes

stop_event = threading.Event()  # stop event to signal threads to exit (fix Keyboard Interrupt issue)

secret_key = os.urandom(256) # generate a random secret key for session management
inst.secret_key = secret_key

def run():
    inst.run(host='0.0.0.0', port=5000, use_reloader=False)# port 5000 used for development
    
def create_connection():
    try:
        connection = pymysql.connect( # connect to the SQL server and use the SDPlogin database
            host='localhost',
            user='root',
            password='password', # make sure to change login info
            database='SDPlogin',
            port=3306 # default is 3306, I'm using 3307 for this MySQL server because of conflicts
        )
        return connection
    except Error as e:
        print(f'Error: {e}')
        return None

def execute_query(connection, query): # executes a SQL query in the database
    cursor = connection.cursor()
    try:
        cursor.execute(query)
        connection.commit()
        print('Query Successful')
    except Error as e:
        print(f'Error: {e}')
    finally:
        cursor.close()
        connection.close

@inst.route('/api/signup', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def signup():
    data = request.get_json()
    if not data or "username" not in data or "password" not in data:
        return jsonify({"error": "Invalid data"}), 400 # "Bad request" HTTP status code
    username = data["username"].strip()
    password = data["password"].strip()
    if not username or not password:
        return jsonify({"error": "Username and password cannot be empty"}), 400
    success = False
    connection = create_connection()
    cursor = connection.cursor()
    try:
        query = "INSERT into userpass (Username, Password) VALUES (%s, %s);"
        cursor.execute(query, (username, password))
        connection.commit()
        success = True
        print(f'User "{username}" added successfully')
    except Error as e:
        if e.errno == 1062: # duplicate entry error code
            print(f"Error: '{e}'")
            return jsonify({"error": "User already exists"}), 400
        print(f"Error: '{e}'")
    finally:
        cursor.close()
        connection.close()
        if success:
            return jsonify({"message": "Signup successful"}), 200
        else:
            return jsonify({"error": "Error"}), 400

@inst.route('/api/login', methods=['GET', 'POST'])
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def login():
    # for testing with html template - has change username and password functionality
    data = request.get_json()
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()
    connection = create_connection()
    cursor = connection.cursor()
    try:
        query = "SELECT Password FROM userpass WHERE Username = %s;"
        cursor.execute(query, (username,)) # parameterized query to prevent SQL injection
        queried_password = cursor.fetchone() # retrieves the next row of a query result set
        cursor.fetchall() # make sure there's no leftover rows in the query result set (prevent errors)
        if queried_password[0] == password:
            session['username'] = username
            print(f'User "{username}" logged in successfully')
            return jsonify({"message": "Login successful"}), 200 # "OK" HTTP status code
        else:
            print(f'User "{username}" failed to log in')
            return jsonify({"error": "Invalid username or password"}), 401 # "Unauthorized" HTTP status code
    except Error as e:
        print(f"Error: '{e}'")
    finally:
        cursor.close()
        connection.close()

# Authentication Check API
@inst.route("/api/check-auth")
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def check_auth():
    """Check if user is authenticated"""
    print("Current session contents:", dict(session)) # Dbugging output
    is_authenticated = "username" in session
    return jsonify({"authenticated": is_authenticated})


@inst.route('/api/logout')
@cross_origin(supports_credentials=True, origins=["http://localhost:3000"])
def logout():
    session.pop('username', None)
    return jsonify({"message": "Logged out"}), 200
    #return redirect('/')

@inst.route('/setconfig', methods=['POST'])
@cross_origin()
def setconfig():
    if request.method == "POST":
        data = request.get_json()
        print(data)
        lock = FileLock("config.json.lock", thread_local=False)
        with lock:
            with open("config.json", "w") as config:
                json.dump(data, config, indent=2)
        response = {"message": "Received"}
        return jsonify(response), 201

@inst.route('/geturls', methods=['GET'])
@cross_origin()
def getimgurls():

    months = {
        "01": "January",
        "02": "February",
        "03": "March",
        "04": "April",
        "05": "May",
        "06": "June",
        "07": "July",
        "08": "August",
        "09": "September",
        "10": "October",
        "11": "November",
        "12": "December"
    }

    images = pd.read_csv("images.csv")
    imgs = images.values.tolist()
    urls = []
    for img in imgs:
        obj = {}
        data = img[0].split("-")
        obj["animal"] = data[0][7:]

        hour = int(data[4])
        half = "AM"

        if hour >= 12 and hour <= 23:
            half = "PM"

        hour = hour % 12

        if hour == 0:
            hour = 12

        timeInfo = str(hour) + ":" + data[5] + " " + half
        date = months[data[2]] + " " + data[3] + ", " + data[1]
        obj["date"] = date
        obj["timeInfo"] = timeInfo

        obj["url"] = img[0]

        urls.append(obj)

    response = {"urls": urls}
    return jsonify(response), 201

# Serve React frontend
@inst.route("/", defaults={"path": ""})
@inst.route("/<path:path>")
def serve_react_app(path):
    """
    Serve React frontend for all routes except API endpoints.
    """
    # If the request is for an API endpoint, return a 404
    if path.startswith("api/"):
        return jsonify({"error": "API endpoint not found"}), 404

    # Serve the frontend React app
    return send_from_directory(inst.static_folder, "index.html")

if __name__ == '__main__':
    try:
        flask_thread = threading.Thread(target=run, daemon=True)
        flask_thread.start()

        while not stop_event.is_set():
            time.sleep(1)
    except KeyboardInterrupt:
        print('--Keyboard Interrupt--')
        stop_event.set()
        time.sleep(2)