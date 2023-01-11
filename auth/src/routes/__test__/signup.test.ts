import request from 'supertest';
import {app} from "../../app";

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
            password: ' daipf  mfp '
        })
        .expect(201);
});

it('denies signup with passwords shorter than 12 characters', async () => {
    const passwords = [
        ['too_short!', 400],
        ['thispassword', 201],
        // 12 characters, but containing adjacent spaces.
        ['dbl  space12', 400],
        ['trpl   space', 400],
        ['12   67  111', 400]
    ]

    for (const password of passwords) {
        await request(app)
            .post('/api/users/public/signup')
            .send({
                email: 'test@test.com',
                password: password[0]
            }).expect(password[1]);
    }
})

it('denies when password longer than 128 characters', async () => {
    const passwords = [
        ['thispasswordisallowed', 201],
        // 129 character pw
        ['thispasswordistoolong1234thispasswordistoolong1234thispasswordistoolong1234thispasswordistoolong1234thispasswordistoolong12345678', 400]
    ]

    for (const password of passwords) {
        await request(app)
            .post('/api/users/public/signup')
            .send({
                email: 'test@test.com',
                password: password[0]
            }).expect(password[1]);
    }
})

it('allows passwords with unicode, spaces, and emojis', async () => {
    const passwords = [
        ["test1@example.com", 'test_h pass😅🥹?'],
        ["test2@example.com", 'test_h pass©§']
    ]

    for (const password of passwords) {
        await request(app)
            .post('/api/users/public/signup')
            .send({
                email: password[0],
                password: password[1]
            }).expect(201);
    }
})

it('allows passwords of 64 characters', async () => {
    const password = "12somerandompassword2somerandompassword2somerandompassword1234";

    await request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
            password
        }).expect(201);
})

it('returns a 400 with an invalid email', async () => {
    return request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'testtest.com',
            password: 'password12345'
        })
        .expect(400);
});

it('returns a 400 with an invalid password signup', async () => {
    return request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('denies signup when using a commonly used password', async () => {
    const result = await request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
            password: 'common_password'
        })
        .expect(400)

    expect(result.body.errors).toEqual([{"message": "Bad password."}]);
})

it('returns a 400 with a missing email or password signup', async () => {
    await request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
        })
        .expect(400);

    await request(app)
        .post('/api/users/public/signup')
        .send({
            password: 'password12345'
        })
        .expect(400);
});

it('disallows duplicate emails', async () => {
    const signUpDetails = await signup();

    await request(app)
        .post('/api/users/public/signup')
        .send({
            email: signUpDetails.email,
            password: 'password123123'
        })
        .expect(400);
});

it('sets auth cookie after successful signup', async () => {
    const res = await request(app)
        .post('/api/users/public/signup')
        .send({
            email: 'test@test.com',
            password: 'password12345'
        })
        .expect(201);

    expect(res.get('Set-Cookie')).toBeDefined();
})