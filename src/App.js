import React from "react";
import './App.css';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import Home from "./components/homepage/Home";
import Login from "./components/Login/Login";
import Signup from "./components/signup/Signup";
import Profile from "./components/dashboard/Profile";
import Singlepost from "./components/SinglePost/Singlepost";
import Createpost from "./components/CreatePost/Createpost";
import Auth from "./components/Auth/Auth";

function App() {
    return (
        <div className="App">
            <Auth>
            <Router>
                <Switch>
                    <Route exact path="/" children={<Home/>}/>
                    <Route path="/login" children={<Login/>}/>
                    <Route path="/signup" children={<Signup/>}/>
                    <Route path="/createpost" children={<Createpost/>}/>
                    <Route path="/profile/:id" children={<Profile/>}/>
                    <Route path="/post/:id" children={<Singlepost/>}/>
                </Switch>
            </Router>
            </Auth>
        </div>  
    );
}

export default App;
