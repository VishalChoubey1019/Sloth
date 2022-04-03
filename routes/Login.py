from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import database
import hashing
from routes import Token
from schemas import (ResLogin)


router = APIRouter(prefix="/Login", tags=['Login'])


def Create_token(email: str):
    access_token = Token.create_access_token(data={"sub": email})
    refresh_token = Token.create_refresh_token(data={"sub": email})
    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}


@router.post('/')
def login(info: OAuth2PasswordRequestForm = Depends()):

    cursor = database.user_col.find_one(
        {"email": info.username})
    if cursor:
        flag = hashing.verify_pass(info.password, cursor["password"])
        if flag == True:
            token = Create_token(info.username)
            res = ResLogin(
                author_id=cursor["author_id"], access_token=token['access_token'], token_type=token['token_type'], author=cursor['author'], refresh_token=token['refresh_token'])
            return res
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    else:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
