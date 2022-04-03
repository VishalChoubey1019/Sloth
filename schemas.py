from typing import Optional
from pydantic import BaseModel, EmailStr, Field


class Comment_details(BaseModel):
    post_id: str = Field(...)
    author: str = Field(...)
    author_id: str = Field(...)
    body: str = Field(...)

# stored in the db


class Post(BaseModel):
    post_id: str = Field(...)
    date: str = Field(...)
    author: str = Field(...)
    author_id: str = Field(...)
    body: str = Field(...)
    tags: list[str] = []
    liked_by: list[str] = []
    comments: list[dict] = []
    image: Optional[str]
    code_link: Optional[str]

# passed from the front end from user


class Inc_post(BaseModel):
    author: str = Field(...)
    author_id: str = Field(...)
    body: str = Field(...)
    tags: list[str] = Field(None)
    image: Optional[str]
    code_link: Optional[str]

# code


class Code(BaseModel):
    code_id: str = Field(...)
    date: str = Field(...)
    author: str = Field(...)
    author_id: str = Field(...)
    title: str = Field(...)
    body: str = Field(...)

# Code to dash


class Code_dash(BaseModel):
    code_id: str = Field(...)
    code_title: str = Field(...)


# inc code
class Inc_code(BaseModel):
    author: str = Field(...)
    author_id: str = Field(...)
    title: str = Field(...)
    body: str = Field(...)


class Del_post(BaseModel):
    author_id: str = Field(...)
    post_id: str = Field(...)

# del code


class Del_code(BaseModel):
    author_id: str = Field(...)
    code_id: str = Field(...)

# stored in frontend


class User(BaseModel):
    author: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)

# before validating user


class Pre_userdata(BaseModel):
    author: str = Field(...)
    password: str = Field(...)
    email: EmailStr = Field(...)
    author_id: str = Field(...)
    author_bio: str = Field("")
    github_link: Optional[str]
    linkedIn: Optional[str]
    leetCode: Optional[str]
    email_token: str = Field(...)


# after validation of user
class User_data(BaseModel):
    author: str = Field(...)
    email: EmailStr = Field(...)
    password: str = Field(...)
    author_id: str = Field(...)
    posts: list[str] = []
    author_bio: str = Field("")
    github_link: Optional[str]
    linkedIn: Optional[str]
    leetCode: Optional[str]
    code_id: list[str] = []


# data for login from frontend

class Login(BaseModel):
    email: EmailStr = Field(...)
    password: str = Field(...)


# when the user logs in this class is used
class ResLogin(BaseModel):
    author: str
    author_id: str
    access_token: str
    refresh_token: str
    token_type: str

# verify on set interval


class IntervalToken_inc(BaseModel):
    refresh_token: str


class IntervalToken_ret(BaseModel):
    access_token: str

# used in verification of token data


class TokenData(BaseModel):
    email: Optional[str] = None


# liked
class Liked(BaseModel):
    author_id: str
    post_id: str
