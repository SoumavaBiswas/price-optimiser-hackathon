from sqlalchemy import Column, Integer, String, Boolean, Enum, DateTime
"""
This module defines the User model and UserRole enumeration for the price optimization tool.
Classes:
    UserRole(enum.Enum): Enumeration for user roles.
        - admin: Represents an admin user.
        - buyer: Represents a buyer user.
        - supplier: Represents a supplier user.
    User(Base): SQLAlchemy model for users.
        - id (Integer): Primary key for the user.
        - email (String): Unique email address of the user.
        - hashed_password (String): Hashed password of the user.
        - full_name (String): Full name of the user.
        - is_verified (Boolean): Indicates if the user's email is verified.
        - role (Enum): Role of the user, defaults to 'buyer'.
        - created_at (DateTime): Timestamp when the user was created.
        - updated_at (DateTime): Timestamp when the user was last updated.
        - products (relationship): Relationship with the Product model, indicating that a user can have multiple products.
"""
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from database.config import Base
from models.product import Product  # Ensure the Product model is imported

class UserRole(enum.Enum):
    admin = "admin"
    buyer = "buyer"
    supplier = "supplier"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    is_verified = Column(Boolean, default=False)
    role = Column(Enum(UserRole), default=UserRole.buyer)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
    
    # Relationship with Product (a user can have multiple products)
    products = relationship("Product", back_populates="user")

