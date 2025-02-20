from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from src.api.database.db_conn import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name= Column(String, index=True, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String,nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
