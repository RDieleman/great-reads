import {jest} from "@jest/globals";

jest.mock("../nats-wrapper");

beforeAll(async () => {
    process.env.JWT_KEY = 'secret123';
});

beforeEach(async () => {
    jest.clearAllMocks();
});