from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.api.database import db_conn
from src.api.models import models
from src.api.utils import hashing
from src.api.customexception.exceptions import InvalidCredentialsException, UserNotFoundException
from src.api.auth import jwt_token
from datetime import timedelta
from fastapi.responses import JSONResponse  # Import JSONResponse

router = APIRouter(tags=["Authentication"])

@router.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(db_conn.get_db)):
    user = db.query(models.User).filter(models.User.email == request.username).first()
    if not user:
        raise UserNotFoundException()

    if not hashing.Hash.verify(request.password, user.hashed_password):
        raise InvalidCredentialsException()

    access_token_expires = timedelta(minutes=30)
    access_token = jwt_token.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    return JSONResponse(
        status_code=200,
        content={"access_token": access_token, "message": "Login Successful !"}
    )
