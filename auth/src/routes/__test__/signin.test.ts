import request from 'supertest';
import {app} from "../../app";

it('fails when an email is provided that does not exist', async () => {
    await request(app)
        .post('/api/users/public/signin/credentials')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400);
});

it('fails with generic message when an incorrect password is supplied', async () => {
    const signUpDetails = await signup();


    const passwords = [
        "password123",
        "",
        null,
        "12312312313dfjdkfkwkejrqw;lerjqwerlkasdf;lkjasdf"
    ]

    for (let password in passwords) {
        await request(app)
            .post('/api/users/public/signin/credentials')
            .send({
                email: signUpDetails.email,
                password
            })
            .expect(400, {
                "errors": [
                    {
                        "message": "Invalid credentials."
                    }
                ]
            });
    }
});

it('fails with generic message when an invalid google token is supplied', async () => {
    const tokens = [
        "token123",
        "",
        null,
        "12312312313dfjdkfkwkejrqw;lerjqwerlkasdf;lkjasdf"
    ]

    for (let token in tokens) {
        await request(app)
            .post('/api/users/public/signin/google')
            .type('form')
            .send({
                credential: token
            })
            .expect(400, {
                "errors": [
                    {
                        "message": "Invalid credentials."
                    }
                ]
            });
    }
});