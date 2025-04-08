from pydantic import BaseModel
from datetime import date

# Course Schemas
class CourseBase(BaseModel):
    Learning_Path_ID: int | None = None
    Course_Name: str
    Course_URL: str | None = None

class CourseCreate(CourseBase):
    pass

class CourseResponse(CourseBase):
    Course_ID: int

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    Name: str
    Email: str
    Stream_ID: int | None = None  # Optional field
    Designation_ID: int | None = None  # Optional field
    Manager_ID: int | None = None  # Optional field
    Is_LD_Admin: bool
    Is_Manager: bool
    Last_Login_Date: date | None = None  # Optional field
    Password_Hash: str

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    User_ID: int

    class Config:
        from_attributes = True

# Learning Path Schemas
class LearningPathBase(BaseModel):
    Creator_Admin_ID: int
    Path_Name: str
    Path_Description: str | None = None
    Path_Category: str | None = None
    Due_Days: int | None = None
    Created_Date: date | None = None
    Is_Active: bool | None = True
    
class LearningPathCreate(LearningPathBase):
    pass

class LearningPathResponse(LearningPathBase):
    Learning_Path_ID: int

    class Config:
        from_attributes = True

# Streams Schema
class StreamBase(BaseModel):
    Stream_Name: str

class StreamResponse(StreamBase):
    Stream_ID: int

    class Config:
        from_attributes = True

# Designations Schema
class DesignationBase(BaseModel):
    Designation_Name: str

class DesignationResponse(DesignationBase):
    Designation_ID: int

    class Config:
        from_attributes = True

# User Assigned Paths Schema
class UserAssignedPathsBase(BaseModel):
    User_ID: int
    Learning_Path_ID: int
    Assigned_Date: date
    Due_Date: date
    Current_Status: str
    Progress: int
    Is_Completed: bool
    Completion_Date: date | None = None

class UserAssignedPathsCreate(UserAssignedPathsBase):
    pass

class UserAssignedPathsResponse(UserAssignedPathsBase):
    User_Path_ID: int

    class Config:
        from_attributes = True

# User Assigned Courses Schema
class UserAssignedCoursesBase(BaseModel):
    User_ID: int
    Learning_Path_ID: int
    Course_ID: int
    Latest_Score: int | None = None
    Is_Completed: bool
    Completion_Date: date | None = None

class UserAssignedCoursesCreate(UserAssignedCoursesBase):
    pass

class UserAssignedCoursesResponse(UserAssignedCoursesBase):
    User_Course_ID: int

    class Config:
        from_attributes = True
