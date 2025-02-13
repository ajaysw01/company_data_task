from fastapi import HTTPException, status

class AuthException(HTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class UserExistsException(HTTPException):
    def __init__(self, detail: str = "Username already exists"):
        super().__init__(
            status_code=status.HTTP_409_CONFLICT,
            detail=detail
        )

class InvalidCredentialsException(HTTPException):
    def __init__(self, detail: str = "Invalid credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail
        )

class UserNotFoundException(HTTPException) : 
    def __init__(self, detail : str = "User Not Found !"):
        super.__init__(
            status_code= status.HTTP_404_NOT_FOUND,
            detail=detail
        )

