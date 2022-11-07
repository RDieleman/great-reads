import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";

interface SignupDetails {
    userId: string,
    email: string,
    password: string,
    cookie: string[]
}

declare global {
    var signup: () => Promise<SignupDetails>;
}

let mongo: any;

//Create database.
beforeAll(async () => {
    process.env.JWT_KEY = 'secret123';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

// Reset database.
beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
        await collection.deleteMany({});
    }
});

// Stop database.
afterAll(async () => {
    if (mongo) {
        await mongo.stop();
    }

    await mongoose.connection.close();
});

global.signup = async () => {
    const email = 'test@test.com';
    const password = 'password';

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email, password
        })
        .expect(201)

    return {
        userId: response.body.id,
        email,
        password,
        cookie: response.get('Set-Cookie')
    };
}