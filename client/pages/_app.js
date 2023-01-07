import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import {createContext, useContext, useEffect, useState} from "react";
import "../style.css";


export const AppContext = createContext();

const AppWrapper = ({children}) => {
    const [user, setUser] = useState(null);
    const [searchIndex, setSearchIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchItems, setSearchItems] = useState({});
    const [searchScrollLocation, setSearchScrollLocation] = useState(0);

    let state = {
        user,
        setUser,
        searchTerm,
        setSearchTerm,
        searchIndex,
        setSearchIndex,
        searchItems,
        setSearchItems,
        searchScrollLocation,
        setSearchScrollLocation
    }

    return (
        <AppContext.Provider value={state}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppContext = () => {
    return useContext(AppContext);
}

const AppComponent = ({Component, pageProps}) => {
    // Load Bootstrap
    useEffect(() => {
        import("bootstrap/dist/js/bootstrap");
    }, []);

    return (
        <AppWrapper>
            <div className="flex-column d-flex vh-100">
                {Component.PageLayout ? (
                    <Component.PageLayout>
                        <Component {...pageProps} />
                    </Component.PageLayout>
                ) : (
                    <Component {...pageProps} />
                )}
            </div>
        </AppWrapper>
    )
};

AppComponent.getInitialProps = async (context) => {
    // Create API client.
    const client = buildClient(context.ctx);

    let pageProps = {};

    if (context.Component.getInitialProps) {
        pageProps = await context.Component.getInitialProps(
            context.ctx,
            client
        );
    }

    // Continue to App Component.
    return {
        pageProps: {
            ...pageProps
        }
    };
};

export default AppComponent;