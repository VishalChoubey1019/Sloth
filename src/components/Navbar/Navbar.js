import React, { useContext } from "react";
import { BiCodeCurly as Logo } from "react-icons/bi";
import { Link } from "react-router-dom";
import { IoIosLogIn as LoginIcon, IoIosLogOut as LogoutIcon } from "react-icons/io";
import { AiOutlineUser as ProfileIcon } from "react-icons/ai";
import { Authenticator } from "../Auth/Auth";
import "./navbar.css";

const Navbar = () => {
    return(
        <div className="navbar">
            <div className="inner-navbar">
                <div className="web-icon">
                    <Link to="/" children={<Logo size="3em" cursor="pointer" color="#61dafb"/>}/>
                </div>
                <OtherSections />
            </div>
        </div>
    );
}

const OtherSections = () => {
    const {Logout, LoggedOut} = useContext(Authenticator);
    const IconConfig = {
        "size": "2em",
        "cursor": "pointer",
        "color": "#61dafb",
    }
    
    const NavLogout = () => {
        Logout();
        window.location.reload(false);
    };
    
    return (
        <div className="nav-profile">
            {LoggedOut===true && <Link to="/login" children={<LoginIcon {...IconConfig}/>}/>}
            {LoggedOut===false && (
                <>
                    <Link to={`/profile/${window.localStorage.getItem("AuthorID")}`} 
                    children={<ProfileIcon {...IconConfig} size="1.8em"/>}/>
                    <LogoutIcon onClick={NavLogout} {...IconConfig}/>
                </>
            )}
        </div>
    );
};

export default Navbar;