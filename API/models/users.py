from pydantic import BaseModel
from typing import Optional

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


class LoginUser(BaseModel):
    username: str
    password: str

class UpdateUser(BaseModel):
    username: str
    firstname: str
    lastname: str
    email: str
    password: str
    session_token: str

class SessionTokenUser(BaseModel):
    session_token: str