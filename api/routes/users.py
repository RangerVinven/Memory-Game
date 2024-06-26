from fastapi import APIRouter, Response, Request, status, HTTPException
from models.users import *
import time
from hashlib import sha256
from utils.database_connector import db, cursor

app = APIRouter()



@app.get("/all")
def listUsers():
    cursor.execute("SELECT * FROM Users;")
    return cursor.fetchall()



@app.post("/")
def listUsers(request:SessionTokenUser):
    cursor.execute("SELECT * FROM Users WHERE session_token =%s;",(request.session_token,))
    return cursor.fetchone()

#TODO generates sessionID when signing up or logging in

#TODO create the session ID
def createToken(username,firstname,lastname,email,password):
    return hashPass(username+firstname+lastname+email+password+str(time.time()))
    


#TODO create the user
@app.post("/create")

def createUser(user:CreateUser):
    session_token = createToken(user.username,user.firstname,user.lastname,user.email,user.password)
    cursor.execute("INSERT INTO Users (username, firstname, lastname, email, password,session_token) values (%s,%s,%s,%s,%s,%s)", (user.username,user.firstname,user.lastname,user.email,hashPass(user.password),session_token)
)

    db.commit()
    return {"session_token",session_token}


def hashPass(textToHash):
    return sha256(textToHash.encode("utf-8")).hexdigest()
    

        
#TODO user login
@app.post("/login")

def login(user:LoginUser,response:Response):
    cursor.execute("SELECT username,firstname,lastname,email,password from Users WHERE email=%s AND password =%s",(user.email,hashPass(user.password)))
    results=cursor.fetchall()
    if len(results) == 0:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return
    user=results[0] 
    session_token = createToken(user["username"],user["firstname"],user["lastname"],user["email"],user["password"])
    cursor.execute("UPDATE Users SET session_token =%s WHERE username=%s AND password=%s",(session_token,user["username"],user["password"]))
    return {"session_token":session_token}

#TODO user deletion
@app.delete("/delete")
def deleteUser(request:SessionTokenUser):
    cursor.execute("DELETE from Users WHERE session_token = %s",(request.session_token,))

    db.commit()



#TODO edit user details
@app.patch("/edit")
def editUser(request:UpdateUser):
    if request.password == None or request.password == "":
        cursor.execute("UPDATE Users SET username = %s, firstname =%s, lastname =%s, email = %s WHERE session_token = %s",(request.username,request.firstname,request.lastname,request.email,request.session_token))
    
    else:
        password=hashPass(request.password)
        cursor.execute("UPDATE Users SET username = %s, firstname =%s, lastname =%s, email = %s, password = %s WHERE session_token = %s",(request.username,request.firstname,request.lastname,request.email,password,request.session_token))

    db.commit()

