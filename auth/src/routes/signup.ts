import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import {validateRequest} from "../middlewares/validate-request";
import {BadRequestError} from "../errors/bad-request-error";
import {SessionManager} from "../services/session-manager";
import {AccountCreatedPublisher} from "../events/account_created/account-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const router = express.Router();

router.post(
    '/api/users/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid.'),
        body('password')
            .trim()
            .isLength({min: 4, max: 20})
            .withMessage('Password must be between 4 and 20 characters.')
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        // Verify is email is not already in use.
        const existingUser = await User.findOne({email});
        if (existingUser) {
            throw new BadRequestError("Email already in use.")
        }

        // Store user
        const user = User.build({email, password});
        await user.save();

        // Publish creation event.
        new AccountCreatedPublisher(natsWrapper.client).publish({
            userId: user.id
        });

        try {
            // Generate session
            req.session = SessionManager.generate({
                id: user.id,
                email: user.email
            });
        } catch (ex) {
            console.log(ex);
        }

        res.status(201).send();
    });

export {router as signupRouter};