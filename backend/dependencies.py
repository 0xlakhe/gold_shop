from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from database import get_db
from auth import decode_token
from models.models import User

security = HTTPBearer()


def get_current_user(db:Session=(Depends(get_db)),credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = decode_token(token)
        user_id= payload["user_id"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    
    db_user=db.query(User).filter(User.id==user_id).first()

    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user