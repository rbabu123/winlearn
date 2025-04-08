from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session, aliased
from app.db import models
from app.config import database
from app.helpers.utils import send_response, serialize_user
from pydantic import BaseModel

router = APIRouter()

def fetch_user_learning_paths(user_id: int, db: Session):
    """Fetches and structures user learning path data."""
    try:
        # Alias tables
        Course = aliased(models.Courses)
        LearningPath = aliased(models.LearningPaths)
        UserAssignedCourses = aliased(models.UserAssignedCourses)
        
        user_assigned_courses = (
            db.query(
                UserAssignedCourses.User_Course_ID,
                UserAssignedCourses.User_ID,
                UserAssignedCourses.Assigned_Date,
                UserAssignedCourses.Due_Date,
                UserAssignedCourses.Latest_Score,
                UserAssignedCourses.Is_Completed,
                UserAssignedCourses.Completion_Date,
                Course.Course_ID,
                Course.Course_Name,
                Course.Course_URL,
                LearningPath.Learning_Path_ID,
                LearningPath.Path_Name
            )
            .join(Course, UserAssignedCourses.Course_ID == Course.Course_ID)
            .join(LearningPath, UserAssignedCourses.Learning_Path_ID == LearningPath.Learning_Path_ID)
            .filter(UserAssignedCourses.User_ID == user_id)
            .all()
        )

        # Group by learning paths
        learning_paths_dict = {}

        for (
            user_course_id, user_id, assigned_date, due_date, latest_score, is_completed, completion_date,
            course_id, course_name, course_url, learning_path_id, learning_path_name
        ) in user_assigned_courses:

            if learning_path_id not in learning_paths_dict:
                learning_paths_dict[learning_path_id] = {
                    "Path_Name": learning_path_name,
                    "Learning_Path_ID": learning_path_id,
                    "Assigned_Date": assigned_date.strftime("%Y-%m-%d"),
                    "Due_Date": due_date.strftime("%Y-%m-%d") if due_date else None,
                    "Is_Completed": True,
                    "Completion_Date": None,
                    "Courses": []
                }

            # Add course details
            learning_paths_dict[learning_path_id]["Courses"].append({
                "Course_ID": course_id,
                "Course_Name": course_name,
                "Course_URL": course_url,
                "Completion_Date": completion_date.strftime("%Y-%m-%d") if completion_date else None,
                "Assigned_Date": assigned_date.strftime("%Y-%m-%d"),
                "Due_Date": due_date.strftime("%Y-%m-%d") if due_date else None,
                "Latest_Score": latest_score,
                "Is_Completed": is_completed
            })

        # Calculate overall completion status per learning path
        for lp in learning_paths_dict.values():
            lp["Is_Completed"] = all(course["Is_Completed"] for course in lp["Courses"])
            lp["Completion_Date"] = (
                max(course["Completion_Date"] for course in lp["Courses"] if course["Completion_Date"])
                if lp["Is_Completed"]
                else None
            )

        return list(learning_paths_dict.values())

    except Exception as e:
        raise RuntimeError(f"Error fetching learning paths: {str(e)}")

@router.get("/dashboard/{user_id}")
async def get_user_dashboard(user_id: int, db: Session = Depends(database.get_db)):
    """Returns structured dashboard data grouped by Learning Paths."""
    try:
        learning_paths = fetch_user_learning_paths(user_id = user_id, db=db)
        return send_response(200, "Dashboard data fetched successfully", data={"Learning_Paths": learning_paths})
    except Exception as e:
        return send_response(500, "Failed to fetch Dashboard Data for User", data={"error": str(e)})
    

@router.get("/me/{user_id}")
async def read_users_me(user_id: int, db: Session = Depends(database.get_db)):
    user = db.query(models.Users).filter(models.Users.User_ID == user_id).first()

    if not user:
        return send_response(404,"User Not found")

    user_data = serialize_user(user)
    return send_response(200, "User details fetched successfully", data = {"User": user_data})

@router.get("/fetch_questions/{assessment_id}")
async def fetch_questions(assessment_id: int, db: Session = Depends(database.get_db)):
    """Fetches questions for a given assessment."""
    return {"assessment_id": assessment_id}

@router.post("/submit_answers/")
async def submit_answers(db: Session = Depends(database.get_db)):
    """Submits answers for a given assessment."""
    return {"answers": "submitted"}