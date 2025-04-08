from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from fastapi import HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from app.db import database, models
from passlib.context import CryptContext
from app.helpers.utils import send_response

# Secret key for JWT
SECRET_KEY = "your_secret_key_here"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 14
TOKEN_REFRESH_THRESHOLD_DAYS = 2  # If token expires in 2 days, issue a new one

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (expires_delta if expires_delta else timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str, db: Session):
    """ Validates the token and issues a new one if close to expiration. """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        Email: str = payload.get("sub")
        exp: int = payload.get("exp")

        if Email is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        # Check if user exists
        user = db.query(models.Users).filter(models.Users.Email == Email).first()
        if not user:
            return send_response(status_code=401, message="User not found")

        # Check token expiration
        exp_datetime = datetime.fromtimestamp(exp, tz=timezone.utc)
        now = datetime.now(timezone.utc)
        remaining_days = (exp_datetime - now).days

        # If token is about to expire in less than `TOKEN_REFRESH_THRESHOLD_DAYS`, issue a new one
        if (remaining_days < TOKEN_REFRESH_THRESHOLD_DAYS):
            new_token = create_access_token({"sub": Email}, timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS))
        else:
            new_token = token

        return {"user": user, "token": new_token}

    except JWTError:
        return send_response(status_code=401, message="Invalid or expired token")

def hash_password(password: str) -> str:
    """Hash the password using bcrypt."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against a hashed password."""
    return pwd_context.verify(plain_password, hashed_password)

def get_current_user(db: Session = Depends(database.get_db), token: str = Depends(oauth2_scheme)):
    if token is None:
        return None
    token = token.replace("Bearer ", "")
    """ Returns the current user from the token. """
    validation_result = verify_token(token, db)
    return validation_result["user"]
