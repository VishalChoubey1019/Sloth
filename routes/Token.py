from jose import JWTError, jwt
from datetime import datetime, timedelta
import schemas
import database
import os


ACCESS_TOKEN_SECRET_KEY = os.environ.get('atoken')
REFRESH_TOKEN_SECRET_KEY = os.environ.get('rtoken')
EMAIL_TOKEN_SECRET_KEY = os.environ.get('etoken')
ALGORITHM = os.environ.get('algo')


def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=30)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, ACCESS_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_refresh_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=20)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, REFRESH_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def create_email_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=2)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode, EMAIL_TOKEN_SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def verify_token(token: str, credentials_exception):
    try:
        payload = jwt.decode(
            token, ACCESS_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")

        cursor = database.user_col.find_one({"email": email})

        if email is None or not cursor:
            raise credentials_exception

        return schemas.TokenData(email=email)

    except jwt.ExpiredSignatureError:
        return True

    except JWTError:
        raise credentials_exception


def verify_token_at_call(token: str):
    try:
        payload = jwt.decode(
            token, REFRESH_TOKEN_SECRET_KEY, algorithms=ALGORITHM)

        email: str = payload.get("sub")

        cursor = database.user_col.find_one({"email": email})

        if not cursor:
            return None

        return create_access_token(data={"sub": email})

    except JWTError:
        return None
