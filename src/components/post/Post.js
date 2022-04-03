import React, { useState, useEffect, useContext } from "react";
import { AiFillHeart as Liked } from "react-icons/ai";
import { AiOutlineHeart as NotLiked } from "react-icons/ai";
import { AiOutlineMessage as CommentIcon } from "react-icons/ai";
import { BsBoxArrowDown as DownArrow, BsBoxArrowInUp as UpArrow } from "react-icons/bs";
import { Link, Redirect } from "react-router-dom";
import { Authenticator } from "../Auth/Auth";
import "./post.css";

const Post = ({Data}) => {
    const [hasLiked, setLiked] = useState(false);
    const [hasReadMore,setHasReadMore] = useState(false);
    const [ReadMore, setReadMore] = useState(false);
    const [toNavigate, setNavigate] = useState(false);   
    const { LoggedOut } = useContext(Authenticator);

    const LikeStateChanged = () => {
        if(LoggedOut===true){
            setNavigate(true);
        }else{
            const payload = {
            "author_id": window.localStorage.getItem("AuthorID"),
            "post_id": Data.post_id,
            }
            fetch("https://hackathoniitp.herokuapp.com/posts/like",{
                method: "POST",
                headers:{
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem("AccessToken"),
                },
                body: JSON.stringify(payload)
            })
            setLiked(!hasLiked);
        }
    }

    useEffect(()=>{
        if(Data.liked_by && Data.liked_by.includes(window.localStorage.getItem("AuthorID"))){
            setLiked(true);
        }
        if(Data.body && Data.body.length >= 1500){
            setHasReadMore(true);
        }
    },[]);

    const ReadStateChange = () => {
        setReadMore(!ReadMore);
    };

    const LikeIconConfig = {
        "onClick": LikeStateChanged,
        "color": "#61dafb",
        "size": "1.5em",
        "cursor": "Pointer",
    }

    const CommentIconConfig = {
        "color": "#61dafb",
        "size": "1.5em",
        "cursor": "Pointer",
        "className": "post-icon",
    }

    return(
        <>
        {toNavigate===true && <Redirect to="/login"/>}
        <div className="post-card">
            <div className="like-section">
                {hasLiked ? <Liked {...LikeIconConfig}/> : <NotLiked {...LikeIconConfig}/>}
                {<p className="post-counters">{Data.liked_by ? Data.liked_by.length : 0}</p>}
                <Link to={`/post/${Data.post_id}`} children={<CommentIcon {...CommentIconConfig}/>}/>
                {<p className="post-counters">{Data.comments ? Data.comments.length : 0}</p>}
            </div>
            <div className="post-head">
                <Link to={`/profile/${Data.author_id}`} style={{ textDecoration: 'none', color: "#61dafb", width:"fit-content" }} children={
                    <div className="author-name">{Data.author}</div>
                }/>
                <div className="post-date">{Data.date}</div>
            </div> 
            <div className="post-body">
                {Data.image && <img src={Data.image} alt="IDK"/>}
                {Data.body && <p className="post-body-text">{
                    Data.body.split("<br/>").map((text,index) => {
                        if(hasReadMore===true){
                            if(ReadMore===true)return <><p>{text}</p><br/></>;
                            else{
                                if(index >= 1)return null;
                                else return <><p>{text}</p><br/></>
                            }
                        }else return <><p>{text}</p><br/></>;
                        // return <p>{text}</p>;
                    })
                }</p>}
                {hasReadMore===true && (
                    <p onClick={ReadStateChange} className="post-readmore">{
                        ReadMore ? <UpArrow /> : <DownArrow />
                    }</p>
                )}
                <div className="post-body-tags">{
                    Data.tags && Data.tags.map((tag,index) => {
                        return <p className="post-tag">{"#" + tag.toLowerCase()}</p>
                    })
                }</div>
            </div>
        </div>
        </>
    );
};

export default Post;