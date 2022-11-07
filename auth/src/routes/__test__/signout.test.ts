import request from 'supertest';
import {app} from "../../app";

it('removes auth cookie after sign out', async () => {
    const signUpDetails = await signup();

    const result = await request(app)
        .post('/api/users/signout')
        .set('Cookie', signUpDetails.cookie)
        .send({})
        .expect(200);

    expect(result.get('Set-Cookie')).toEqual(
        ["session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly"]
    );
});