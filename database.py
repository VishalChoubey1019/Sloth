# mongoDB driver
from pymongo import MongoClient
import os

# connection between mongodb and database.py
client = MongoClient(os.environ.get('mongoClient'))

database = client.code

user_col = database.users

posts = database.posts

code = database.code

unverified_user = database.unverified
