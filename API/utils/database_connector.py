import mysql.connector

db = mysql.connector.connect(user="root", password="root", host="127.0.0.1", port="3307", database="Memory_Game")
cursor = db.cursor(dictionary=True)