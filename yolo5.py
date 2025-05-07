from ultralytics import YOLO
#from playsound import playsound
import RPi.GPIO as GPIO
import time
import cv2
import os
import pygame
import datetime
import random
import threading

class Detector:

	def __init__(self):
		self.cond = threading.Condition()
		self.isDetected  = False
		self.trigger_time = datetime.datetime.now()

	def get_detected(self):
		return self.isDetected

	def set_detected (self, val):
		self.isDetected = val
		if self.isDetected:
			self.trigger_time = datetime.datetime.now()

	def check_reset(self):
		interval = (datetime.datetime.now() - self.trigger_time).total_seconds()
		if interval > 10:
			self.isDetected = False


def sound(detector):
	pygame.init()

	airhorn = pygame.mixer.Sound('/home/sdp/Downloads/air-horn-273892.mp3')
	potsnpans = pygame.mixer.Sound('/home/sdp/Downloads/potsnpans.mp3')
	laser = pygame.mixer.Sound('/home/sdp/Downloads/laser.mp3')
	glass = pygame.mixer.Sound('/home/sdp/Downloads/glass.wav')
	whistle = pygame.mixer.Sound('/home/sdp/Downloads/whistle.wav')

	sounds = [airhorn, potsnpans, laser, airhorn, airhorn, glass, whistle]
	while True:
		with detector.cond:
			while not detector.get_detected():
				detector.cond.wait()
			detector.check_reset()
			detector.cond.notify()
            
		noise = random.choice(sounds)
		noise.play()
		time.sleep(.5)
		

def lights(detector):
	GPIO.setmode(GPIO.BCM)
	GPIO.setwarnings(False)
	GPIO.setup(14, GPIO.OUT)
	GPIO.setup(22, GPIO.OUT)
	GPIO.setup(17, GPIO.IN)

	GPIO.output(14, GPIO.LOW)
	GPIO.output(22, GPIO.LOW)

	light_time = datetime.datetime.now()
	current_pin = 14

	times = [.05, .03, .1, .02, .01, .07, .08, .03, .04]

	while True:
		with detector.cond:
			while not detector.get_detected():
				GPIO.output(14, GPIO.LOW)
				GPIO.output(22, GPIO.LOW)
				detector.cond.wait()
			detector.check_reset()
			detector.cond.notify()
            
		if GPIO.input(17) == 1:
			os.system("amixer set 'Master' 100% -q")
			current_pin = 14
		else:
			os.system("amixer set 'Master' 10% -q")
			current_pin = 22
		
		GPIO.output(current_pin,GPIO.HIGH)
		time.sleep(random.choice(times))
		GPIO.output(current_pin, GPIO.LOW)


def detection(detector):

	model = YOLO('yolov8n.pt')
	filepath1 = "Detections/"
	filepath2 = "General/"

	animals = [15, 16, 21]

	classes = {
		"tensor([15.])": "Cat",
		"tensor([16.])": "Dog",
		"tensor([21.])": "Bear"
	}

	pygame.init()

	last_detection = None
	time_between = 0
	time_since = 0
	last_image = datetime.datetime.now()

	light = False
	light_time = datetime.datetime.now()
	current_pin = 14

	cap = cv2.VideoCapture(-1)

	if not cap.isOpened():
		print("Error: Could not open video stream.")
		exit()

	while True:
		ret, frame = cap.read()
		
		if not ret:
			print("Error: Failed to capture image.")
			break
		frame = cv2.rotate(frame, cv2.ROTATE_90_COUNTERCLOCKWISE)

		#cv2.imshow("YOLOv8 Webcam Stream", frame)
		
		# Run YOLO detection on the current frame
		results = model(frame, verbose=False)

		time_since = (datetime.datetime.now() - last_image).total_seconds()
		if time_since > 20:
			last_image = datetime.datetime.now()
			try:
				cv2.imwrite(filepath2 + "camera" + str(datetime.datetime.now()) + ".png", frame)
			except:
				print("Could not save file")

		annotated_frame = results[0].plot()

		bear_class_id = 21 #21 is bear
		detections = results[0].boxes
		for detection in detections:
			if detection.cls in animals:
				an_class = classes[str(detection.cls)]
				now_time = str(datetime.datetime.now())
				print(an_class + " Detected: " + now_time)
				with open('detection.txt', 'a') as file:
					file.write(an_class + " Detected: " + now_time +"\n")  
				try:				
					cv2.imwrite(filepath1 + an_class + "detection" + now_time + ".png", frame)
				except:
					print("Could not save detection")
				if detection.cls == bear_class_id:
					with detector.cond:
						detector.set_detected(True)
						detector.cond.notify()
					break
						      
		#cv2.imshow("YOLOv8 Webcam Stream", annotated_frame)
		
		# exit when q is pressed
		if cv2.waitKey(1) & 0xFF == ord('q'):
			break

	cap.release()
	cv2.destroyAllWindows()
	GPIO.cleanup()

if __name__ == "__main__":

	time.sleep(1)
	print("Program started: " + str(datetime.datetime.now()))

	arg = Detector()

	t1 = threading.Thread(target=sound, args=[arg,])
	t2 = threading.Thread(target=lights, args=[arg,])
	t3 = threading.Thread(target=detection, args=[arg,])

	t1.start()
	t2.start()
	t3.start()

	t1.join()
	t2.join()
	t3.join()