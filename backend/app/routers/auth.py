from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import hashlib
import binascii
import os
from datetime import datetime, timedelta
from jose import jwt, JWTError
from pydantic import BaseModel

SECRET_KEY = "your_secret_key"
ALGORITHM = "HS256"
EXPIRE_TIME = 300

router = APIRouter(prefix="/auth", tags=["auth"])


class TokenData(BaseModel):
    username: str | None = None


# Assuming you add this within your existing login route
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except JWTError:
        raise credentials_exception
    return token_data


def hash_password(password: str, salt: str = None) -> str:
    if salt is None:
        salt = os.urandom(16)  # Generate a new salt for each password
    # Ensure salt and password are bytes
    salt_bytes = salt if isinstance(salt, bytes) else salt.encode("utf-8")
    pwd_bytes = password.encode("utf-8")
    # Hash the password with the salt
    dk = hashlib.pbkdf2_hmac("sha256", pwd_bytes, salt_bytes, 100000)
    # Return the salt and hash together
    hash_bytes = binascii.hexlify(dk)
    return (
        f"{binascii.hexlify(salt_bytes).decode('utf-8')}:{hash_bytes.decode('utf-8')}"
    )


def verify_password(salt: str, stored_hash: str, provided_password: str) -> bool:
    hash_of_provided = hash_password(provided_password, salt)
    return stored_hash == hash_of_provided


# Simulated database of users
fake_users_db = {
    "bing": {
        "username": "bing",
        "hashed_password": hash_password("bong", "billygonnabesaltywhenheseesthis"),
        "salt": "billygonnabesaltywhenheseesthis",
    },
    "billy": {
        "username": "billy",
        "hashed_password": hash_password("bong", "billygonnabesaltywhenheseesthis"),
        "salt": "billygonnabesaltywhenheseesthis",
    },
    "brian": {
        "username": "brian",
        "hashed_password": hash_password("bong", "billygonnabesaltywhenheseesthis"),
        "salt": "billygonnabesaltywhenheseesthis",
    },
}


def authenticate_user(fake_db, username: str, password: str):
    user = fake_db.get(username)
    if not user:
        return False
    if not verify_password(user["salt"], user["hashed_password"], password):
        return False
    return user


@router.post("/login")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user["username"]}, expires_delta=timedelta(minutes=EXPIRE_TIME)
    )
    expire = datetime.utcnow() + timedelta(minutes=EXPIRE_TIME)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expiration": expire.isoformat(),
    }
