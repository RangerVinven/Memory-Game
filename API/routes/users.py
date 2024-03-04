from fastapi import APIRouter, Response, Request, status, HTTPException
from models.users import CreateUser
from utils.database_connector import db, cursor

app = APIRouter()



@app.get("/all")
def listUsers():
    cursor.execute("SELECT * FROM Users;")
    return cursor.fetchall()


#TODO create the session ID



#TODO create the user
@app.post("/create")

def createUser(user:CreateUser):
    cursor.execute("INSERT INTO users (username, firstname, lastname, email, password) values (%s,%s,%s,%s,%s)", (user.username,user.firstname,user.lastname,user.email,user.password)
)
    db.commit()

userID
username varchar(20)
firstname varchar(20)
lastname varchar(25)
email varchar(30)
password varchar(64)

session_token varchar(64)


#TODO user login
@app.post("/login")

#TODO user deletion
@app.delete("/delete")

#TODO edit user details
@app.patch("/edit")

