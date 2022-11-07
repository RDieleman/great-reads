import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";
import {useEffect} from "react";

const AppComponent = (context) => {
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    const {Component, pageProps, currentUser} = context;
    return <div style={{height: '100vh'}}>
        <Header currentUser={currentUser}/>
        <Component {...{currentUser, ...pageProps}} />
    </div>
};

AppComponent.getInitialProps = async (context) => {
    const client = buildClient(context.ctx);
    const {data} = await client.get('/api/users/me');

    let pageProps = {};
    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(context.ctx);
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;