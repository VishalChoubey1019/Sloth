import React, { useState, useEffect, useRef, useContext } from "react";
import Post from "../post/Post";
import "./Createpost.css";
import Navbar from "../Navbar/Navbar";
import { uploadBytesResumable, getDownloadURL, ref} from "firebase/storage";
import { Redirect } from "react-router-dom";
import { Authenticator } from "../Auth/Auth";
// import React from 'react'
import { storage } from './config';

const Dummy_template = {
    post_id: "IDK",
    date: "DD-MM-YYYY",
    author: window.localStorage.getItem("Author"),
    author_id: window.localStorage.getItem("AuthorID"),
    body: "",
    tags: [],
    liked_by: [],
    comment:[],
    image: "",
    code_link: "",
}

const Createpost = () => {
    const [Data, setData] = useState(Dummy_template);
    const [view, setview] = useState(true);
    const body = useRef(null);
    const [image, setImage] = useState(null);
    const tags = useRef(null);
    const {LoggedOut} = useContext(Authenticator);

    const HandleChange = () => {
        let newData = Dummy_template;
        newData.body = body.current.value;
        newData.tags = tags.current.value.split(" ").map((e,index)=>{
            return e.trim()
        })
        newData.image = image==null ? "" : URL.createObjectURL(image);
        setData(newData);
        setview(!view);
    }

    const HandleSubmit = () => {
        if(image){
            const imgFile = image;
            const storageRef = ref(storage, `images/${imgFile.name}`);
            const uploadTask = uploadBytesResumable(storageRef, imgFile);
            uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                },(error) => {console.log(error);},() => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    SendPost(downloadURL);
                });
            });
        }else SendPost("");
    }

    const SendPost = (imageURL) => {
        const payload = {
            "author_id": window.localStorage.getItem("AuthorID"),
            "author": window.localStorage.getItem("Author"),
            "body": body.current.value,
            "tags": tags.current.value.split(" ").map((e,index)=>{return e.trim()}),
            "image": imageURL,
        }
        console.log(payload);
        fetch("https://hackathoniitp.herokuapp.com/posts/create",{
            method: "POST",
            headers:{
                'Content-Type': "application/json",
                'Authorization': "Bearer " + window.localStorage.getItem("AccessToken"),
            },body: JSON.stringify(payload),
        })
    }

    useEffect(() => {
        // Check if user logged in
        // if So fetch Data from user
    }, [])
    
    console.log("Rerender");

    return (
        <>
        <Navbar/>
        {LoggedOut===true && <Redirect to="/login"/>}
        <div className="create-post-section">
            <Editpost HandleChange={HandleChange} HandleSubmit={HandleSubmit} body={body} tags={tags} setImage={setImage}/>
            <Previewpost Data={Data} view={view} setview={setview}/>
        </div>
        </>
    );
}

const Editpost = (props) => {
    return (
        <div className="create-section">
            <input type="file" accept="image/*" onChange={(e) => props.setImage(e.target.files[0])}/>
            <textarea type="text" className="body-input" placeHolder="Place Content Here, to seperate paragraphs use <br/> Click on Preview button to see the result " ref={props.body}/>
            <textarea type="text" className="tag-input" placeHolder="Place your tags Here, Like this Happy Coding CP" ref={props.tags}/>
            <div className="create-buttons">
                <div className="preview-button login_button" onClick={props.HandleChange}>Preview</div>
                <div className="preview-button login_button" onClick={props.HandleSubmit}>Post</div>
            </div>
            <div className="login-footer preview-foot">Double Click on Preview to render</div>
        </div>
    );
}

const Previewpost = (props) => {
    return (
        <div className="post-preview">
            {props.view===true && <Post Data={props.Data}/>}
        </div>
    );
}

export default Createpost;