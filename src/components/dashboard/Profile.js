import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

const Profile = () => {
    const { id } = useParams();
    return (
        <>
        <Navbar/>
        {id}
        </>
    );
};

export default Profile;