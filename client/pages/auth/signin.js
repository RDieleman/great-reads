import {useEffect, useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Script from "next/script";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doRequest, error] = useRequest({
        url: '/api/users/signin/credentials',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });
    const [idToken, setIdToken] = useState('');
    const [doAuthGoogle, authGoogleError] = useRequest({
        url: '/api/users/signin/google',
        method: 'post',
        body: {
            idToken
        },
        onSuccess: () => Router.push('/')
    })

    useEffect(() => {
        if (idToken) {
            doAuthGoogle();
        }
    }, [idToken])

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    }

    const handleTokenResponse = async (response) => {
        console.log(response.credential);
        await setIdToken(response.credential);
    }

    function loadButton() {
        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleTokenResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            {theme: "outline", size: "large"}  // customization attributes
        );
        google.accounts.id.prompt();
    }

    useEffect(() => {
        try {
            loadButton()
        } catch (err) {
            console.log("Google not yet defined.");
        }
    }, []);

    return <div>
        <Script
            src="https://accounts.google.com/gsi/client"
            onLoad={loadButton}
            async
            defer
        />
        <form onSubmit={onSubmit} className="container">
            <h1>Sign In2</h1>
            <div className="mb-3">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" value={email}
                       onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" value={password}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            {error}
            <button className="btn btn-primary">Continue</button>
        </form>
        <hr></hr>
        <div id="buttonDiv"></div>
    </div>

}