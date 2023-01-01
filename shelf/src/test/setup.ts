import {MongoMemoryServer} from "mongodb-memory-server";
import {jest} from "@jest/globals";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {User} from "../models/user";

declare global {
    var signin: () => Promise<string[]>;
}

jest.mock("../nats-wrapper");

let mongo: any;

beforeAll(async () => {
    process.env.JWT_KEY = 'secret123';

    mongo = await MongoMemoryServer.create();
    const mongoUri = mongo.getUri();

    await mongoose.connect(mongoUri, {});
});

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

global.signin = async () => {
    // Build a JWT payload.  { id, email }
    const payload = {
        userInfo: {
            id: new mongoose.Types.ObjectId().toHexString(),
            email: "test@test.com",
        }
    };

    const user = User.build({
        read: [], reading: [], wantToRead: [],
        userId: payload.userInfo.id
    });

    await user.save();

    // Create the JWT!
    const token = jwt.sign(payload, process.env.JWT_KEY!);

    // Build session Object. { jwt: MY_JWT }
    const session = {jwt: token};

    // Turn that session into JSON
    const sessionJSON = JSON.stringify(session);

    // Take JSON and encode it as base64
    const base64 = Buffer.from(sessionJSON).toString("base64");

    // return a string thats the cookie with the encoded data
    return [`session=${base64}`];
};
