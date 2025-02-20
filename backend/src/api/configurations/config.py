from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path

class Settings(BaseSettings):
    APP_NAME: str = "Company Data Task"
    DEBUG_MODE: bool = False
    API_PREFIX: str = "/api"

    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    DATABASE_URL: str
    ALLOWED_ORIGINS: str

    class Config:
        env_file = str(Path(__file__).parents[3] / ".env")
        env_file_encoding = "utf-8"

@lru_cache
def get_settings():
    return Settings()
