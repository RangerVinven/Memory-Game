import mysql.connector
from time import sleep

connected = False
while not connected:
    try:
        db = mysql.connector.connect(user="root", password="root", host="127.0.0.1", port="3307", database="Memory_Game")
        cursor = db.cursor(dictionary=True,buffered=True)

        connected = True
    except:
        print("Failed to connect to the database. Retrying in 3 seconds...")
        sleep(3)
