from fastapi import APIRouter, Depends
# from app.routes.courses import router as courses_router
from app.routes.users import router as users_router
from app.routes.auth import router as auth_router
from app.middleware.auth import AuthMiddleware
from app.routes.azure import router as azure_router
from app.routes.managers import router as managers_router
from app.routes.admins import router as admins_router
from app.routes.courses import router as courses_router

# Create a main API router
api_router = APIRouter()

# Include route modules
api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(courses_router, prefix="/courses", tags=["courses"])
api_router.include_router(users_router, prefix="/users", tags=["users"])
api_router.include_router(azure_router, prefix="/azure", tags=["azure"])
api_router.include_router(managers_router, prefix="/managers", tags=["managers"])
api_router.include_router(admins_router, prefix="/admins", tags=["admins"])