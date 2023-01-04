import useRouter from "../hooks/use-router";

const LandingPage = ({currentUser}) => {
    const router = useRouter();

    const path = (!currentUser) ? "/auth/signin" : "/dashboard";
    return router.push(path);
}

export default LandingPage;