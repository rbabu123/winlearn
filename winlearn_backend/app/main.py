from fastapi import FastAPI
import uvicorn
from app import db
from app.routes import api_router
from app.middleware.auth import AuthMiddleware
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.helpers.scheduler import start_scheduler, stop_scheduler

@asynccontextmanager
async def lifespan(app: FastAPI):
    start_scheduler()  # Start the scheduler when the app starts
    yield
    stop_scheduler()  # Stop the scheduler when the app shuts down


app = FastAPI(title="WinLearn Backend", lifespan=lifespan)

allowed_origins = [
    "https://example.com",
    "https://sub.example.com",
    "http://localhost:3000",  # If testing locally
    "http://127.0.0.1:3000"
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["Authorization", "Content-Type"]  # Allowed headers
)

# app.add_middleware(AuthMiddleware)
app.include_router(api_router, prefix="/api")

if __name__ == "__main__":
    uvicorn.run(app, port=8000)