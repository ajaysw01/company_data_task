from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.api.database import db_conn
from src.api.models import schemas
from src.api.services import user_service
router = APIRouter()

get_db = db_conn.get_db

@router.post('/register', response_model=schemas.UserResponseModel)
def create_user(request: schemas.User, db: Session = Depends(get_db)):
    return user_service.create(request, db)
