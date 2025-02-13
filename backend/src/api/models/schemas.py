from pydantic import BaseModel, Field, EmailStr
from typing import Optional

class User(BaseModel):
    name: str = Field(..., min_length=2, max_length=40)
    email: EmailStr
    password: str = Field(..., min_length=4, max_length=24)

class UserResponseModel(BaseModel):
    name: str
    email: str

class Login(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
