import {useEffect, useState} from "react";
import Script from "next/script";
import CustomModal from "../../components/modal";
import useRequest from "../../hooks/use-request";
import AuthLayout from "../../components/layouts/auth";
import Router from "next/router";
import {useAppContext} from "../_app";
import useRouter from "../../hooks/use-router";

const SigninComponent = ({currentUser, onServer}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const state = useAppContext();
    const [doAuthCredentials, authCredentialsErrors] = useRequest({
        url: '/api/users/public/signin/credentials',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: (user) => {
            state.setUser(user);
            Router.push('/');
        }
    });
    const [showCredentialModal, setShowCredentialModal] = useState(false);

    useEffect(() => {
        if (authCredentialsErrors == null) {
            return;
        }
        setShowCredentialModal(true);
    }, [authCredentialsErrors])

    const [idToken, setIdToken] = useState('');
    const [doAuthGoogle, authGoogleErrors] = useRequest({
        url: '/api/users/public/signin/google',
        method: 'post',
        body: {
            idToken
        },
        onSuccess: (user) => {
            state.setUser(user);
            Router.push('/');
        }
    })
    const [showGoogleModal, setShowGoogleModal] = useState(false);
    useEffect(() => {
        if (authGoogleErrors == null) {
            return;
        }
        setShowGoogleModal(true);
    }, [authGoogleErrors])

    useEffect(() => {
        if (idToken) {
            doAuthGoogle();
        }
    }, [idToken])

    if (state.user) {
        return useRouter().push('/');
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        await doAuthCredentials();
    }

    const handleTokenResponse = async (response) => {
        await setIdToken(response.credential);
    }

    function loadButton() {
        google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            callback: handleTokenResponse
        });
        google.accounts.id.renderButton(
            document.getElementById("buttonDiv"),
            {theme: "outline", size: "large", width: "100%"}  // customization attributes
        );
        google.accounts.id.prompt();
    }

    useEffect(() => {
        try {
            loadButton()
        } catch (err) {
            console.log("Google is not defined yet.");
        }
    }, []);

    return <>
        <Script
            src="https://accounts.google.com/gsi/client"
            onLoad={loadButton}
            async
            defer
        />
        <form onSubmit={onSubmit} className="container">
            <div className="mb-2">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" value={email}
                       onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput" className="form-label">Password</label>
                <input type="password" className="form-control" id="passwordInput" value={password}
                       onChange={e => setPassword(e.target.value)}/>
            </div>
            <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit">Continue</button>
                <button className="btn btn-outline-secondary" type="button"
                        onClick={() => Router.push("/auth/signup")}>Sign Up
                </button>
            </div>
            <hr></hr>
            <div id="buttonDiv"></div>
        </form>
        <CustomModal
            show={showCredentialModal}
            onHide={() => setShowCredentialModal(false)}
            title="Oops..."
            body={(
                <ul>
                    {authCredentialsErrors && authCredentialsErrors.map((err) => {
                        return <li>{err.message}</li>
                    })}
                </ul>
            )}
        />
        <CustomModal
            show={showGoogleModal}
            onHide={() => setShowGoogleModal(false)}
            title="Oops..."
            body={(
                <ul>
                    {authGoogleErrors && authGoogleErrors.map((err) => {
                        return <li>{err.message}</li>
                    })}
                </ul>
            )}
        />
    </>
}

SigninComponent.PageLayout = AuthLayout;

export default SigninComponent;