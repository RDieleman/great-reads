import {useRouter as useNextRouter} from "next/router";

const useRouter = () => ({
    push: (path) => {
        const onServer = typeof window === 'undefined'

        if (!onServer) {
            useNextRouter().push(path);
        }
        
        return <div>Redirecting...</div>
    }
});

export default useRouter;