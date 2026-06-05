from fastapi import APIRouter, HTTPException, Depends, status
from sqlalchemy.orm import Session
from models.schemas import UserRegister, UserLogin, Token
from models.models import User
from database import get_db
from auth import hash_password, verify_password, create_token
from crud.auth_crud import createUser, loginUser

auth_router = APIRouter()

@auth_router.post("/register")
def c_user(user: UserRegister, db: Session = Depends(get_db)):
    new_user = createUser(db, user)

    if new_user == "USERNAME_EXISTS":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="username already exists"
        )
    if new_user == "EMAIL_EXISTS":
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="email already exists"
        )

    return new_user


@auth_router.post("/login", response_model=Token)
def l_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = loginUser(db,user)

    if (db_user =="INVALID_CREDENTIALS" )| (db_user=="INVALID_PASSWORD"):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return db_user
