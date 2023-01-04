import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";
import React, {useEffect} from "react";
import "../style.css";
import Menu from "../components/menu";

const AppComponent = ({Component, pageProps, currentUser}) => {
    // Load Bootstrap
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    return <div className="flex-column d-flex vh-100">
        <Header currentUser={currentUser}/>
        <Component {...{currentUser, ...pageProps}} />
        {pageProps.showMenu && <Menu/>}
    </div>
};

AppComponent.getInitialProps = async (context) => {
    // Create API client.
    const client = buildClient(context.ctx);

    // Fetch information about current user.
    const {data} = await client.get('/api/users/me');

    let defaultPropValues = {
        showMenu: false
    }

    let pageProps = {};

    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(
            context.ctx,
            client,
            data.currentUser,
        );
    }

    // Continue to App Component.
    return {
        pageProps: {
            ...defaultPropValues,
            ...pageProps
        },
        ...data
    };
};

export default AppComponent;