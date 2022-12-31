import {app} from "../../app";
import request from 'supertest';

it('responds with object of personal data usage by service', async () => {
    // Request report.
    const result = await request(app)
        .get('/api/book-info/privacy')
        .expect(200);

    // Verify result
    expect(result.body).toBeDefined();
})