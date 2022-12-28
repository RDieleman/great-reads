import request from 'supertest';
import {app} from "../../app";
import {natsWrapper} from "../../nats-wrapper";
import {Subjects} from "@greatreads/common/";

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

it('publishes an event on sign out', async () => {
    const signUpDetails = await signup();

    await request(app)
        .post('/api/users/signout')
        .set('Cookie', signUpDetails.cookie)
        .send({})
        .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
        Subjects.TOKENS_REVOKED,
        expect.anything(),
        expect.anything()
    );
});