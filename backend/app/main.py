import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from .dependencies import get_current_user
from .routers.auth import router as auth_router
from .routers.connections import router as socket_router


load_dotenv()
app = FastAPI()

# Include the authentication router
app.include_router(auth_router)
app.include_router(socket_router)

# Determine the environment; default to 'development' if not set
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# CORS settings for development and production
if ENVIRONMENT == "development":
    origins = [
        "http://localhost:5173",  # Development frontend server
    ]
else:  # Production settings
    origins = [
        "https://yourproductionfrontend.com",  # Replace with your production frontend URL
    ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/protected")
def read_protected(username: str = Depends(get_current_user)):
    return {"Hello": username}
