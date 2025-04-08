from sqlalchemy.orm import Session
from app.db import models, schemas

def create_course(db: Session, course: schemas.CourseCreate):
    db_course = models.Course(**course.model_dump())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

def get_courses(db: Session, skip: int = 0, limit: int | None = None):
    query = db.query(models.Course).order_by(models.Course.Course_ID)
    if limit is not None:
        query = query.limit(limit)
    return query.offset(skip).all()
