from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import (Posts, Users, Login, Code)

app = FastAPI()

origins = ['*']

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(Users.router)
app.include_router(Posts.router)
app.include_router(Login.router)
app.include_router(Code.router)
