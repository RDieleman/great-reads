import useRouter from "../hooks/use-router";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Loader from "../components/loader";
import {useAppContext} from "./_app";

const LandingPage = () => {
    const state = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const user = useRef(null);

    useEffect(() => {
        const retrieveUser = async () => {
            try {
                let res = await axios.get('/api/users/me');
                console.log('response: ', res);
                if (res.status === 200) {
                    user.current = res.data.currentUser;
                }
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        retrieveUser();
    }, [])

    if (isLoading) {
        return <Loader/>
    }

    console.log("current user: ", user.current);
    state.setUser(user.current);

    const path = (!user.current) ? "/auth/signin" : "/dashboard";
    return router.push(path);
}

export default LandingPage;