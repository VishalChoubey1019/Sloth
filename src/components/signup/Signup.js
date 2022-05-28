import React,{ useRef, useState, useContext } from "react";
import { Link, Redirect } from "react-router-dom";
import { AiFillEye as Openeye, AiFillEyeInvisible as Closeeye } from "react-icons/ai";
import { BiCodeCurly as Logo } from "react-icons/bi";
import { Authenticator } from "../Auth/Auth";

const SignUp = () => {
    const Email = useRef(null);
    const Password = useRef(null);
    const DisplayName = useRef(null);
    const [isVisible, setVisibility] = useState(false);
    const { LoggedOut } = useContext( Authenticator);
    const { Entered, setEntered } = useState(false);

    const ChangeVisibility = () => {
        setVisibility(!isVisible);
    }

    const Eye_Style = {
        "color": "rgba(255,255,255,0.4)",
        "size" : "1.2em",
        "cursor": "pointer",
        "onClick": ChangeVisibility,
    }

    const SignUpHandler = () => {
        if(LoggedOut===false)
            window.alert("Already Logged In");
        else{
            if(Password.current.value.length<=7)window.alert("Weak Password");
            else if(!Email.current.value || !DisplayName.current.value){
                window.alert("Please properly fill the form");
            }else{
                const payload = {
                    "author": DisplayName.current.value,
                    "email": Email.current.value,
                    "password": Password.current.value,
                }
                console.log(payload);
                fetch("https://backendhackurway.herokuapp.com/users/create",{
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                setEntered(true);
            }
            // fetch("https://backendhackurway.herokuapp.com/users/create");
        }
    }

    return (
        <>
        {Entered===true && <Redirect to="/" />}
        {LoggedOut===false && <Redirect to="/" />}
        {LoggedOut===true && (
        <div className="login-form">
            <Link to="/" children={<Logo className="login-logo" size="7em"/>}/>
            <input className="input" type="text" maxLength="30" placeHolder="Display Name" ref={DisplayName}/>
            <input className="input" type="email" maxLength="40" placeHolder="example@gmail.com" ref={Email}/>
            <div className="login-password">
                <input className="input" type={`${isVisible===true ? "text" : "password" }`} placeHolder="password" maxLength="20" ref={Password}/>
                <div className="login-eye">{
                    isVisible===true ? <Openeye {...Eye_Style}/> : <Closeeye {...Eye_Style}/>
                }</div>
            </div>
            <div className="login_button" onClick={SignUpHandler}>SignUp</div>
            <div className="login-footer">
                <p>Already have an account ?
                <Link to="/login" style={{ textDecoration: 'none', color: "#61dafb"}} children={" Login"}/>
                </p>
            </div>
        </div>
        )}
        </>
    );
};

export default SignUp;