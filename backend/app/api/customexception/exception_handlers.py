from fastapi import Request
from fastapi.responses import JSONResponse
from app.api.customexception.exceptions import (
    AuthException, 
    UserExistsException, 
    InvalidCredentialsException, 
    UserNotFoundException
)

async def auth_exception_handler(request: Request, exc: AuthException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

async def user_exists_exception_handler(request: Request, exc: UserExistsException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

async def invalid_credentials_exception_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

async def user_not_found_exception_handler(request: Request, exc: UserNotFoundException):
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})
