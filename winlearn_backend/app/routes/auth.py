from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db import models, schemas
from app.config import database
from app.helpers.utils import send_response
from datetime import timedelta, date
from fastapi import status
from pydantic import BaseModel
from fastapi.security import OAuth2PasswordBearer
from app.helpers.security import create_access_token, verify_password, hash_password

router = APIRouter()

class LoginRequest(BaseModel):
    Email: str
    Password: str

class RegisterRequest(BaseModel):
    Email: str
    Password: str
    Name: str
    Stream_ID: int
    Designation_ID: int
    Manager_ID: int | None = None
    Is_LD_Admin: bool = False
    Is_Manager: bool = False
    Last_Login_Date: date | None = None

@router.post("/login")
def login_user(login_request: LoginRequest, db: Session = Depends(database.get_db)):
    """Handles user login."""
    user = db.query(models.Users).filter(models.Users.Email == login_request.Email).first()
    if not user or not verify_password(login_request.Password, user.Password_Hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    access_token_expires = timedelta(days=14)
    token = create_access_token(data={"sub": user.Email}, expires_delta=access_token_expires)

    # remove hash from this dict
    user_details = user.__dict__
    user_details.pop("Password_Hash")

    return {
        "status_code": 200,
        "message": "Logged in successfully",
        "data": {"user": user_details},
        "token": token
    }


@router.post("/register")
def register_user(register_request: RegisterRequest, db: Session = Depends(database.get_db)):
    """Handles user registration."""
    try:
        existing_user = db.query(models.Users).filter(models.Users.Email == register_request.Email).first()
        if existing_user:
            return send_response(status_code= 400, message= "Username already exists")

        new_user = models.Users(
                Email=register_request.Email
                , Password_Hash=hash_password(register_request.Password)
                , Name=register_request.Name
                , Stream_ID=register_request.Stream_ID
                , Designation_ID=register_request.Designation_ID
                , Manager_ID=register_request.Manager_ID
                , Is_LD_Admin=register_request.Is_LD_Admin
                , Is_Manager=register_request.Is_Manager
                , Last_Login_Date=register_request.Last_Login_Date
                )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        token = create_access_token(data={"sub": new_user.Email}, expires_delta=timedelta(days=14))

        user_details = {key: value for key, value in new_user.__dict__.items() if key != "_sa_instance_state"}
        user_details.pop("Password_Hash")

        return send_response(200, "User registered successfully", data={"user": user_details}, token=token)
    except Exception as e:
        return send_response(500, "Internal server error. Try again", data={"error": str(e)})