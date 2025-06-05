from datetime import datetime, timedelta
from typing import Any, Dict
from jose import JWTError, jwt
from core.config import settings

# JWT Token Creation
def create_access_token(data: Dict[str, Any], expires_delta: timedelta = timedelta(minutes=15)) -> str:
    """
    Creates a JSON Web Token (JWT) for the given data with an expiration time.

    Args:
        data (Dict[str, Any]): The data to be encoded in the JWT.
        expires_delta (timedelta, optional): The time duration after which the token will expire. Defaults to 15 minutes.

    Returns:
        str: The encoded JWT as a string.
    """
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)
    return encoded_jwt

# JWT Token Verification
def verify_access_token(token: str) -> Dict[str, Any]:
    """
    Verifies the given JWT access token.

    This function decodes the provided JWT access token using the secret key and algorithm specified in the settings.
    If the token is valid, it returns the payload. If the token is invalid, it raises a JWTError.

    Args:
        token (str): The JWT access token to be verified.

    Returns:
        Dict[str, Any]: The decoded payload of the JWT access token.

    Raises:
        JWTError: If the token is invalid or cannot be decoded.
    """
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        return payload
    except JWTError:
        raise JWTError("Could not validate credentials")

# Extract the user email from JWT payload
def get_email_from_token(token: str) -> str:
    """
    Extracts the email address from a given JWT token.

    Args:
        token (str): The JWT token from which the email address is to be extracted.

    Returns:
        str: The email address extracted from the token's payload.
    """
    payload = verify_access_token(token)
    return payload.get("sub")
