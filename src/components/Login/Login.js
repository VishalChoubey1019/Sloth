import React,{ useRef, useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { BiCodeCurly as Logo } from "react-icons/bi";
import { Authenticator } from "../Auth/Auth";
import { AiFillEye as Openeye, AiFillEyeInvisible as Closeeye } from "react-icons/ai";
import "./login.css";

const Login = () => {
    const Email = useRef(null);
    const Password = useRef(null);
    const [isVisible, setVisibility] = useState(false);
    const { LoggedOut, LoginFunc } = useContext(Authenticator);

    const ChangeVisibility = () => {
        setVisibility(!isVisible);
    }

    const Eye_Style = {
        "color": "rgba(255,255,255,0.4)",
        "size" : "1.2em",
        "cursor": "pointer",
        "onClick": ChangeVisibility,
    }

    const LoginHandler = () => {
        // Handle Login
        console.log(`LoggedOut - Login Handler : ${LoggedOut}`);

        if(!Email.current.value || !Password.current.value)
            window.alert("Please Fill in all info");
        else LoginFunc(Email.current.value,Password.current.value);
    }

    return (
        <>
        {LoggedOut===false && <Redirect to="/" />}
        {LoggedOut===true && (
        <div className="login-form">
            <Link to="/" children={<Logo className="login-logo" size="7em"/>}/>
            <input className="input" type="email" maxLength="40" placeHolder="example@gmail.com" ref={Email}/>
            <div className="login-password">
                <input className="input" type={`${isVisible===true ? "text" : "password" }`} placeHolder="password" maxLength="20" ref={Password}/>
                <div className="login-eye">{
                    isVisible===true ? <Openeye {...Eye_Style}/> : <Closeeye {...Eye_Style}/>
                }</div>
            </div>
            <div className="login_button" onClick={LoginHandler}>Login</div>
            <div className="login-footer">
                <p>Don't have an account ?
                <Link to="/signup" style={{ textDecoration: 'none', color: "#61dafb"}} children={" SignUp"}/>
                </p>
            </div>
        </div>
        )}
        </>
    );
};

export default Login;