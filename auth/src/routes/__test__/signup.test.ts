import request from 'supertest';
import {app} from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: ' daipf  mfp '
        })
        .expect(201);
});

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testtest.com',
            password: 'password12345'
        })
        .expect(400);
});

it('returns a 400 with an invalid password signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('denies signup when using a commonly used password', async () => {
    const result = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'common_password'
        })
        .expect(400)

    expect(result.body.errors).toEqual([{"message": "Bad password."}]);
})

it('returns a 400 with a missing email or password signup', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/signup')
        .send({
            password: 'password12345'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    const signUpDetails = await signup();

    await request(app)
        .post('/api/users/signup')
        .send({
            email: signUpDetails.email,
            password: 'password123123'
        })
        .expect(400);
});

it('sets auth cookie after successful signup', async () => {
    const res = await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password12345'
        })
        .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
})