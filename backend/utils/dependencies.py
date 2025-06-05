from fastapi import Security, HTTPException, Depends
"""
This module provides utility functions and dependencies for the FastAPI application.

Functions:
    get_current_user(token: str, db: AsyncSession) -> User:
        Dependency to get the current user from the token. Raises HTTPException if the user is not found.

    has_role(roles: List[str]):
        Dependency to check for required roles. Raises HTTPException if the user does not have the required role.

    hash_password(password: str) -> str:
        Hashes a password using bcrypt.
"""
from fastapi.security import OAuth2PasswordBearer
from utils.jwt import get_email_from_token
from models.user import User
from database.config import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List
from passlib.context import CryptContext

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Dependency to get the current user from the token
async def get_current_user(token: str = Security(oauth2_scheme), db: AsyncSession = Depends(get_db)) -> User:
    """
    Retrieve the current user based on the provided token.

    Args:
        token (str): The OAuth2 token used for authentication.
        db (AsyncSession): The database session dependency.

    Returns:
        User: The user object corresponding to the email extracted from the token.

    Raises:
        HTTPException: If the user is not found, raises a 401 Unauthorized error.
    """
    email = get_email_from_token(token)
    result = await db.execute(select(User).where(User.email == email))
    user = result.scalars().first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# Dependency to check for required roles
def has_role(roles: List[str]):
    """
    Dependency function to check if the current user has one of the specified roles.
    Args:
        roles (List[str]): A list of role names that are allowed to access the endpoint.
    Returns:
        Callable: A dependency function that checks the user's role and raises an HTTPException
                  if the user does not have one of the specified roles.
    Raises:
        HTTPException: If the user's role is not in the list of allowed roles, a 403 Forbidden
                       error is raised.
    """
    
    def _has_role(user: User = Depends(get_current_user)):
        print(user.full_name, user.role, roles)
        if user.role.name not in roles:
            raise HTTPException(status_code=403, detail="Insufficient permissions")
        return user
    return _has_role

def hash_password(password: str) -> str:
    """
    Hashes a plain text password using a secure hashing algorithm.

    Args:
        password (str): The plain text password to be hashed.

    Returns:
        str: The hashed password.
    """
    return pwd_context.hash(password)
