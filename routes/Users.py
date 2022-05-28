from fastapi import Depends, APIRouter, HTTPException, status
import database
import uuid
from schemas import (BioUpdate, IntervalToken_inc, IntervalToken_ret,Pre_userdata, ResLogin, User, User_data, Userdash, Userincdash)
import email_verification
import hashing
from routes import Token, oauth2


router = APIRouter(tags=["Users"], prefix="/users")


@router.post('/create', status_code=201)
def create_user(inc_user: User):

    try:
        etoken = Token.create_email_token(data={"sub": inc_user.email})

        Users = Pre_userdata(author=inc_user.author, password=hashing.hash_pass(
            inc_user.password), email=inc_user.email, author_id=str(uuid.uuid4()), email_token=etoken, author_bio="", github_link="", linkedIn="", leetCode="")

        cursor2 = database.user_col.find_one({"email": inc_user.email})
        if cursor2:
            raise HTTPException(status_code=status.HTTP_409_CONFLICT)

        else:
            cursor1 = database.unverified_user.find_one(
                {"email": inc_user.email})
            if cursor1:
                cursor3 = database.unverified_user.delete_one(
                    {"email": inc_user.email})

            res = database.unverified_user.insert_one(dict(Users))
            email_verification.email(inc_user.email)
            if not res:
                raise HTTPException(status_code=status.HTTP_409_CONFLICT)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.get("/email_verification/{token}", status_code=200)
def verify_user_email(token: str):
    # try:
    cursor = database.unverified_user.find_one({"email_token": token})
    isValid = Token.verify_email_token(token)

    if not cursor or isValid:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)

    User = User_data(
        author=cursor['author'],
        email=cursor['email'],
        password=cursor['password'],
        author_id=cursor['author_id'],
        posts=[],
        code_id=[],
        author_bio=cursor['author_bio'],
        github_link=cursor['github_link'],
        linkedIn=cursor['linkedIn'],
        leetCode=cursor['leetCode'],
    )

    res = database.user_col.insert_one(dict(User))

    if not res:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    dele = database.unverified_user.delete_one({"email": cursor["email"]})
    if not dele:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

    raise HTTPException(status_code=status.HTTP_201_CREATED)

    # except:
    #     raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post("/user_verification", status_code=200)
def verify_user_token(rtoken: IntervalToken_inc):
    try:
        token = Token.verify_token_at_call(rtoken.refresh_token)
        if token == None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        return IntervalToken_ret(access_token=token)

    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)


@router.post('/userDetails', status_code=201)
def userDetails(user_details:Userincdash):
    try:
        cursor  = database.user_col.find_one({"author_id":user_details.author_id})
        if not cursor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        payload = Token.getPayloadDash(user_details.access_token)
        if payload == None or payload['author_id'] != user_details.author_id:
            cursor['is_user']=False
        else:
            cursor['is_user']=True

        userinfo = Userdash(**cursor)
        return userinfo
        
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)

@router.post('/updateBio', status_code=201)
def UpdateBio(user_details:BioUpdate,current_user: User = Depends(oauth2.get_current_user)):
    try:
        cursor  = database.user_col.find_one({"author_id":user_details.author_id})
        if not cursor:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND)
        
        payload = Token.getPayloadDash(user_details.access_token)

        if payload == None or payload['author_id'] != user_details.author_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED)

        myquery = {"author_id": user_details.author_id}
        newvalues = {"$set": {
            "author_bio":user_details.author_bio,
            "github_link":user_details.github_link,
            "linkedIn":user_details.linkedIn,
            "leetCode":user_details.leetCode,
            }
        }
        updated = database.user_col.update_one(myquery, newvalues)
        
    except:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR)