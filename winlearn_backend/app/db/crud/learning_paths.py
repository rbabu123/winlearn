from sqlalchemy.orm import Session
from app.db import models, schemas

def create_learning_path(db: Session, learning_path: schemas.LearningPathCreate):
    db_learning_path = models.LearningPaths(**learning_path.model_dump())
    db.add(db_learning_path)
    db.commit()
    db.refresh(db_learning_path)
    return db_learning_path