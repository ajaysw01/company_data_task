from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class User(BaseModel):
    email: str
    password : str

class UserResponseModel(BaseModel):
    email: str

class Login(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
