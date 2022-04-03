import React, { useEffect, useState, useRef, useContext } from "react";
import Navbar from "../Navbar/Navbar";
import { useParams, Link, Redirect } from "react-router-dom";
import Post from "../post/Post";
import { Authenticator } from "../Auth/Auth";
import "./singlepost.css";

const Singlepost = () => {
    const { id } = useParams();
    const [Loading, setLoading] = useState(true);
    const [Data, setData] = useState({});
    const Comment_Text = useRef(null);
    const [toNavigate, setNavigate] = useState(false);

    const {LoggedOut} = useContext(Authenticator);

    useEffect(() => {
        fetch(`https://hackathoniitp.herokuapp.com/posts/${id}`)
        .then((res) => res.json())
        .then((res) => setData(res))
        .catch((e) => console.log(e));
        setLoading(false);
    },[id]);

    const HandlePost = () => {
        if(LoggedOut===true){
            setNavigate(true);
        }else{
            console.log("Handle Post");
            const payload = {
                "author_id": window.localStorage.getItem("AuthorID"),
                "post_id": Data.post_id,
                "author": window.localStorage.getItem("Author"),
                "body": Comment_Text.current.value,
            }
            fetch("https://hackathoniitp.herokuapp.com/posts/comment",{
                method: "POST",
                headers:{
                    'Content-Type': "application/json",
                    'Authorization': "Bearer " + window.localStorage.getItem("AccessToken"),
                },
                body: JSON.stringify(payload)
            })
            window.location.reload(false);
        }
    }

    return (
        <>  
            <Navbar/>
            {toNavigate===true && <Redirect to="/login"/>}
            {Loading===false && <Component Data={Data} Comment_Text={Comment_Text}
            HandlePost={HandlePost}/>}
            {Loading===true && "Loading"}
        </>
    );
};

const Component = (props) => {
    useEffect(() => {
        props.Comment_Text.current.focus();
    },[]);

    return (
        <div className="fullpost">
            <Post Data={props.Data}/>
            <div className="comment-section">
                {props.Data.comments && props.Data.comments.map((comment,index) => {
                    return <Comment {...comment} key={index}/>
                })}
            </div>
            <div className="add-comment">
                <textarea type="text" maxLength="500" placeHolder="Type your comment" ref={props.Comment_Text}/>
                <div className="comment-button" onClick={props.HandlePost}>Post</div>
            </div>
        </div>
    );
}

const Comment = (props) => {
    return(
        <div className="comment">
            <div className="comment-header">
                <Link to={`/profile/${props.author_id}`} style={{ textDecoration: "none", color: "#61dafb" }} className="comment-author" children={props.author}/>
                <div className="comment-date">{props.date}</div>
            </div>
            <div className="comment-body">{props.body}</div>
        </div>
    );
}

export default Singlepost;