# SDPTeam43

## Backend

### yolo.py
This file contains the code that detects bears and plays an alarm. This version is updated to interact with the frontend functionality.
Images are saved to the static folder. The filenames are stored in images.csv. The config.json file contains the settings from the frontend.

The yolo5.py file is what was used on the actual Raspberry Pi during field testing.

### webserver.py
This file contains the Flask server that hosts the api for the frontend. /geturls takes the image filenames from images.csv and formats them before sending them to the Dashboard. /setconfig saves the selections from the Config page to a json file for yolo.py to read.

The other endpoints are related to logging in. The code connects to a MySQL server. 

## Frontend
The frontend provides a convenient way to interact with the detection code. Detection images can be found on the Dashboard. Settings can be altered in the Configuration page. There is also log in/sign up functionality. Before being able to access other pages, you will need to log in first.

## Running the Code
Three terminals need to be used to run the code. One runs yolo.py, one runs webserver.py, and the last one runs the frontend. The Python files should be able to be run directly, but it may be preferable to run them in a virtual environment. Make sure all of the necessary libraries have been installed. For the frontend, make sure node.js is installed along with React. Use the command npm run start from within the frontend folder to access the website. It should be running on localhost:3000.

Like mentioned before, a MySQL server is used to log in. The SQL to create the database and table can be found in SDPlogin.sql.

### Commands
Terminal 1:

cd backend

source venv/Scripts/activate (optional if you choose to use a virtual environment)

python yolo.py


Terminal 2:

cd backend

source venv/Scripts/activate (optional if you choose to use a virtual environment)

python webserver.py


Terminal 3:

cd frontend

npm run start
