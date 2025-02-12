from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

from app.api.config.config import get_settings
from app.api.customexception.exceptions import AuthException, InvalidCredentialsException, UserExistsException, UserNotFoundException
from app.api.db.database import Base, engine
from app.api.routes import  processing_csv, user
from app.api.auth import autentication
from app.api.customexception import exception_handlers
import time

Base.metadata.create_all(bind=engine)

settings = get_settings()


app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG_MODE
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
  
)

app.add_exception_handler(AuthException, exception_handlers.auth_exception_handler)
app.add_exception_handler(UserExistsException, exception_handlers.user_exists_exception_handler)
app.add_exception_handler(InvalidCredentialsException, exception_handlers.invalid_credentials_exception_handler)
app.add_exception_handler(UserNotFoundException, exception_handlers.user_not_found_exception_handler)


app.include_router(user.router, prefix=settings.API_PREFIX + "/users", tags=["User Registratration"])
app.include_router(autentication.router, prefix=settings.API_PREFIX + "/auth", tags=["Login"])
app.include_router(processing_csv.router, prefix=settings.API_PREFIX + "/csv", tags=["Process CSV"])

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = round(time.time() - start_time, 4)  
    response.headers["X-Process-Time"] = str(process_time)
    return response