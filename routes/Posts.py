import uuid
from fastapi import APIRouter, Body, HTTPException, status, Depends
from datetime import date
import database
from schemas import (Comment_details, Liked,
                     Post, Inc_post, User, Del_post)
from routes import oauth2

router = APIRouter(tags=["Posts"], prefix="/posts")


# home all posts
@router.get('/', status_code=200)
def home(limit: int = 10):
    try:
        posts = []
        cursor = database.posts.find().limit(limit).sort("_id", -1)
        if cursor:
            for res in cursor:
                posts.append(Post(**res))

        return posts

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ router.post('/create', status_code=201)
def create_Post(Inc_post: Inc_post, current_user: User = Depends(oauth2.get_current_user)):

    try:

        cursor = database.user_col.find_one({"author_id": Inc_post.author_id})

        if cursor:

            # providing unique id to every post to track
            new_article_id = str(uuid.uuid4())

            # using schema to convert the incomign data
            posted = Post(author=Inc_post.author, body=Inc_post.body, author_id=Inc_post.author_id, tags=Inc_post.tags,
                          image=Inc_post.image, date=str(date.today()), post_id=new_article_id, code_link=Inc_post.code_link)

            # converting the basemodel to dic as mongo stores it
            res = database.posts.insert_one(dict(posted))

            # if the insertion is aborted or was unsuccessful it returns a http conflict
            if not res:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)

            prev_posts = cursor['posts']
            prev_posts.append(new_article_id)

            myquery = {"author_id": Inc_post.author_id}

            newvalues = {"$set": {"posts": prev_posts}}

            updated = database.user_col.update_one(myquery, newvalues)

            if not updated:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

        else:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


# post comment
@ router.post('/comment', status_code=201)
def create_comment(Inc_comment: Comment_details, current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor = database.posts.find_one({"post_id": Inc_comment.post_id})
        if not cursor:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        comment_detail = {
            "post_id": Inc_comment.post_id,
            "author": Inc_comment.author,
            "author_id": Inc_comment.author_id,
            "date": str(date.today()),
            "body": Inc_comment.body,
        }
        updt = cursor['comments']
        updt.append(comment_detail)
        myquery = {"post_id": Inc_comment.post_id}
        newvalues = {"$set": {"comments": updt}}

        database.posts.update_one(myquery, newvalues)
    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

# like


@ router.post('/like', status_code=201)
def create_comment(Inc_liked: Liked, current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor = database.posts.find_one({"post_id": Inc_liked.post_id})
        if not cursor:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)
        likes = cursor['liked_by']
        if Inc_liked.author_id in likes:
            likes.remove(Inc_liked.author_id)
        else:
            likes.append(Inc_liked.author_id)

        myquery = {"post_id": Inc_liked.post_id}
        newvalues = {"$set": {"liked_by": likes}}

        database.posts.update_one(myquery, newvalues)

    except:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)


@router.get('/tag/{tag}')
def get_tag(tag: str, limit: int = 10):
    try:
        posts = []
        cursor = database.collection.find(
            {"tags": tag}).limit(limit).sort("_id", -1)
        if cursor:
            for res in cursor:
                microblog = res["body"]
                posts.append(Post(author=res["author"], body=microblog,
                                  tags=res["tags"], image=res["image"], date=res["date"], post_id=res["id"], author_id=res["author_id"], liked_by=res["liked_by"]))

        return posts

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ router.get('/usersPost/{id}', status_code=200)
def get_userPosts(id):

    try:
        posted = []
        cursor = database.posts.find(
            {"author_id": id}).limit(10).sort("_id", -1)
        if cursor:
            for res in cursor:
                micropost = res["body"]
                posted.append(Post(**res))

        return posted

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@ router.get('/{id}', status_code=200)
def get_posts(id):

    try:
        cursor = database.posts.find_one({"post_id": id})
        if cursor:
            return Post(**cursor)
        else:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post('/delete', status_code=200)
def delete_posts(Del_post: Del_post, current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor1 = database.user_col.find_one(
            {'author_id': Del_post.author_id, 'posts': Del_post.post_id})
        if not cursor1:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        cursor = database.posts.delete_one({"post_id": Del_post.post_id})
        if not cursor:
            raise HTTPException(status_code=status.HTTP_304_NOT_MODIFIED)

        updt = cursor1['posts']
        updt.remove(Del_post.post_id)

        myquery = {"author_id": Del_post.author_id}
        newvalues = {"$set": {"post_id": updt}}

        database.user_col.update_one(myquery, newvalues)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)
