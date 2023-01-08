import request from 'supertest';
import {app} from "../../app";

it('responds with object of personal data usage by service', async () => {
    // Request report.
    const result = await request(app)
        .get('/api/users/public/privacy')
        .expect(200);

    // Verify result
    expect(result.body).toBeDefined();
})