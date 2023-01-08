import {useEffect, useRef, useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";
import CustomModal from "../../components/modal";
import AuthLayout from "../../components/layouts/auth";
import {useAppContext} from "../_app";
import useRouter from "../../hooks/use-router";
import Password from "../../components/input/password";

const SignUpComponent = ({currentUser, onServer}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const strength = useRef('');
    const state = useAppContext();

    const [doSignUp, errors] = useRequest({
        url: '/api/users/public/signup',
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
        if (errors == null) {
            return;
        }
        setShowCredentialModal(true);
    }, [errors])

    const onSubmit = async (event) => {
        event.preventDefault();
        await doSignUp();
    }

    if (state.user) {
        return useRouter().push('/');
    }

    return <>
        <form onSubmit={onSubmit} className="container">
            <div className="mb-2">
                <label htmlFor="emailInput" className="form-label">Email address</label>
                <input type="email" className="form-control" id="emailInput" value={email}
                       onChange={e => setEmail(e.target.value)}/>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput"
                       className="form-label">Password {password.length > 0 && strength.current}</label>
                <Password password={password} setPassword={setPassword}
                          setStrengthElement={(e) => strength.current = e}/>
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
    </>
}

SignUpComponent.PageLayout = AuthLayout;

export default SignUpComponent;