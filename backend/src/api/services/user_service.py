import logging
from sqlalchemy.orm import Session
from src.api.utils import hashing
from src.api.models import request_models, models
from src.api.configurations.config import get_settings
from src.api.customexception.exceptions import UserExistsException
from src.api.configurations.logger import setup_logging

setup_logging()  # Initialize the logging configuration

logger = logging.getLogger(__name__)  # Use the logger for this specific file

settings = get_settings()


def create(request: request_models.UserCreate, db: Session):
    logger.debug("Starting user creation process")

    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        logger.warning(f"User with email {request.email} already exists")
        raise UserExistsException()

    logger.debug(f"Creating new user with email {request.email}")

    new_user = models.User(
        name=request.name,
        email=request.email,
        hashed_password=hashing.Hash.bcrypt(request.password)
    )

    db.add(new_user)
    logger.debug(f"User {request.name} added to the session")

    db.commit()
    logger.debug(f"User {request.name} committed to the database")

    db.refresh(new_user)
    logger.debug(f"User {request.name} refreshed from the database")

    return new_user
