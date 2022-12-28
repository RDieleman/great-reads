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

const app = express();

// trust nginx proxy
app.set('trust proxy', true);

app.use(json());
app.use(cookieSession({
    signed: false,
    secure: false,
    httpOnly: true,
    sameSite: true,
}));

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