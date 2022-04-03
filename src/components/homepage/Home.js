import React,{ useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import Post from "../post/Post";
import "./home.css";

const Home = () => {
    const [Loading, setLoading] = useState(true);
    const [Data, setData] = useState([]);

    useEffect(() => {
        fetch("https://hackathoniitp.herokuapp.com/posts/?limit=20")
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            setData(res);
            setLoading(false);
        }).catch((e) => {console.log(e)});
    },[]);

    console.log(Data);

    return(
        <>
        <Navbar/>
        <div className="home-component">
            <div className="post-flow">
                {Loading ? "Loading" : (
                    Data.map((item,index) => {
                        return <Post Data={item} key={index} />
                    })
                )}
            </div>
        </div>
        </>
    );
};

export default Home;