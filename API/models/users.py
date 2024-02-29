from pydantic import BaseModel

class Users(BaseModel):
    userID: int
    username: str
    firstname: str
    lastname: str
    email: str
    password: str
    session_token: str

class CreateUser(BaseModel):
    username: str
    firstname: str
    lastname: str
    email: str
    password: str