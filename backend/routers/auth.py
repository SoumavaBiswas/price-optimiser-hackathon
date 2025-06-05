"""
This module provides authentication-related routes for the FastAPI application.
Routes:
    - /auth/login: Handles user login by verifying credentials and generating an access token.
    - /auth/verify-email: Verifies the user's email address using the provided token.
Functions:
    - verify_password(plain_password: str, hashed_password: str) -> bool:
        Verifies if the provided plain password matches the hashed password.
    - login_user(form_data: security.OAuth2PasswordRequestForm, db: AsyncSession) -> dict:
    - verify_email(token: str, db: AsyncSession) -> dict:
        Verifies the user's email address using the provided token.
"""
from fastapi import APIRouter, HTTPException, Depends, security, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from passlib.context import CryptContext
from models.user import User
from database.config import get_db
from utils.jwt import create_access_token
from utils.jwt import verify_access_token
from utils.dependencies import hash_password
from typing import Any

router = APIRouter(prefix="/auth", tags=["auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Password verification function
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify if the provided plain password matches the hashed password.

    Args:
        plain_password (str): The plain text password to verify.
        hashed_password (str): The hashed password to compare against.

    Returns:
        bool: True if the plain password matches the hashed password, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


@router.post("/login", response_model=Any)
async def login_user(form_data: security.OAuth2PasswordRequestForm = Depends(), db: AsyncSession = Depends(get_db)):
    """
    Handles user login by verifying credentials and generating an access token.

    Args:
        form_data (security.OAuth2PasswordRequestForm): The form data containing the username and password.
        db (AsyncSession): The database session dependency.

    Returns:
        dict: A dictionary containing the access token and token type.

    Raises:
        HTTPException: If the credentials are invalid or the email is not verified.
    """
    print("Someone is trying to login")
    result = await db.execute(select(User).where(User.email == form_data.username))
    db_user = result.scalars().first()
    print(db_user.full_name, db_user.hashed_password)

    if db_user is None or not verify_password(form_data.password, db_user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not db_user.is_verified:
        raise HTTPException(status_code=403, detail="Email not verified")

    access_token = create_access_token(data={"sub": db_user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/verify-email")
async def verify_email(token: str, db: AsyncSession = Depends(get_db)):
    """
    Verify the user's email address using the provided token.
    This function verifies the user's email address by decoding the provided token
    and updating the user's record in the database to mark the email as verified.
    Args:
        token (str): The token used to verify the email address.
        db (AsyncSession, optional): The database session dependency. Defaults to Depends(get_db).
    Returns:
        dict: A dictionary containing a success message.
    Raises:
        HTTPException: If the user is not found in the database.
    """
    payload = verify_access_token(token)
    email = payload.get("sub")
    result = await db.execute(select(User).where(User.email == email))
    db_user = result.scalars().first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    db_user.is_verified = True
    await db.commit()
    return {"msg": "Email successfully verified"}
