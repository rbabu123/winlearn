from fastapi.responses import JSONResponse
from fastapi import status
from app.db import models

def send_response(status_code: int, message: str, data: dict = None, token: str = None):
    """
    Formats API responses in a standardized structure.
    """
    response_data = {
        "success": status_code < 400,  # True for 200-399, False for 400+
        "message": message,
        "data": data or {},
        "_token": token
    }
    return JSONResponse(content=response_data, status_code=200)

def serialize_user(user):
    return {key: value for key, value in user.__dict__.items() if not key.startswith("_")}

def serialize_learning_path(learning_path: models.LearningPaths):
    """Convert SQLAlchemy object to dictionary."""
    return {
        "Learning_Path_ID": learning_path.Learning_Path_ID,
        "Creator_Admin_ID": learning_path.Creator_Admin_ID,
        "Path_Name": learning_path.Path_Name,
        "Path_Description": learning_path.Path_Description,
        "Path_Category": learning_path.Path_Category,
        "Due_Days": learning_path.Due_Days,
        "Created_Date": learning_path.Created_Date.strftime("%Y-%m-%d"),  # Convert date to string
    }

def serialize_course(course: models.Courses):
    """Convert SQLAlchemy object to dictionary."""
    return {
        "Course_ID": course.Course_ID,
        "Learning_Path_ID": course.Learning_Path_ID,
        "Course_Name": course.Course_Name,
        "Course_URL": course.Course_URL,
    }