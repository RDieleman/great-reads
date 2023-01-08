import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {User} from "../models/user";
import {PasswordManager} from "../services/password-manager";
import {RequestValidationError} from "../errors/request-validation-error";
import {BadRequestError} from "../errors/bad-request-error";
import {SessionManager} from "../services/session-manager";
import {GoogleService} from "../services/google-service";
import {validateRequest} from "../middlewares/validate-request";
import {AccountCreatedPublisher} from "../events/account_created/account-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post(
    '/api/users/signin/credentials',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid.'),
        body('password')
            .trim()
            .notEmpty()
            .withMessage('Password must be valid.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Validate given data.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new RequestValidationError(errors.array());
        }

        const {email, password} = req.body;

        try {
            // Verify user exists.
            const user = await User.findOne({email: email});
            if (!user) {
                throw new Error('User not found.');
            }

            // Verify password.
            const passwordsMatch = await PasswordManager.compare(user.password, password);
            if (!passwordsMatch) {
                throw new Error('Invalid Password.');
            }

            // Generate session.
            req.session = SessionManager.generate({
                id: user.id,
                email: user.email
            });
        } catch (ex) {
            console.log('ex');
            throw new BadRequestError('Invalid credentials.');
        }

        res.status(200).send();
    });

router.post(
    '/api/users/signin/google', [
        body('idToken')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        // Validate token
        try {
            const googleAccount = await GoogleService.getUserInfo(req.body.idToken);
            if (!googleAccount || !googleAccount.id || !googleAccount.email) {
                throw new Error('Invalid Google Token');
            }

            // Find user connected to google account.
            let user = await User.findOne({"email": googleAccount.email});

            // Create if it doesn't exist.
            if (!user) {
                // @ts-ignore
                user = await User.build({"email": googleAccount!.email});

                // @ts-ignore
                await user.save();

                new AccountCreatedPublisher(natsWrapper.client).publish({
                    userId: user!.id
                })
            }

            if (!user) {
                throw new Error('User not found.');
            }

            // Generate session for user.
            req.session = SessionManager.generate({
                id: user.id,
                email: user.email
            });

        } catch (ex) {
            console.log(ex);
            throw new BadRequestError("Invalid credentials.");
        }

        res.status(200).send();
    });

export {router as signinRouter};