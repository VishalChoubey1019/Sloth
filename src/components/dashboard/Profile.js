import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import { useState, useEffect } from "react";
import './Profile.css'

const Profile = () => {

    const { id } = useParams();
    
    const [Loading, setLoading] = useState(true);
    const [Data, setData] = useState([]);

    const [formDataBIO, toggleFormDataBIO] = React.useState(Data.author_bio)

    const [formDataLINKEDIN, toggleFormDataLINKEDIN] = React.useState(Data.linkedIn)
    const [formDataGITHUB, toggleFormDataGITHUB] = React.useState(Data.github_link)
    const [formDataLEETCODE, toggleFormDataLEETCODE] = React.useState(Data.leetCode)

    useEffect(() => {
        fetch("https://backendhackurway.herokuapp.com/users/userDetails",{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify
                (
                    {
                        access_token: window.localStorage.getItem('AccessToken') || '@f@u@c@k@', 
                        author_id: id
                    }
                )
        })
        .then((res) => res.json())
        .then((res) => {

            console.log(res);
            setData(res);
            setLoading(false);
            toggleFormDataBIO(Data.author_bio)
            toggleFormDataGITHUB(Data.github_link)
            toggleFormDataLEETCODE(Data.leetCode)
            toggleFormDataLINKEDIN(Data.linkedIn)

        }).catch((e) => {console.log(e)});
    },[id]);

    // const bio = "i have always been happy throughtout my life maybe but i dont think it'll be the same once i get into my highschool. Life will be tough. Averages don't earn the demand. Everyone likes to have that extra attention from fmaily relatives and friends. I bet the best in class usually has no problem being in touch with their relatives."


    const image = `https://avatars.dicebear.com/api/avataaars/${id}.svg`

    const [form, toggleForm] = React.useState(false)
    
    // const [formData, toggleFormData] = React.useState(false)


    const newFormData = ()=> {

        const variable = {
            access_token: window.localStorage.getItem('AccessToken') || '@f@u@c@k@', 
            author_id: id,
            author_bio: formDataBIO === undefined? Data.author_bio : formDataBIO ,
            github_link: formDataGITHUB === undefined? Data.github_link : formDataGITHUB,
            linkedIn: formDataLINKEDIN === undefined ? Data.linkedIn : formDataLINKEDIN ,
            leetCode: formDataLEETCODE === undefined ? Data.leetCode : formDataLEETCODE
        }

        console.log('lol')
        console.log(variable)
        fetch("https://backendhackurway.herokuapp.com/users/updateBio",{
                method: "POST",
                headers: { 'Content-Type': 'application/json', 
                    'Authorization': "Bearer " + window.localStorage.getItem("AccessToken") },

                body: JSON.stringify
                (
                    variable
                )
        })
        .then((res) => res.json())
        .then((res) => {
            console.log(res);
            setData(res);
            setLoading(false);
            window.location.reload()
        }).catch((e) => {console.log(e)});
    }



    
    return (
        <>
            <Navbar/>
            <div className="bruh">
                <div className="profile-card">
                        <div className="main">

                            <img className="profile-img" src = {image} alt= 'idk'/>

                            <div className="profile-text">
                                {Data.author}    
                            </div>

                            {
                                !form &&
                                <div className="profile-bio">
                                    <span className="spanc"> { Data.author_bio? 'Bio:' : null} </span> 
                                    <br/>
                                    {Data.author_bio}
                                </div>
                            }   
                            {
                                !form &&
                                <div className="link-wrapper">
                                    
                                    <a className="links"  href = {Data.linkedIn} > {Data.linkedIn? 'LinkedIn' : Data.is_user? 'Add LinkedIn' : null} </a>

                                    <a className="links" href = {Data.github_link} > {Data.github_link? 'Github' : Data.is_user?'Add Github' : null} </a>

                                    <a className="links" href = {Data.leetCode} > {Data.leetCode? 'Leetcode' : Data.is_user? 'Add Leetcode' : null} </a>

                                </div>
                            }

                            

                            {
                                form && 
                                <div className="openForm">
                                    
                                    <textarea
                                        className="profile-input-text-area"
                                        placeholder="Write your amazing bio..."
                                        value= {formDataBIO}
                                        maxLength = '300'
                                        onChange={(e) => toggleFormDataBIO(e.target.value)}
                                    />

                                    <input
                                        type="text" 
                                        className="profile-input"
                                        placeholder="Linkedin Link"
                                        value= {formDataLINKEDIN}
                                        onChange={(e) => toggleFormDataLINKEDIN(e.target.value)}
                                    />

                                    <input
                                        type="text" 
                                        className="profile-input"
                                        placeholder="Github Link"
                                        value= {formDataGITHUB}
                                        onChange={(e) => toggleFormDataGITHUB(e.target.value)}
                                    />

                                    <input
                                        type="text" 
                                        className="profile-input"
                                        placeholder="Leetcode Link"
                                        value= {formDataLEETCODE}
                                        onChange={(e) => toggleFormDataLEETCODE(e.target.value)}
                                    />

                                </div>
                            }

                            {
                                Data.is_user ?
                                !form ?    
                                    <div className="edit">
                                        <button className="edit-button preview-button login_button" onClick={()=>toggleForm(true)} >Edit Profile</button>
                                    </div>
                                    :
                                    <div className="save-close">
                                        <button className="preview-button login_button save" onClick={() => newFormData() }>Save</button>
                                        <button className="preview-button login_button close" onClick={() => toggleForm(false)}>Close</button>
                                    </div>
                                    :
                                    null
                            }       

                        </div>
                </div>
            </div>
        </>
    );
};

export default Profile;