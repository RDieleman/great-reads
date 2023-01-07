import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import rateLimit from "express-rate-limit";
import {NotFoundError} from "./errors/not-found-error";
import {errorHandler} from "./middlewares/error-handler";
import {privacyRouter} from "./routes/privacy";
import {bookRouter} from "./routes/book";

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

app.use(cookieSession({
    // Only sign cookies when not in a testing environment.
    signed: process.env.NODE_ENV !== 'test',
    secure: true,
    httpOnly: true,
    sameSite: true,
    keys: [
        process.env.COOKIE_KEY!
    ]
}));

app.use(privacyRouter);
app.use(bookRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};