"""
This module defines the user authentication routes for the FastAPI application.
Routes:
    - POST /auth/register: Register a new user.
    - GET /auth/users/me: Get the current authenticated user's information.
Functions:
    - register_user(user: UserCreate, db: AsyncSession): Registers a new user, hashes their password, saves them to the database, and sends a verification email.
    - get_current_user(user: UserResponse): Returns the current authenticated user's information.
Dependencies:
    - Depends(get_db): Provides the database session.
    - Depends(get_current_user): Provides the current authenticated user.
Models:
    - User: The SQLAlchemy model for the user.
    - UserCreate: The Pydantic schema for creating a user.
    - UserResponse: The Pydantic schema for the user response.
Utilities:
    - create_access_token: Utility function to create a JWT access token.
    - send_verification_email: Utility function to send a verification email.
    - hash_password: Utility function to hash a password.
"""

from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from models.user import User
from schemas.user import UserCreate, UserResponse
from database.config import get_db
from utils.jwt import create_access_token
from utils.email import send_verification_email
from utils.dependencies import hash_password
from utils.dependencies import get_current_user
from fastapi.responses import JSONResponse
from typing import Any

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate, db: AsyncSession = Depends(get_db)) -> UserResponse:
    """
    Registers a new user in the system.
    Args:
        user (UserCreate): The user information required for registration.
        db (AsyncSession, optional): The database session dependency. Defaults to Depends(get_db).
    Returns:
        UserResponse: The registered user information.
    Raises:
        HTTPException: If the email is already registered.
    Processes:
        1. Checks if the user already exists in the database by email.
        2. Hashes the user's password.
        3. Creates a new user object and adds it to the database.
        4. Commits the transaction and refreshes the user object.
        5. Sends an email verification link to the user's email.
    Note:
        The email verification link sending is simplified for now.
    """
    # Check if user already exists
    result = await db.execute(select(User).where(User.email == user.email))
    db_user = result.scalars().first()
    if db_user:
        raise HTTPException(status_code=400, detail=[{"msg": "Email is already registered"}])

    # Hash the password before saving
    hashed_password = hash_password(user.password)

    # Create a new user object
    db_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_password,
        role=user.role
    )

    # Add the new user to the database
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)

    # Send email verification link (simplified for now)
    verification_token = create_access_token(data={"sub": db_user.email})

    send_verification_email(db_user.email, verification_token)
    
    return db_user


@router.get('/users/me')
async def get_current_user(user: UserResponse = Depends(get_current_user)):
    """
    Retrieve the current authenticated user.

    This function uses dependency injection to get the current user from the 
    authentication system.

    Args:
        user (UserResponse): The current authenticated user, provided by the 
        `get_current_user` dependency.

    Returns:
        UserResponse: The current authenticated user.
    """
    return user
