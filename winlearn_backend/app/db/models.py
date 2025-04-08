from sqlalchemy import Column, Integer, String, Date, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import date

Base = declarative_base()

class Users(Base):
    __tablename__ = "Users"

    User_ID = Column(Integer, primary_key=True, index=True)
    Name = Column(String, nullable=False)
    Email = Column(String, nullable=False, unique=True)
    Stream_ID = Column(Integer, ForeignKey("Streams.Stream_ID", ondelete="SET NULL"), nullable=True)
    Designation_ID = Column(Integer, ForeignKey("Designations.Designation_ID", ondelete="SET NULL"), nullable=True)
    Manager_ID = Column(Integer, ForeignKey("Users.User_ID", ondelete="SET NULL"), nullable=True)
    Is_LD_Admin = Column(Boolean, nullable=False, default=False)
    Is_Manager = Column(Boolean, nullable=False, default=False)
    Last_Login_Date = Column(Date, nullable=True)
    Password_Hash = Column(String, nullable=False)

    # Relationships
    created_learning_paths = relationship("LearningPaths", back_populates="creator", cascade="all, delete-orphan")
    stream = relationship("Streams", back_populates="users")
    designation = relationship("Designations", back_populates="users")
    manager = relationship("Users", remote_side=[User_ID], backref="subordinates")
    assigned_courses = relationship("UserAssignedCourses", back_populates="user", cascade="all, delete-orphan")

class LearningPaths(Base):
    __tablename__ = "Learning_Paths"

    Learning_Path_ID = Column(Integer, primary_key=True, index=True)
    Creator_Admin_ID = Column(Integer, ForeignKey("Users.User_ID", ondelete="CASCADE"), nullable=False)
    Path_Name = Column(String, nullable=False)
    Path_Description = Column(String, nullable=True)
    Path_Category = Column(String, nullable=True)
    Due_Days = Column(Integer, nullable=True)
    Created_Date = Column(Date, nullable=False, default=date.today)
    Is_Active = Column(Boolean, nullable=False, default=True)

    # Relationships
    creator = relationship("Users", back_populates="created_learning_paths")
    courses = relationship("Courses", back_populates="learning_path", cascade="all, delete-orphan")
    assigned_users = relationship("UserAssignedCourses", back_populates="learning_path", cascade="all, delete-orphan")

class Courses(Base):
    __tablename__ = "Courses"

    Course_ID = Column(Integer, primary_key=True, index=True, autoincrement=True)
    Learning_Path_ID = Column(Integer, ForeignKey("Learning_Paths.Learning_Path_ID", ondelete="CASCADE"), nullable=False)
    Course_Name = Column(String(255), nullable=False)
    Course_URL = Column(String(2083), nullable=False)

    # Relationships
    learning_path = relationship("LearningPaths", back_populates="courses")
    assigned_users = relationship("UserAssignedCourses", back_populates="course", cascade="all, delete-orphan")
    questions = relationship("Questions", back_populates="course")

class Questions(Base):
    __tablename__ = "Questions"

    Question_ID = Column(Integer, primary_key=True, autoincrement=True)
    Course_ID = Column(Integer, ForeignKey("Courses.Course_ID"), nullable=False)
    Question_Text = Column(String, nullable=False)

    # Relationships
    course = relationship("Courses", back_populates="questions")
    options = relationship("Options", back_populates="question")

class Options(Base):
    __tablename__ = "Options"

    Option_ID = Column(Integer, primary_key=True, autoincrement=True)
    Question_ID = Column(Integer, ForeignKey("Questions.Question_ID"), nullable=False)
    Option_Text = Column(String, nullable=False)
    Is_Correct = Column(Boolean, nullable=False, default=False)

    # Relationships
    question = relationship("Questions", back_populates="options")

class Streams(Base):
    __tablename__ = "Streams"

    Stream_ID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Stream_Name = Column(String(255), nullable=False, unique=True)

    # Relationships
    users = relationship("Users", back_populates="stream", cascade="all, delete-orphan")

class Designations(Base):
    __tablename__ = "Designations"

    Designation_ID = Column(Integer, primary_key=True, autoincrement=True, index=True)
    Designation_Name = Column(String(255), nullable=False, unique=True)

    # Relationships
    users = relationship("Users", back_populates="designation", cascade="all, delete-orphan")

class UserAssignedCourses(Base):
    __tablename__ = "User_Assigned_Courses"

    User_Course_ID = Column(Integer, primary_key=True, autoincrement=True)
    User_ID = Column(Integer, ForeignKey("Users.User_ID", ondelete="CASCADE"), nullable=False)
    Learning_Path_ID = Column(Integer, ForeignKey("Learning_Paths.Learning_Path_ID", ondelete="CASCADE"), nullable=False)
    Course_ID = Column(Integer, ForeignKey("Courses.Course_ID", ondelete="CASCADE"), nullable=False)
    Assigned_Date = Column(Date, nullable=False, default=date.today)
    Due_Date = Column(Date, nullable=True)
    Latest_Score = Column(Integer, nullable=True)
    Is_Completed = Column(Boolean, nullable=False, default=False)
    Completion_Date = Column(Date, nullable=True)

    # Relationships
    user = relationship("Users", back_populates="assigned_courses")
    learning_path = relationship("LearningPaths", back_populates="assigned_users")
    course = relationship("Courses", back_populates="assigned_users")
    attempts = relationship("UserAssessmentAttempts", back_populates="user_course")

    # Unique constraint to prevent duplicate course assignments
    __table_args__ = (
        UniqueConstraint('User_ID', 'Course_ID', name='uq_user_course'),
    )

class UserAssessmentAttempts(Base):
    __tablename__ = "User_Assessment_Attempts"

    User_Attempt_ID = Column(Integer, primary_key=True, autoincrement=True)
    User_Course_ID = Column(Integer, ForeignKey("User_Assigned_Courses.User_Course_ID"), nullable=False)
    Score = Column(Integer, nullable=False)
    Attempt_Date = Column(Date, nullable=False)

    # Relationships
    user_course = relationship("UserAssignedCourses", back_populates="attempts")