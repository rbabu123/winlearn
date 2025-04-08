from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session, aliased, joinedload
from sqlalchemy import outerjoin, Integer, cast
from app.db import models
from app.config import database
from app.helpers.utils import send_response
from pydantic import BaseModel
from typing import List
from datetime import datetime, timedelta, timezone
import pytz
from sqlalchemy.sql.expression import func
import random
from app.helpers.smtp import send_path_completion_email, send_email, EmailRequest

router = APIRouter()

class Answer(BaseModel):
    Question_ID: int
    Selected_Option_ID: int

class SubmissionRequest(BaseModel):
    User_ID: int
    Course_ID: int
    Answers: List[Answer] 

@router.get("/fetch_questions/{course_id}")
def fetch_questions(course_id: int, db: Session = Depends(database.get_db)):
    try:
        course_exists = db.query(models.Courses.Course_ID).filter(models.Courses.Course_ID == course_id).first()
        if not course_exists:
            return send_response(404, "Course Not Found")

        # Fetch 10 random questions for the given course
        questions_query = (
            db.query(models.Questions.Question_ID, models.Questions.Question_Text)
            .filter(models.Questions.Course_ID == course_id)
            .order_by(func.newid())
            .limit(10)
            .all()
        )

        if not questions_query:
            return send_response(404, "Questions Not Found")

        question_ids = [q.Question_ID for q in questions_query]

        # Fetch options for the selected questions
        options_query = (
            db.query(models.Options.Option_ID, models.Options.Option_Text, models.Options.Question_ID)
            .filter(models.Options.Question_ID.in_(question_ids))
            .all()
        )

        # Organize data
        options_map = {}
        for option_id, option_text, question_id in options_query:
            if question_id not in options_map:
                options_map[question_id] = []
            options_map[question_id].append({"Option_ID": option_id, "Option_Text": option_text})

        # Shuffle options for each question
        for opts in options_map.values():
            random.shuffle(opts)

        # Construct response
        assessment = []
        for question_id, question_text in questions_query:
            assessment.append({
                "Question_ID": question_id,
                "Question_Text": question_text,
                "Options": options_map.get(question_id, [])  # Default to empty list if no options found
            })

        return send_response(200, "Successfully fetched questions", data={"Assessment": assessment})

    except Exception as e:
        return send_response(500, "An error occurred while fetching questions. Try again.", data={"error": str(e)})


@router.post("/evaluate_answers")
async def evaluate_answers(submission: SubmissionRequest, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    """Evaluates user answers, updates User_Assigned_Courses, and logs attempts."""
    
    try:
        # Validate user_id and course_id as integers
        if not isinstance(submission.User_ID, int) or not isinstance(submission.Course_ID, int):
            return send_response(500, "Invalid User_Id or Course_ID")

        user_id = submission.User_ID
        course_id = submission.Course_ID

        # Fetch User_Assigned_Courses record
        user_course = db.query(models.UserAssignedCourses).filter(
            models.UserAssignedCourses.User_ID == user_id,
            models.UserAssignedCourses.Course_ID == course_id
        ).first()

        if not user_course:
            return send_response(500, "User is not assigned to the Course")

        total_questions = len(submission.Answers)
        correct_answers = 0
        response_data = []

        for answer in submission.Answers:
            question_id = answer.Question_ID
            selected_option_id = answer.Selected_Option_ID

            # Fetch question and options
            question = db.query(models.Questions).filter(models.Questions.Question_ID == question_id).first()
            options_query = db.query(models.Options).filter(models.Options.Question_ID == question_id).all()

            if not question or not options_query:
                continue

            # Get correct option
            correct_option = next((opt for opt in options_query if opt.Is_Correct), None)

            # Determine if the answer is correct
            is_correct = selected_option_id == correct_option.Option_ID if correct_option else False
            if is_correct:
                correct_answers += 1

            # Prepare options dictionary
            options_dict = {
                opt.Option_ID: {
                    "Text": opt.Option_Text,
                    "Is_Selected": opt.Option_ID == selected_option_id,
                    "Is_Correct": opt.Is_Correct
                }
                for opt in options_query
            }

            # Prepare structured response
            response_data.append({
                "Question_ID": question_id,
                "Question": question.Question_Text,
                "Selected_Option_ID": selected_option_id,
                "Correct_Option_ID": correct_option.Option_ID if correct_option else None,
                "Is_Correct": is_correct,
                "Options": options_dict
            })

        # Calculate Score Percentage
        score_percentage = int((correct_answers / total_questions) * 100 if total_questions > 0 else 0)

        # Update User_Assigned_Courses
        if (user_course.Latest_Score is None) or (score_percentage > int(user_course.Latest_Score)):
            user_course.Latest_Score = score_percentage
        if (not user_course.Is_Completed) and (score_percentage > 70):
            user_course.Is_Completed = True
            user_course.Completion_Date = datetime.now(timezone.utc)

        db.commit() 

        # Insert a new record in User_Assessment_Attempts
        new_attempt = models.UserAssessmentAttempts(
            User_Course_ID=user_course.User_Course_ID,
            Score=score_percentage,
            Attempt_Date=datetime.now(timezone.utc)
        )

        db.add(new_attempt)
        db.commit()
        
        result = db.query(
            func.count(models.UserAssignedCourses.Course_ID).label("total_courses"),
            func.sum(cast(models.UserAssignedCourses.Is_Completed, Integer)).label("completed_courses")
        ).filter(
            models.UserAssignedCourses.User_ID == user_id,
            models.UserAssignedCourses.Learning_Path_ID == user_course.Learning_Path_ID
        ).first()

        total_courses = result.total_courses or 0
        completed_courses = result.completed_courses or 0
        
        if total_courses > 0 and total_courses == completed_courses:
            background_tasks.add_task(send_path_completion_email, user_id, user_course.Learning_Path_ID, db)

        return send_response(
            200,
            "Answers Evaluated Successfully",
            data={
                "Total_Questions": total_questions,
                "Score": correct_answers,
                "Score_Percentage": score_percentage,
                "Answers": response_data
            }
        )

    except Exception as e:
        db.rollback()
        return send_response(500, "An error occurred while evaluating answers.", data = {"error": str(e)})
    

@router.get("/fetch_streams")
def fetch_streams(db: Session = Depends(database.get_db)):
    streams = db.query(models.Streams).all()
    response = [stream.Stream_Name for stream in streams]
    
    return send_response(200, "Streams fetched successfully", data={"Streams": response})


@router.post("/send_overdue_course_email")
async def send_overdue_course_email(db: Session = Depends(database.get_db)):
    """Send overdue course reminder emails to users."""
    
    try:
        # Get current date in IST
        ist = pytz.timezone("Asia/Kolkata")
        today = datetime.now(ist).date()
        due_threshold = today + timedelta(days=2)

        # Fetch overdue courses
        overdue_courses = db.query(models.UserAssignedCourses).outerjoin(models.Courses).options(
            joinedload(models.UserAssignedCourses.course)
        ).filter(
            models.UserAssignedCourses.Is_Completed == False,
            models.UserAssignedCourses.Due_Date <= due_threshold
        ).all()

        if not overdue_courses:
            return {"message": "No overdue courses found."}

        # Group courses by user
        user_courses = {}
        for course in overdue_courses:
            if course.User_ID not in user_courses:
                user_courses[course.User_ID] = []
            user_courses[course.User_ID].append(course)

        # Send email to each user with their overdue courses
        for user_id, courses in user_courses.items():
            user = db.query(models.Users).filter(models.Users.User_ID == user_id).first()
            if not user:
                continue

            subject = "Reminder: Overdue Courses in your WinLearn Portal"
            email_body = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; }}
                    table {{ width: 100%; border-collapse: collapse; margin-top: 10px; }}
                    th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
                    th {{ background-color: #f2f2f2; }}
                    a {{ color: #007bff; text-decoration: none; }}
                </style>
            </head>
            <body>
                <p>Hi {user.Name},</p>
                <p>You have the following courses overdue or due soon:</p>

                <table>
                    <tr>
                        <th>Course Name</th>
                        <th>Course URL</th>
                        <th>Due Date</th>
                    </tr>
                    {''.join([
                        f"<tr><td>{course.course.Course_Name if course.course else 'Unknown Course'}</td>"
                        f"<td><a href='{course.course.Course_URL if course.course else '#'}' target='_blank'>{course.course.Course_URL if course.course else 'No URL Available'}</a></td>"
                        f"<td>{course.Due_Date.strftime('%Y-%m-%d')}</td></tr>"
                        for course in courses
                    ])}
                </table>

                <p>Please complete them as soon as possible.</p>

                <p>Best Regards,<br>WinLearn Team</p>
            </body>
            </html>
            """
            await send_email(EmailRequest(to_email=user.Email, subject=subject, message=email_body))

        return {"message": "Overdue course emails sent successfully"}

    except Exception as e:
        return {"error": f"An error occurred: {str(e)}"}