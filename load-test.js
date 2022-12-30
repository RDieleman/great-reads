import http from 'k6/http';
import {check, sleep} from 'k6';

export const options = {
    vus: 10,
    iterations: 200,
    thresholds: {
        // http errors should be less than 1%
        http_req_failed: ['rate<0.01'],
        // 95 percent of response times must be below 500ms
        http_req_duration: ['p(95)<500']
    }
};

export default function () {
    const url = 'http://www.greatreads.online/';

    const res = http.get(url, {tags: {name: 'Home'}});
    check(res, {
        'is status 200': (r) => r.status === 200
    });
    sleep(Math.random() * 5);
}
