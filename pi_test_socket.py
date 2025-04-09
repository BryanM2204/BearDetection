import socket
import json
import os

HOST = "0.0.0.0"
PORT = 9000
CONFIG_PATH = 'C:\\Users\\malak\\OneDrive\\Desktop\\UCONN\\cse4939w\\my-project\\pi\\test_config.json'

def print_config():
    try:
        with open(CONFIG_PATH) as f:
            config = json.load(f)
        id_val = config.get("id")
        time_val = config.get("time")
        print(f"Current Config - id: {id_val}, time: {time_val}")
    except (FileNotFoundError, json.JSONDecodeError) as e:
        print(f"⚠️ Error reading config: {e}")

# Ensure config file exists
if not os.path.exists(CONFIG_PATH):
    with open(CONFIG_PATH, "w") as f:
        json.dump({"id": 21, "time": 30}, f)

def handle_command(data):
    cmd_type = data.get("type")
    
    if cmd_type == "get_config":
        with open(CONFIG_PATH) as f:
            return json.dumps({"config": json.load(f)})
    
    elif cmd_type == "set_config":
        with open(CONFIG_PATH, "w") as f:
            json.dump(data["payload"], f, indent=2)

        print_config()

        return json.dumps({"status": "updated", "new": data["payload"]})

    return json.dumps({"error": "unknown command"})

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.bind((HOST, PORT))
    server.listen()
    print(f"Pi socket server listening on {HOST}:{PORT}")

    while True:
        conn, addr = server.accept()
        with conn:
            data = conn.recv(4096)
            if not data:
                continue
            print(f"Received from {addr}: {data}")
            try:
                request = json.loads(data.decode())
                response = handle_command(request)
            except Exception as e:
                response = json.dumps({"error": str(e)})
            conn.sendall(response.encode())

