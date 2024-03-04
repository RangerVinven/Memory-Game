from fastapi import APIRouter, Response, Request, status, HTTPException
from models.users import CreateUser,LoginUser
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
    cursor.execute("INSERT INTO Users (username, firstname, lastname, email, password,session_token) values (%s,%s,%s,%s,%s,'')", (user.username,user.firstname,user.lastname,user.email,user.password)
)
    db.commit()

#TODO generates sessionID when signing up or logging in
        
#TODO user login
@app.post("/login")

def login(user:LoginUser,response:Response):
    cursor.execute("SELECT * from Users WHERE username =%s AND password =%s",(user.username,user.password))
    results=cursor.fetchall()
    if len(results) == 0:
        response.status_code = status.HTTP_401_UNAUTHORIZED
        return

    return {"session_token":"aasdada"}



#TODO user deletion
#@app.delete("/delete")



#TODO edit user details
#@app.patch("/edit")


