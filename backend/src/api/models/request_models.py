from pydantic import BaseModel, Field, EmailStr

class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=40)
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=24)

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
