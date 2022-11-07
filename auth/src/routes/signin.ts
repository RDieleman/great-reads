import express, {Request, Response} from 'express';
import {body, validationResult} from 'express-validator';
import {User} from "../models/user";
import {PasswordManager} from "../services/password-manager";
import {BadRequestError, RequestValidationError, validateRequest} from "@greatreads/common";
import {SessionManager} from "@greatreads/common/build/services/session-manager";

const router = express.Router();

router.post(
    '/api/users/signin',
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

        // Verify user exists.
        const user = await User.findOne({email: email});
        if (!user) {
            throw new BadRequestError("Invalid credentials.");
        }

        // Verify password.
        const passwordsMatch = await PasswordManager.compare(user.password, password);
        if (!passwordsMatch) {
            throw new BadRequestError("Invalid credentials.");
        }

        // Generate session.
        req.session = SessionManager.generate({
            id: user.id,
            email: user.email
        });

        res.status(200).send(user);
    });

export {router as signinRouter};