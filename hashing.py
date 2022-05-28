
from passlib.context import CryptContext

pwd_cxt = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_pass(password: str):
    return pwd_cxt.hash(password)


def verify_pass(info_pass, hashed_pass):
    return pwd_cxt.verify(info_pass, hashed_pass)
