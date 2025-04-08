from fastapi import APIRouter, Depends, Request, BackgroundTasks
from sqlalchemy.orm import Session, aliased
from app.db import models
from app.config import database
from app.helpers.utils import send_response, serialize_learning_path, serialize_course, serialize_user
from app.db.schemas import LearningPathCreate, CourseCreate
from sqlalchemy.exc import SQLAlchemyError
from datetime import date, timedelta, datetime, timezone
from sqlalchemy import func, cast, Integer
from pydantic import BaseModel
from app.helpers.extract import extract_content
from app.helpers.generate import generate_questions
from fastapi import BackgroundTasks
import asyncio
from app.helpers.smtp import send_path_registration_email, send_path_addition_failure_email

router = APIRouter()

class LearningPathCreateRequest(LearningPathCreate):
    Courses: list[CourseCreate]

class AssignLearningPathsRequest(BaseModel):
    Users: list[int]
    Learning_Path_ID: int
    
class DeleteLearningPathRequest(BaseModel):
    Learning_Path_ID: int
    User_ID: int
    
from sqlalchemy.orm import Session
from app.db import models

def save_questions_to_db(questions, course_id: int, db: Session):
    """Saves MCQs to the database along with their options."""
    try:
        for question in questions:
            new_question = models.Questions(
                Course_ID=course_id,
                Question_Text=question["question"]
            )
            db.add(new_question)
            db.commit()
            db.refresh(new_question)

            for option in question["options"]:
                new_option = models.Options(
                    Question_ID=new_question.Question_ID,
                    Option_Text=option["text"],
                    Is_Correct=option["is_true"]
                )
                db.add(new_option)

        db.commit()
        return {"status_code": 200, "message": "Questions saved successfully"}

    except Exception as e:
        db.rollback()
        return {"status_code": 500, "message": str(e)}


@router.get("/dashboard")
def get_admin_dashboard(db: Session = Depends(database.get_db)):
    """Returns all learning paths along with path statistics."""
    
    try:
        learning_paths = (
            db.query(
                models.LearningPaths.Learning_Path_ID,
                models.LearningPaths.Creator_Admin_ID,
                models.LearningPaths.Path_Name,
                models.LearningPaths.Path_Description,
                models.LearningPaths.Path_Category,
                models.LearningPaths.Due_Days,
                models.LearningPaths.Created_Date,
                models.Users.Name.label("Creator_Admin_Name"),
            )
            .join(models.Users, models.LearningPaths.Creator_Admin_ID == models.Users.User_ID)
            .filter(models.LearningPaths.Is_Active == 1)
            .all()
        )

        response_data = []

        for path in learning_paths:
            courses = db.query(models.Courses).filter(models.Courses.Learning_Path_ID == path.Learning_Path_ID).all()
            course_count = len(courses)
            
            if course_count == 0:
                continue

            course_data = []
            for course in courses:
                assigned_users_query = db.query(models.UserAssignedCourses).filter(models.UserAssignedCourses.Course_ID == course.Course_ID)
                assigned_users = assigned_users_query.count()

                completed_users = assigned_users_query.filter(models.UserAssignedCourses.Is_Completed == True).count()

                overdue_users = assigned_users_query.filter(
                    models.UserAssignedCourses.Is_Completed == False,
                    models.UserAssignedCourses.Due_Date < datetime.now(timezone.utc)
                ).count()

                avg_latest_score = db.query(func.avg(models.UserAssignedCourses.Latest_Score)).filter(
                    models.UserAssignedCourses.Course_ID == course.Course_ID
                ).scalar()

                course_data.append({
                    "Course_ID": course.Course_ID,
                    "Learning_Path_ID": course.Learning_Path_ID,
                    "Course_Name": course.Course_Name,
                    "Course_URL": course.Course_URL,
                    "Total_Users_Assigned": assigned_users,
                    "Total_Users_Completed": completed_users,
                    "Total_Overdue": overdue_users,
                    "Average_Score": avg_latest_score or 0  # Default to 0 if no scores
                })

            # Learning Path-level Metrics
            total_users_assigned = db.query(models.UserAssignedCourses).filter(models.UserAssignedCourses.Learning_Path_ID == path.Learning_Path_ID).count()//course_count
                    
            completed_users_subquery = (
                db.query(models.UserAssignedCourses.User_ID)
                .filter(models.UserAssignedCourses.Learning_Path_ID == path.Learning_Path_ID)
                .group_by(models.UserAssignedCourses.User_ID)
                .having(func.count(models.UserAssignedCourses.Course_ID) == func.sum(cast(models.UserAssignedCourses.Is_Completed, Integer)))  # User completes all courses
                .subquery()
            )

            # Count distinct users who completed the learning path
            total_users_completed = (
                db.query(func.count(func.distinct(completed_users_subquery.c.User_ID)))
                .scalar()
            ) or 0

            total_overdue = db.query(models.UserAssignedCourses).filter(
                models.UserAssignedCourses.Learning_Path_ID == path.Learning_Path_ID,
                models.UserAssignedCourses.Is_Completed == False,
                models.UserAssignedCourses.Due_Date < datetime.now(timezone.utc)
            ).count()

            avg_learning_path_score = db.query(func.avg(models.UserAssignedCourses.Latest_Score)).filter(
                models.UserAssignedCourses.Learning_Path_ID == path.Learning_Path_ID
            ).scalar()

            response_data.append({
                    "Learning_Path_ID": path.Learning_Path_ID,
                    "Creator_Admin_ID": path.Creator_Admin_ID,
                    "Creator_Admin_Name": path.Creator_Admin_Name,
                    "Path_Name": path.Path_Name,
                    "Path_Description": path.Path_Description,
                    "Path_Category": path.Path_Category,
                    "Due_Days": path.Due_Days,
                    "Created_Date": path.Created_Date.strftime("%Y-%m-%d"),
                    "Total_Users_Assigned": total_users_assigned,
                    "Total_Users_Completed": total_users_completed,
                    "Total_Overdue": total_overdue,
                    "Average_Score": avg_learning_path_score or 0,  # Default to 0 if no scores
                    "Courses": course_data
                },
                )

        return send_response(200, "Learning Paths fetched successfully", data={"Learning_Paths": response_data})
    
    except SQLAlchemyError as e:
        db.rollback()  # Rollback in case of any database-related error
        return send_response(500, "Database error occurred", data={"error": str(e)})

    except Exception as e:
        return send_response(500, "An unexpected error occurred", data={"error": str(e)})


@router.get("/learning_paths")
def get_learning_paths(db: Session = Depends(database.get_db)):
    """Returns all learning paths created by User."""
    try:
        # Get all learning paths with creator admin name
        learning_paths = (
            db.query(
                models.LearningPaths.Learning_Path_ID,
                models.LearningPaths.Creator_Admin_ID,
                models.LearningPaths.Path_Name,
                models.LearningPaths.Path_Description,
                models.LearningPaths.Path_Category,
                models.LearningPaths.Due_Days,
                models.LearningPaths.Created_Date,
                models.Users.Name.label("Creator_Admin_Name"),
            )
            .join(models.Users, models.LearningPaths.Creator_Admin_ID == models.Users.User_ID)
            .filter(models.LearningPaths.Is_Active == 1)
            .all()
        )

        # Construct the nested response format
        response_data = []
        for path in learning_paths:
            courses = (
                db.query(
                    models.Courses.Course_ID,
                    models.Courses.Learning_Path_ID,
                    models.Courses.Course_Name,
                    models.Courses.Course_URL,
                )
                .filter(models.Courses.Learning_Path_ID == path.Learning_Path_ID)
                .all()
            )

            response_data.append({
                "Learning_Path_ID": path.Learning_Path_ID,
                "Creator_Admin_ID": path.Creator_Admin_ID,
                "Creator_Admin_Name": path.Creator_Admin_Name,
                "Path_Name": path.Path_Name,
                "Path_Description": path.Path_Description,
                "Path_Category": path.Path_Category,
                "Due_Days": path.Due_Days,
                "Created_Date": path.Created_Date.strftime("%Y-%m-%d"),
                "Courses": [
                    {
                        "Course_ID": course.Course_ID,
                        "Learning_Path_ID": course.Learning_Path_ID,
                        "Course_Name": course.Course_Name,
                        "Course_URL": course.Course_URL
                    }
                    for course in courses
                ]
            })

        return send_response(200, "Learning Paths fetched successfully", data={"Learning_Paths": response_data})

    except Exception as e:
        return send_response(500, "An unexpected error occurred", data={"error": str(e)})


# @router.post("/add_learning_path")
# async def create_learning_path(req: LearningPathCreateRequest, db: Session = Depends(database.get_db)):
#     """Creates a new learning path."""
#     created_courses = []
#     new_path = None
    
#     try:
#         # Verify if user_id is Admin
#         user = db.query(models.Users).filter(models.Users.User_ID == req.Creator_Admin_ID).first()
#         if not user:
#             return send_response(404, "User not found")
#         if not user.Is_LD_Admin:
#             return send_response(401, "Unauthorized User")

#         # Create Learning Path
#         new_path = models.LearningPaths(
#             Creator_Admin_ID=req.Creator_Admin_ID,
#             Path_Name=req.Path_Name,
#             Path_Description=req.Path_Description,
#             Path_Category=req.Path_Category,
#             Due_Days=req.Due_Days,
#             Created_Date=date.today()
#         )
#         db.add(new_path)
#         db.commit()
#         db.refresh(new_path)
#         path_id = new_path.Learning_Path_ID

#         for course in req.Courses:
#             new_course = models.Courses(
#                 Learning_Path_ID=path_id,
#                 Course_Name=course.Course_Name,
#                 Course_URL=course.Course_URL
#             )
#             db.add(new_course)
#             db.commit()
#             db.refresh(new_course)
#             created_courses.append(new_course)

#             file_name = f"{new_course.Course_ID}_{new_course.Course_Name.replace(' ', '-')}"
#             response_ext = await extract_content(file_name, new_course.Course_URL)
#             if response_ext["status_code"] != 200:
#                 raise Exception(f"Failed to extract transcript for {new_course.Course_Name}")

#             response_questions = await generate_questions(file_name)
#             if response_questions["status_code"] != 200:
#                 raise Exception(f"Failed to generate questions for {new_course.Course_Name}")

#             response = save_questions_to_db(response_questions["Questions"], course_id=new_course.Course_ID, db=db)
#             if response["status_code"] != 200:
#                 raise Exception(f"Failed to save questions for {new_course.Course_Name}")
        
#         db.commit()
        
#         learning_path = serialize_learning_path(new_path)
#         courses = [serialize_course(c) for c in created_courses]
#         learning_path["Courses"] = courses

#         return send_response(200, "Learning path created successfully", data={"Learning_Path": learning_path})
    
#     except Exception as e:
#         cleanup_learning_path(new_path.Learning_Path_ID, db)
#         return send_response(500, "An error occurred while creating the learning path. Try again.", data={"error": str(e)})


# User the below 3 functions to process the addition in background
@router.post("/add_learning_path")
async def create_learning_path(req: LearningPathCreateRequest, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    """Creates a new learning path and processes extraction & generation in the background."""
    
    created_courses = []
    new_path = None
    try:
        # Verify if user_id is Admin
        user = db.query(models.Users).filter(models.Users.User_ID == req.Creator_Admin_ID).first()
        if not user:
            return send_response(404, "User not found")
        if not user.Is_LD_Admin:
            return send_response(401, "Unauthorized User")

        # Add Learning Path to DB
        new_path = models.LearningPaths(
            Creator_Admin_ID=req.Creator_Admin_ID,
            Path_Name=req.Path_Name,
            Path_Description=req.Path_Description,
            Path_Category=req.Path_Category,
            Due_Days=req.Due_Days,
            Created_Date=date.today()
        )
        db.add(new_path)
        db.commit()
        db.refresh(new_path)

        path_id = new_path.Learning_Path_ID

        # Add Courses to DB
        for course in req.Courses:
            new_course = models.Courses(
                Learning_Path_ID=path_id,
                Course_Name=course.Course_Name,
                Course_URL=course.Course_URL
            )
            db.add(new_course)
            db.commit()
            db.refresh(new_course)
            created_courses.append(new_course)

        db.commit()

        # Start extraction & generation in the background
        background_tasks.add_task(process_learning_path, new_path.Learning_Path_ID, new_path.Path_Name, [c.Course_ID for c in created_courses], req.Creator_Admin_ID,  background_tasks)

        # Return response immediately
        learning_path = serialize_learning_path(new_path)
        courses = [serialize_course(c) for c in created_courses]
        learning_path["Courses"] = courses

        return send_response(200, "Learning path created successfully. Processing transcript extraction & question generation in the background, check back in 5 minutes.",
                            data={"Learning_Path": learning_path})

    except Exception as e:
        db.rollback()
        return send_response(500, "An error occurred while creating the learning path.", data={"error": str(e)})


async def process_learning_path(learning_path_id: int, path_name: str, course_ids: list, user_id: int, background_tasks: BackgroundTasks):
    """Handles transcript extraction & question generation asynchronously. Cleans up if any failure occurs."""
    db = next(database.get_db())  # Get a new DB session
    
    try:
        for course_id in course_ids:
            # Fetch Course
            course = db.query(models.Courses).filter(models.Courses.Course_ID == course_id).first()
            if not course:
                print(f"Course {course_id} not found.")
                continue

            file_name = f"{course.Course_ID}_{course.Course_Name.replace(' ', '-')}"
            print(file_name)

            # Step 1: Extract Content
            response_ext = await extract_content(file_name, course.Course_URL)
            if response_ext["status_code"] != 200:
                raise Exception(f"Failed to extract transcript for {course.Course_Name}")
            
            

            # Step 2: Generate Questions
            response_questions = await generate_questions(file_name)
            if response_questions["status_code"] != 200:
                raise Exception(f"Failed to generate questions for {course.Course_Name}")
            print(response_questions)

            # Step 3: Save Questions to DB
            response_save = save_questions_to_db(response_questions["Questions"], course_id=course.Course_ID, db=db)
            if response_save["status_code"] != 200:
                raise Exception(f"Failed to save questions for {course.Course_Name}")
            print(f"Successfully processed learning path: {course.Course_Name}")

        db.commit()
        print(f"Successfully processed learning path: {learning_path_id}")

    except Exception as e:
        print(f"Processing failed for learning path {learning_path_id}. Cleaning up... Error: {str(e)}")
        background_tasks.add_task(send_path_addition_failure_email, user_id, path_name , db)
        cleanup_learning_path(learning_path_id, db)


def cleanup_learning_path(learning_path_id: int, db: Session):
    """Deletes all questions, options, courses, and learning paths associated with the given learning path ID."""
    try:
        # Delete Options
        db.query(models.Options).filter(models.Options.Question_ID.in_(
            db.query(models.Questions.Question_ID)
            .join(models.Courses, models.Questions.Course_ID == models.Courses.Course_ID)
            .filter(models.Courses.Learning_Path_ID == learning_path_id)
        )).delete(synchronize_session=False)

        # Delete Questions
        db.query(models.Questions).filter(models.Questions.Course_ID.in_(
            db.query(models.Courses.Course_ID).filter(models.Courses.Learning_Path_ID == learning_path_id)
        )).delete(synchronize_session=False)

        # Delete Courses
        db.query(models.Courses).filter(models.Courses.Learning_Path_ID == learning_path_id).delete(synchronize_session=False)

        # Delete Learning Path
        db.query(models.LearningPaths).filter(models.LearningPaths.Learning_Path_ID == learning_path_id).delete(synchronize_session=False)

        db.commit()
        print(f"🗑️ Cleaned up Learning Path {learning_path_id} after failure.")

    except Exception as e:
        db.rollback()
        print(f"❌ Error during cleanup for Learning Path {learning_path_id}: {str(e)}")


@router.get("/get_all_users")
def get_users(db: Session = Depends(database.get_db)):
    """Returns all users."""
    try:
        Manager = aliased(models.Users, name="Manager")

        users = db.query(
            models.Users,
            models.Designations.Designation_Name.label("Designation"),
            models.Streams.Stream_Name.label("Stream"),
            Manager.Name.label("Manager")
        ).outerjoin(models.Designations, models.Users.Designation_ID == models.Designations.Designation_ID)\
        .outerjoin(models.Streams, models.Users.Stream_ID == models.Streams.Stream_ID)\
        .outerjoin(Manager, models.Users.Manager_ID == Manager.User_ID)\
        .all()

        if not users:
            return send_response(404, "No users found", data={"Users": []})

        users_list = []
        for user, designation, stream, manager in users:
            user_data = serialize_user(user)
            user_data["Designation"] = designation
            user_data["Stream"] = stream
            user_data["Manager"] = manager if manager else None
            user_data.pop("Password_Hash", None)
            users_list.append(user_data)

        return send_response(200, "Users fetched successfully", data={"Users": users_list})
    
    except Exception as e:
        return send_response(500, "An unexpected error occurred", data={"error": str(e)})


@router.post("/assign_learning_paths")
async def assign_learning_paths(req: AssignLearningPathsRequest, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    """Assigns learning paths and courses to users."""
    try:
        learning_path = db.query(models.LearningPaths).filter(models.LearningPaths.Learning_Path_ID == req.Learning_Path_ID).first()
        if not learning_path:
            return send_response(404, "Learning path not found")
        
        # Verify valid users
        users = db.query(models.Users).filter(models.Users.User_ID.in_(req.Users)).all()
        if len(users) != len(req.Users):
            return send_response(404, "One or more users not found")

        # Fetch courses under the learning path
        courses = db.query(models.Courses).filter(models.Courses.Learning_Path_ID == req.Learning_Path_ID).all()
        if not courses:
            return send_response(400, "No courses found for the selected learning path")
        
        course_ids = [course.Course_ID for course in courses]
        
        # Check for existing assignments before proceeding
        already_assigned_users = (
            db.query(
                models.UserAssignedCourses.User_ID
                , models.Users.Name)
            .join(models.Users, models.UserAssignedCourses.User_ID == models.Users.User_ID)
            .filter(models.UserAssignedCourses.User_ID.in_(req.Users))
            .filter(models.UserAssignedCourses.Course_ID.in_(course_ids))
            .distinct()
            .all()
        )

        already_assigned_users = [
            {"User_ID": user[0], "Name": user[1]} for user in already_assigned_users
        ]

        if already_assigned_users:
            return send_response(409, "The User/Users are already assigned to the specified path.", data={"Already_Assigned_Users": already_assigned_users})

        user_assignments = []
        for user in req.Users:
            assigned_date = date.today()
            due_date = assigned_date + timedelta(days=learning_path.Due_Days) if learning_path.Due_Days else None

            for course in courses:
                user_course = models.UserAssignedCourses(
                    User_ID=user,
                    Learning_Path_ID=learning_path.Learning_Path_ID,
                    Course_ID=course.Course_ID,
                    Assigned_Date=assigned_date,
                    Due_Date=due_date,
                    Latest_Score=None,
                    Is_Completed=False,
                    Completion_Date=None
                )
                db.add(user_course)
                db.commit()
                db.refresh(user_course)

                user_assignments.append({
                    "User_Course_ID": user_course.User_Course_ID,
                    "User_ID": user,
                    "Learning_Path_ID": learning_path.Learning_Path_ID,
                    "Course_ID": course.Course_ID,
                    "Assigned_Date": assigned_date.strftime("%Y-%m-%d"),
                    "Due_Date": due_date.strftime("%Y-%m-%d") if due_date else None,
                    "Latest_Score": None,
                    "Is_Completed": False,
                    "Completion_Date": None
                })
                
        background_tasks.add_task(send_path_registration_email, req.Users, req.Learning_Path_ID, db)
        return send_response(200, "Learning paths assigned successfully", data={"Learning_Path_Assignments": user_assignments})
    except Exception as e:
        db.rollback()
        return send_response(500, "An error occurred while assigning learning paths. Try again.", data={"error": str(e)})
    

@router.delete("/delete_learning_path/")
async def delete_learning_path(req: DeleteLearningPathRequest, db: Session = Depends(database.get_db)):
    """Deletes a learning path along with its associated courses, questions, and options."""
    try:
        # Verify if user_id is Admin
        user = db.query(models.Users).filter(models.Users.User_ID == req.User_ID).first()
        if not user:
            return send_response(404, "User not found")
        if not user.Is_LD_Admin:
            return send_response(401, "Unauthorized User")
        
        path = db.query(models.LearningPaths).filter(models.LearningPaths.Learning_Path_ID == req.Learning_Path_ID).first()
        if not path:
            return send_response(404, "Learning path not found or already deleted.")
        
        path.Is_Active = False
        db.commit()
        return send_response(200, "Learning path deleted successfully")
    
    except Exception as e:
        db.rollback()
        return send_response(500, "An error occurred while deleting the learning path.", data={"error": str(e)})