import {useEffect, useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import Script from "next/script";
import CustomModal from "../../components/modal";
import {router} from "next/client";

const SigninComponent = ({currentUser, onServer}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doAuthCredentials, authCredentialsErrors] = useRequest({
        url: '/api/users/signin/credentials',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
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
        url: '/api/users/signin/google',
        method: 'post',
        body: {
            idToken
        },
        onSuccess: () => Router.push('/')
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
            console.log("Google not yet defined.");
        }
    }, []);

    if (currentUser && onServer) {
        return <></>
    }

    if (currentUser) {
        router.push("/dashboard")
        return <div>Redirecting...</div>
    }

    return <div className="d-flex w-100 h-100 justify-content-center align-items-center">
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
    </div>
}

export default SigninComponent;