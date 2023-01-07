import {useRouter as useNextRouter} from "next/router";
import Loader from "../components/loader";

const useRouter = () => ({
    push: (path) => {
        const onServer = typeof window === 'undefined'

        if (!onServer) {
            useNextRouter().push(path);
        }

        return <Loader/>
    }
});

export default useRouter;