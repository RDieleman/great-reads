import axios from "axios";

export default ({req}) => {
    const onServer = typeof window === 'undefined';

    if (onServer) {
        return axios.create({
            //dev baseURL: 'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
            baseURL: 'https://www.greatreads.online',
            headers: req.headers,
        });
    } else {
        return axios.create({
            baseURL: '/'
        });
    }
};
