import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import {currentUserRouter} from './routes/current-user';
import {signinRouter} from './routes/signin';
import {signupRouter} from './routes/signup';
import {signoutRouter} from './routes/signout';
import {deleteRouter} from "./routes/delete";
import {privacyRouter} from "./routes/privacy";
import {NotFoundError} from "./errors/not-found-error";
import {errorHandler} from "./middlewares/error-handler";
import rateLimit from "express-rate-limit";
import {requireAuth} from "./middlewares/require-auth";
import helmet from "helmet";

const app = express();

// trust nginx proxy
app.set('trust proxy', true);

app.use(helmet());

// Set rate limiter
const limiter = rateLimit({
    max: 200,
    windowMs: 60 * 60 * 1000,
    message: "Too many request from this IP"
});
app.use(limiter);

app.use(json());
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

// Always require authentication, unless in public endpoint.
app.use(requireAuth);

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);
app.use(deleteRouter);
app.use(privacyRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};