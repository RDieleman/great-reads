import axios from "axios";

export default ({req}) => {
    const onServer = typeof window === 'undefined';
    if (onServer) {
        return axios.create({
            baseURL: 'http://www.greatreads.online',
            headers: req.headers
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};