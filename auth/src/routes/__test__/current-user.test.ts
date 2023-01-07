import request from 'supertest';
import {app} from "../../app";

it('responds with details about authenticated user', async () => {
    const signUpDetails = await global.signup();

    const res = await request(app)
        .get('/api/users/me')
        .set('Cookie', signUpDetails.cookie)
        .send()
        .expect(200);

    expect(res.body.currentUser.userInfo.email).toEqual(signUpDetails.email);
    expect(res.body.currentUser.userInfo.id).toEqual(signUpDetails.userId);
});

it('responds without details when user is not authenticated', async () => {
    const res = await request(app)
        .get('/api/users/me')
        .send()
        .expect(401);

    expect(res.body.currentUser).toEqual(undefined);
});