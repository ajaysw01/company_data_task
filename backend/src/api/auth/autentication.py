import logging
from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from src.api.database import db_conn
from src.api.models import models
from src.api.utils import hashing
from src.api.customexception.exceptions import InvalidCredentialsException, UserNotFoundException
from src.api.auth import jwt_token
from datetime import timedelta
from fastapi.responses import JSONResponse

router = APIRouter(tags=["Authentication"])

logger = logging.getLogger(__name__)

@router.post("/login")
def login(request: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(db_conn.get_db)):
    logger.info(f"Login attempt for user: {request.username}")
    try:
        user = db.query(models.User).filter(models.User.email == request.username).first()
        if not user:
            logger.warning(f"User not found: {request.username}")
            raise UserNotFoundException()

        if not hashing.Hash.verify(request.password, user.hashed_password):
            logger.warning(f"Invalid credentials for user: {request.username}")
            raise InvalidCredentialsException()

        access_token_expires = timedelta(minutes=30)
        access_token = jwt_token.create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )

        logger.info(f"Login successful for user: {request.username}")
        return JSONResponse(
            status_code=200,
            content={"access_token": access_token, "message": "Login Successful !"}
        )
    except UserNotFoundException as e:
        logger.error(f"UserNotFoundException: {e}")
        raise e
    except InvalidCredentialsException as e:
        logger.error(f"InvalidCredentialsException: {e}")
        raise e
    except Exception as e:
        logger.exception(f"An unexpected error occurred during login for user: {request.username}")
        raise