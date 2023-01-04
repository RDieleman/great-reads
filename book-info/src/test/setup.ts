import {jest} from "@jest/globals";
import jwt from "jsonwebtoken";
import * as mongoose from "mongoose";
import {BookService} from "../services/book-service";

const searchResultExample = require("./search-result-example.json");
const volumeResultExample = require("./volume-result-example.json");

declare global {
    var signin: () => string[];
}

const sendRequestMock = async (path: string, params: Record<string, string | number>) => {
    if (path.startsWith("/volumes/")) {
        return volumeResultExample;
    } else {
        return searchResultExample;
    }
}

jest.mock("../nats-wrapper");
jest.spyOn(BookService, 'sendRequest').mockImplementation(sendRequestMock);

beforeAll(async () => {
    process.env.JWT_KEY = 'secret123';
});

beforeEach(async () => {
    jest.clearAllMocks();
});

global.signin = () => {
    // Build a JWT payload.  { id, email }
    const payload = {
        id: new mongoose.Types.ObjectId().toHexString(),
        email: "test@test.com",
    };

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
