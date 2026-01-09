from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import Annotated
from . import utils

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

#Utility to protect routes depending on current user
def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )
    return utils.verify_token(token, credentials_exception)