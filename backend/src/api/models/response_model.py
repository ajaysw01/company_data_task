from pydantic import BaseModel, EmailStr


class UserResponse(BaseModel):
    name: str
    email: EmailStr
    message: str

    class Config:
        from_attributes  = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
