from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.api.db.database import get_db
from app.api.db.models import User  
from app.api.config.config import get_settings
from app.api.auth.jwt_token import verify_token
from app.api.customexception.exceptions import AuthException

settings = get_settings()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.API_PREFIX}/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> User:
    credentials_exception = AuthException("Could not validate credentials")

    payload = verify_token(token, credentials_exception)
    email: str = payload.get("sub")

    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise AuthException("User not found")

    return user
