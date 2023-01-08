import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import {validateRequest} from "../middlewares/validate-request";
import {BadRequestError} from "../errors/bad-request-error";
import {SessionManager} from "../services/session-manager";
import {AccountCreatedPublisher} from "../events/account_created/account-created-publisher";
import {natsWrapper} from "../nats-wrapper";

const commonPasswordList = require('../../common-passwords.json');

const router = express.Router();

router.post(
    '/api/users/public/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Email must be valid.'),
        body('password')
            .isLength({min: 12, max: 64})
            .withMessage('Password must be between 12 and 64 characters.'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {email, password} = req.body;

        // // Verify password security;
        const isBadPassword = commonPasswordList.includes(password);
        if (isBadPassword) {
            throw new BadRequestError("Bad password.");
        }

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
            console.error('Failed to create session.');
        }

        res.status(201).send();
    });

export {router as signupRouter};