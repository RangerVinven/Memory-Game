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
    username: Optional[str]=None
    firstname: Optional[str]=None
    lastname: Optional[str]=None
    email: Optional[str]=None
    password: Optional[str]=None
