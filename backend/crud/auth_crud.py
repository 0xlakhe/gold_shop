from sqlalchemy.orm import Session
from models.models import User
from models.schemas import UserRegister, UserLogin
from auth import hash_password, verify_password, create_token


def createUser(db: Session, user: UserRegister):

    db_user = db.query(User).filter(User.username == user.username).first()
    db_email = db.query(User).filter(User.email == user.email).first()

    if db_user:
        return "USERNAME_EXISTS"
    if db_email:
        return "EMAIL_EXISTS"

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "status": "created successfully",
        "username": new_user.username,
        "email": new_user.email,
    }


def loginUser(db: Session, user: UserLogin):
    db_user = (
        db.query(User)
        .filter((User.email == user.identifier) | (User.username == user.identifier))
        .first()
    )

    if db_user is None:
        return "INVALID_CREDENTIALS"

    check_password = verify_password(user.password, db_user.hashed_password)

    if not check_password:
        return "INVALID_PASSWORD"

    return {
        "access_token": create_token({"user_id": db_user.id}),
        "token_type": "bearer",
    }
