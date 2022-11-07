import {useState} from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

export default () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [doRequest, error] = useRequest({
        url: '/api/users/signin',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async (event) => {
        event.preventDefault();
        await doRequest();
    }

    return <form onSubmit={onSubmit} className="container">
        <h1>Sign In</h1>
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
}