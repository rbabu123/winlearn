from fastapi import Request, HTTPException
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.helpers.security import verify_token  # Your function to verify JWT token
from app.config.database import get_db  # Your DB session generator

class AuthMiddleware(BaseHTTPMiddleware):
    """Middleware to validate JWT token and attach user to request.state"""

    async def dispatch(self, request: Request, call_next):
        # Skip authentication for public routes
        print(request.url.path)
        public_paths = ["/api/auth/login", "/api/auth/register", "/docs", "/openapi.json"]
        if request.url.path in public_paths:
            return await call_next(request)

        # Extract token from the Authorization header
        auth_header = request.headers.get("Authorization")
        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(status_code=401, content={"detail": "Missing or invalid token"})

        token = auth_header.split(" ")[1]  # Extract the token after "Bearer "
        print(token)
        try:
            # Get DB session
            db: Session = next(get_db())

            # Verify and decode token
            user = verify_token(token, db)
            print(user)
            if not user:
                return JSONResponse(status_code=401, content={"detail": "Invalid or expired token"})

            # Attach authenticated user to request
            request.state.user = user

        except JWTError:
            return JSONResponse(status_code=401, content={"detail": "Token verification failed"})
        except Exception as e:
            return JSONResponse(status_code=500, content={"detail": f"Internal server error: {str(e)}"})

        # Proceed with the request
        response = await call_next(request)
        return response
