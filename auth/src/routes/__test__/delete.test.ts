import request from 'supertest';
import {app} from "../../app";
import {User} from "../../models/user";
import {natsWrapper} from "../../nats-wrapper";
import {Subjects} from "../../events/subjects";

it('responds with unauthorized when user is not authenticated', async () => {
    const signUpDetails = await global.signup();

    // Responds with not allowed if not authenticated.
    await request(app)
        .delete('/api/users')
        .send()
        .expect(401)

    // Account is not deleted.
    const storedUser = await User.findById(signUpDetails.userId);
    expect(storedUser).toBeDefined()
});

it('responds with OK when account is deleted', async () => {
    const signUpDetails = await global.signup();

    // Responds with ok if deleted.
    const result = await request(app)
        .delete('/api/users')
        .set('Cookie', signUpDetails.cookie)
        .send()
        .expect(200)

    // Cookie is cleared
    expect(result.get('Set-Cookie')).toEqual(
        ["session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=strict; httponly"]
    );

    // Account is deleted.
    const storedUser = await User.findById(signUpDetails.userId);
    expect(storedUser).toBeNull()
});

it('publishes event on deletion', async () => {
    const signUpDetails = await global.signup();

    // Responds with ok if deleted.
    await request(app)
        .delete('/api/users')
        .set('Cookie', signUpDetails.cookie)
        .send()
        .expect(200)

    // Event is published
    expect(natsWrapper.client.publish).toHaveBeenCalledWith(
        Subjects.ACCOUNT_DELETED,
        expect.anything(),
        expect.anything()
    );
});