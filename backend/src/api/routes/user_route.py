from fastapi import APIRouter, Depends,status,HTTPException
from sqlalchemy.orm import Session

from src.api.database import db_conn
from src.api.models import request_models, response_model
from src.api.services import user_service
router = APIRouter()

get_db = db_conn.get_db

@router.post('/register',status_code=status.HTTP_201_CREATED,response_model=response_model.UserResponse)
def create_user(request: request_models.UserCreate, db: Session = Depends(get_db)):
        user = user_service.create(request, db)
        return response_model.UserResponse(
            name=user.name,
            email=user.email,
            message="User saved Successfully!"
        )


