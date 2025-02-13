from sqlalchemy.orm import Session
from src.api.utils import hashing
from src.api.models import schemas, models
from src.api.configurations.config import get_settings
from src.api.customexception.exceptions import UserExistsException, UserNotFoundException

settings = get_settings()

def create(request: schemas.User, db: Session):
    existing_user = db.query(models.User).filter(models.User.email == request.email).first()
    if existing_user:
        raise UserExistsException()
    
    new_user = models.User(
        email=request.email,
        hashed_password=hashing.Hash.bcrypt(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def show(id: int, db: Session):
    user = db.query(models.User).filter(models.User.id == id).first()
    if not user:
        raise UserNotFoundException
    return user

