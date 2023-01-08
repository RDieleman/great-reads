import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import rateLimit from "express-rate-limit";
import {NotFoundError} from "./errors/not-found-error";
import {errorHandler} from "./middlewares/error-handler";
import {privacyRouter} from "./routes/privacy";
import {bookRouter} from "./routes/book";
import {requireAuth} from "./middlewares/require-auth";

const app = express();

// trust nginx proxy
app.set('trust proxy', true);

// Set rate limiter
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP"
});
app.use(limiter);

app.use(json());
app.set('query parser', 'simple');

const inTestEnvironment = process.env.NODE_ENV === 'test';
app.use(cookieSession({
    // Don't sign and secure cookie in test environment.
    name: (inTestEnvironment) ? "session" : "__Host-session",
    signed: !inTestEnvironment,
    secure: !inTestEnvironment,
    httpOnly: true,
    sameSite: true,
    keys: [
        process.env.COOKIE_KEY!
    ]
}));

app.use(requireAuth);

app.use(privacyRouter);
app.use(bookRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};