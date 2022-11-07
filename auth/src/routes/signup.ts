import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import {BadRequestError, SessionManager, validateRequest} from "@greatreads/common/";

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

        // Generate session
        req.session = SessionManager.generate({
            id: user.id,
            email: user.email
        });

        res.status(201).send(user);
    });

export {router as signupRouter};