import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose from "mongoose";
import {app} from "../app";
import request from "supertest";
import {jest} from "@jest/globals";
import {User} from "../models/user";

interface SignupDetails {
    userId: string,
    email: string,
    password: string,
    cookie: string[]
}

declare global {
    var signup: () => Promise<SignupDetails>;
}

jest.mock("../nats-wrapper");
jest.mock("../redis-wrapper");
jest.mock('../../common-passwords.json', () => (['common_password', 'common_password2']));

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
    jest.clearAllMocks();

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
    const password = 'password12345';

    const response = await request(app)
        .post('/api/users/public/signup')
        .send({
            email, password
        })
        .expect(201)

    const user = await User.findOne();

    return {
        userId: user!.id,
        email,
        password,
        cookie: response.get('Set-Cookie')
    };
}