import React,{ useState, useEffect} from "react";

export const Authenticator = React.createContext();

const Auth = ({children}) => {
    const [RefreshToken, setRefreshToken] = useState(window.localStorage.getItem('RefreshToken'));
    const [AccessToken, setAccessToken] = useState(window.localStorage.getItem('AccessToken'));
    const [LoggedOut, setLoggedOut] = useState(true);

    const Logout = () => {
        console.log("trigger");
        window.localStorage.removeItem("RefreshToken");
        window.localStorage.removeItem("AccessToken");
        window.localStorage.removeItem("Author");
        window.localStorage.removeItem("AuthorID");
        setLoggedOut(true);
    }

    const LoginFunc = (username, password) => {
        fetch("https://hackathoniitp.herokuapp.com/Login/",{
            method: "POST",
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify(`grant_type=&username=${username}&password=${password}&scope=&client_id=&client_secret=`),
        })
        .then((res) => {
            if(res.status===200 || res.status===201)
                return res.json();
            else throw Error("IDK");
        })
        .then((res) => {
            console.log("IN");
            window.localStorage.setItem("AccessToken",res.access_token);
            window.localStorage.setItem("RefreshToken",res.refresh_token);
            window.localStorage.setItem("Author",res.author);
            window.localStorage.setItem("AuthorID",res.author_id);
            setLoggedOut(false);
            setAccessToken(res.access_token);
            setRefreshToken(res.refresh_token);
        }).catch((e) => {
            Logout();
        })
    }
    
    useEffect(()=>{
        if(RefreshToken){
            fetch("https://hackathoniitp.herokuapp.com/users/user_verification",{
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({refresh_token: RefreshToken})
            })
            .then((res) => {
                if(res.status===200 || res.status===201)
                    return res.json();
                else throw Error("IDK");
            }).then((res) => {
                window.localStorage.setItem("AccessToken",res.access_token);
                setLoggedOut(false);
                setAccessToken(res.access_token);
            }).catch((e) => {
                console.log("Failed");
                Logout();
            })
        }else Logout()

        let Refresher = setInterval(() => {
            if(RefreshToken){
                fetch("https://hackathoniitp.herokuapp.com/users/user_verification",{
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({refresh_token: RefreshToken})
                })
                .then((res) => {return res.json();})
                .then((res) => {
                    window.localStorage.setItem("AccessToken",res.access_token);
                    setLoggedOut(false);
                    setAccessToken(res.access_token);
                }).catch((e) => {Logout()})
            }
        }, (1000 * 60 * 20));
        return ()=>{
            clearInterval(Refresher);
        }
    },[RefreshToken]);

    return (
        <Authenticator.Provider value={{LoginFunc, Logout, LoggedOut, AccessToken}}>
        {children}
        </Authenticator.Provider>
    );
};

export default Auth;

