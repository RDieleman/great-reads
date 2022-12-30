import axios from "axios";

export default ({req}) => {
    const onServer = typeof window === 'undefined';

    if (onServer) {
        return axios.create({
            baseURL: process.env.NEXT_PUBLIC_HOST,
            headers: req.headers,
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};
