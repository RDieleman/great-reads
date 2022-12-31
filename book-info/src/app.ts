import express from 'express';
import 'express-async-errors';
import {json} from 'body-parser';
import cookieSession from "cookie-session";

import rateLimit from "express-rate-limit";
import {NotFoundError} from "./errors/not-found-error";
import {errorHandler} from "./middlewares/error-handler";
import {privacyRouter} from "./routes/privacy";

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
app.use(cookieSession({
    signed: false,
    secure: false,
    httpOnly: true,
    sameSite: true,
}));

app.use(privacyRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export {app};