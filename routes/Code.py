from fastapi import Depends, APIRouter, HTTPException, status
import uuid
from datetime import date
import database
from routes import oauth2
from schemas import (Del_code, Inc_code, Code, Code_dash, User)


router = APIRouter(tags=["Code"], prefix="/code")

# CREATING A new code


@ router.post('/create', status_code=201)
def create_Code(Inc_code: Inc_code, current_user: User = Depends(oauth2.get_current_user)):

    try:

        cursor = database.user_col.find_one({"author_id": Inc_code.author_id})

        if cursor:

            # providing unique id to every post to track
            new_article_id = str(uuid.uuid4())

            # using schema to convert the incoming data
            coded = Code(
                author=Inc_code.author,
                body=Inc_code.body, author_id=Inc_code.author_id, date=str(date.today()), code_id=new_article_id, title=Inc_code.title)

            # converting the basemodel to dic as mongo stores it
            res = database.code.insert_one(dict(coded))

            # if the insertion is aborted or was unsuccessful it returns a http conflict
            if not res:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)

            prev_posts = cursor['code_id']
            prev_posts.append(new_article_id)

            myquery = {"author_id": Inc_code.author_id}

            newvalues = {"$set": {"code_id": prev_posts}}

            updated = database.user_col.update_one(myquery, newvalues)

            if not updated:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

# getting all the code by a particular user


@ router.get('/usersCode/{id}', status_code=200)
def get_userCode(id):

    try:
        code_by_user = []
        cursor = database.code.find(
            {"author_id": id}).sort("_id", -1)
        if cursor:
            for res in cursor:
                code_by_user.append(
                    Code_dash(code_id=res['code_id'], code_title=res['title']))

        return code_by_user

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

# get code by id


@ router.get('/{id}', status_code=200)
def get_code(id):

    try:
        cursor = database.code.find_one({"code_id": id})
        if cursor:
            return Code(**cursor)
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

# delete code


@router.post('/delete', status_code=200)
def delete_code(Del_post: Del_code, current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor1 = database.user_col.find_one(
            {'author_id': Del_post.author_id, 'code_id': Del_post.code_id})
        if not cursor1:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        cursor = database.code.delete_one({"code_id": Del_post.code_id})

        updt = cursor1['code_id']
        updt.remove(Del_post.code_id)

        myquery = {"author_id": Del_post.author_id}
        newvalues = {"$set": {"code_id": updt}}

        database.user_col.update_one(myquery, newvalues)

    except:

        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
