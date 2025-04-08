from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, EmailStr
import aiosmtplib
from email.message import EmailMessage
from dotenv import load_dotenv
import os
from app.db import models
from datetime import datetime, timedelta
from collections import defaultdict

load_dotenv()

SMTP_SERVER = os.getenv("SMTP_SERVER")
SMTP_PORT = os.getenv("SMTP_PORT")
SMTP_USERNAME = os.getenv("EMAIL_ADDRESS")
SMTP_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Email request model
class EmailRequest(BaseModel):
    to_email: EmailStr
    subject: str
    message: str

async def send_email(request: EmailRequest):
    # Create email message
    email = EmailMessage()
    email["From"] = SMTP_USERNAME
    email["To"] = request.to_email
    email["Subject"] = request.subject
    email.set_content(request.message, subtype="html")

    # Send email via SMTP
    try:
        await aiosmtplib.send(
            email,
            hostname=SMTP_SERVER,
            port=SMTP_PORT,
            username=SMTP_USERNAME,
            password=SMTP_PASSWORD,
            start_tls=True,  # Enables encryption
        )
        return {"message": f"Email sent successfully to {request.to_email}!"}
    except Exception as e:
        return {"message": str(e)}

async def send_path_registration_email(User_IDs, Learning_Path_ID, db):
    users = db.query(models.Users).filter(models.Users.User_ID.in_(User_IDs)).all()
    learning_path = db.query(models.LearningPaths).filter(models.LearningPaths.Learning_Path_ID == Learning_Path_ID).first()
    courses = db.query(models.Courses).filter(models.Courses.Learning_Path_ID == Learning_Path_ID).all()

    course_list = "".join([f"<tr><td>{course.Course_Name}</td><td><a href='{course.Course_URL}'>{course.Course_URL}</a></td></tr>" for course in courses])
    path_url = f"<a href='https://google.com/'>{learning_path.Path_Name} Learning Path</a>"
    due_date = datetime.today() + timedelta(days=learning_path.Due_Days)
    due_date = due_date.strftime("%Y-%m-%d")

    for user in users:
        subject = f"You have been assigned to the {learning_path.Path_Name} Learning Path"

        message = f"""
        <html>
        <body>
            <p>Hi {user.Name},</p>
            <p>You have been assigned to {path_url}.</p>
            <p>Please complete it within the designated due date: <b>{due_date}</b>.</p>
            
            <table border="1" cellpadding="5" cellspacing="0" style="border-collapse: collapse;">
                <tr>
                    <th>Course Name</th>
                    <th>Course URL</th>
                </tr>
                {course_list}
            </table>

            <p>Best Regards,<br>WinLearn Team</p>
        </body>
        </html>
        """

        email_request = EmailRequest(to_email=user.Email, subject=subject, message=message)
        response = await send_email(email_request)
        print(response)

async def send_path_completion_email(User_ID, Learning_Path_ID, db):
    user = db.query(models.Users).filter(models.Users.User_ID == User_ID).first()
    learning_path = db.query(models.LearningPaths).filter(models.LearningPaths.Learning_Path_ID == Learning_Path_ID).first()
    
    subject = f"Congratulations on completing the {learning_path.Path_Name} Learning Path"

    message = f"""
    <html>
    <body>
        <p>Hi {user.Name},</p>
        <p>
        You have successfully completed the {learning_path.Path_Name} Learning Path.
        <br>
        Keep Learning.
        </p>
        <p>Best Regards,<br>WinLearn Team</p>
    </body>
    </html>
    """

    email_request = EmailRequest(to_email=user.Email, subject=subject, message=message)
    response = await send_email(email_request)
    print(response)


async def send_path_addition_failure_email(user_id, path_name, db):
    user = db.query(models.Users).filter(models.Users.User_ID == user_id).first()
    subject = f"Failure to add {path_name} Learning Path"

    message = f"""
    <html>
    <body>
        <p>Hi {user.Name},</p>
        <p>
        An error was encountered while tryig to add {path_name} Learning Path.
        <br>
        Please try again.
        </p>
        <p>Best Regards,<br>WinLearn Team</p>
    </body>
    </html>
    """
    
    email_request = EmailRequest(to_email=user.Email, subject=subject, message=message)
    response = await send_email(email_request)
    print(response)