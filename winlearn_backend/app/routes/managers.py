from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import models
from app.config import database
from app.helpers.utils import send_response, serialize_user
from app.helpers.security import get_user_id_from_token
from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session
from app.db import models
from pydantic import BaseModel
from app.routes.users import fetch_user_learning_paths

router = APIRouter()

@router.get("/dashboard/{user_id}")
def get_manager_dashboard(user_id: int, db: Session = Depends(database.get_db)):
    """Returns dashboard of a manager."""
    try:
        # if user_id is not a valid user ID, return unauthorized access
        if not isinstance(user_id, int):
            return send_response(401, "Unauthorized access")
        
        users = db.query(
            models.Users,
            models.Designations.Designation_Name.label("Designation"),
            models.Streams.Stream_Name.label("Stream"),
        ).outerjoin(models.Designations, models.Users.Designation_ID == models.Designations.Designation_ID)\
        .outerjoin(models.Streams, models.Users.Stream_ID == models.Streams.Stream_ID)\
        .with_entities(models.Users, models.Designations.Designation_Name, models.Streams.Stream_Name)\
        .filter(models.Users.Manager_ID == user_id).all()

        users_list = []
        for user, designation, stream in users:
            user_data = serialize_user(user)
            user_data["Designation"] = designation 
            user_data["Stream"] = stream 
            user_data.pop("Password_Hash", None)
            user_data.pop("Designation_ID", None)
            user_data.pop("Stream_ID", None)
            user_data.pop("Manager_ID", None)
            user_data.pop("Is_LD_Admin", None)
            user_data.pop("Is_Manager", None)
            user_data["Learning_Paths"] = fetch_user_learning_paths(user_id=user.User_ID, db=db)
            users_list.append(user_data)
        return send_response(200, "Dashboard Data fetched successfully", data={"Reportees": users_list})
    except Exception as e:
        return send_response(500, "An Error Occured", data={"Error": str(e)})
