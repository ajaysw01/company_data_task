from datetime import datetime, timedelta, timezone
import logging
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from src.api.configurations.config import get_settings
from src.api.customexception.exceptions import AuthException

# Fetch settings
settings = get_settings()
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = int(settings.ACCESS_TOKEN_EXPIRE_MINUTES)


def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    now = datetime.now(timezone.utc)
    expire = now + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    payload = data.copy()
    payload.update({"exp": expire})

    try:
        token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
        logging.info(f"Token created for user {data.get('sub')}, expires at {expire}")
    except Exception as e:
        logging.exception("Error encoding JWT: %s", e)
        raise AuthException("Error creating token")

    return token


def verify_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        if "sub" not in payload:
            logging.error("Token payload missing 'sub' claim.")
            raise AuthException("Invalid token payload")

        logging.info(f"Token verified successfully for user: {payload.get('sub')}")
        return payload

    except ExpiredSignatureError as exc:
        logging.warning("Token expired: %s", exc)
        raise AuthException("Token has expired") from exc
    except InvalidTokenError as exc:
        logging.warning("Invalid token: %s", exc)
        raise AuthException("Invalid token") from exc
    except Exception as e:
        logging.exception("Error verifying JWT: %s", e)
        raise AuthException("Error verifying token")
