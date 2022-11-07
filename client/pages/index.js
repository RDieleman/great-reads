import {useEffect} from "react";
import Router from "next/router";

const LandingPage = (context) => {
    console.log("Current user: ", context.currentUser);

    useEffect(() => {
        if (!context.currentUser) {
            Router.push('/auth/signin');
        }
    }, []);

    if (!context.currentUser) {
        return <h1 className="container">Redirecting...</h1>
    }

    return <div className="container">
        <h1>Home</h1>
        <hr/>
        <div>
            Logged in as <b>{context.currentUser.userInfo.email}</b>.
        </div>
    </div>
}

export default LandingPage;