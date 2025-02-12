from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.api.db import database
from app.api.utils import schemas
from app.api.services import user_service
router = APIRouter()

get_db = database.get_db

@router.post('/register', response_model=schemas.UserResponseModel)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    return user_service.create(request, db)
