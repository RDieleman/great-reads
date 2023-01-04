import {useEffect, useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import CustomModal from "../../components/modal";
import {router} from "next/client";

const SignUpComponent = ({currentUser, onServer}) => {
    if (currentUser) {
        router.push("/dashboard")
        return <div>Redirecting...</div>
    }

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [doSignUp, errors] = useRequest({
        url: '/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const [showCredentialModal, setShowCredentialModal] = useState(false);
    useEffect(() => {
        if (errors == null) {
            return;
        }
        setShowCredentialModal(true);
    }, [errors])

    const onSubmit = async (event) => {
        event.preventDefault();
        await doSignUp();
    }

    return <div className="d-flex w-100 h-100 justify-content-center align-items-center">
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
                        onClick={() => Router.push("/auth/signin")}>Sign In
                </button>
            </div>
        </form>
        <CustomModal
            show={showCredentialModal}
            onHide={() => setShowCredentialModal(false)}
            title="Oops..."
            body={(
                <ul>
                    {errors && errors.map((err) => {
                        return <li>{err.message}</li>
                    })}
                </ul>
            )}
        />
    </div>
}

export default SignUpComponent;