from sqlalchemy.orm import Session
from app.db import models, schemas
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.config import database
from jose import JWTError, jwt

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def create_user(db: Session, user: schemas.UserCreate):
    db_user = models.Users(**user.model_dump())
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_users(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(models.Users).order_by(models.Users.User_ID)
    if limit is not None:
        query = query.limit(limit)
    return query.offset(skip).all()

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.Users).filter(models.Users.User_ID == user_id).first()

def get_users_by_email(db: Session, email: str):
    # partial matches
    return db.query(models.Users).filter(models.Users.Email.like(f"%{email}%")).all()

def get_users_by_name(db: Session, name: str):
    return db.query(models.Users).filter(models.Users.Name.like(f"%{name}%")).all()

def get_users_by_stream_id(db: Session, stream_id: int):
    return db.query(models.Users).filter(models.Users.Stream_ID == stream_id).all()

def get_users_by_designation_id(db: Session, designation_id: int):
    return db.query(models.Users).filter(models.Users.Designation_ID == designation_id).all()

def get_users_by_manager_id(db: Session, manager_id: int):
    return db.query(models.Users).filter(models.Users.Manager_ID == manager_id).all()