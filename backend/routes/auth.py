from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from models.schemas import UserRegister, UserLogin
from models.models import User
from database import get_db
from auth import hash_password, verify_password, create_token

auth_router = APIRouter()


@auth_router.post("/register")
def c_user(user: UserRegister, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.username == user.username).first()
    db_email = db.query(User).filter(User.email == user.email).first()

    if db_user:
        raise HTTPException(status_code=409, detail="That username exists")
    if db_email:
        raise HTTPException(status_code=409, detail="That email exists")

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "status": "created sucessfully",
        "username": new_user.username,
        "email": new_user.email,
    }


@auth_router.post("/login")
def l_user(user: UserLogin, db: Session = Depends(get_db)):
    db_user = (
        db.query(User)
        .filter((User.email == user.identifier) | (User.username == user.identifier))
        .first()
    )

    if db_user is None:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    check_password = verify_password(user.password, db_user.hashed_password)
    if not check_password:
        raise HTTPException(status_code=401, detail="Invalid credentails")

    return {
        "access_token": create_token({"user_id": db_user.id}),
        "token_type": "bearer",
    }
