import express, {Request, Response} from 'express';
import {body} from 'express-validator';
import {User} from "../models/user";
import {validateRequest} from "../middlewares/validate-request";
import {BadRequestError} from "../errors/bad-request-error";
import {SessionManager} from "../services/session-manager";
import {PasswordManager} from "../services/password-manager";

const commonPasswordList = require('../../common-passwords.json');

const router = express.Router();

router.post(
    '/api/users/update/password',
    [
        body('oldPassword')
            .isString()
            .notEmpty()
            .withMessage('Current password is required.'),
        body('newPassword')
            .isString()
            .isLength({min: 12, max: 64})
            .withMessage('New password must be between 12 and 64 characters.'),
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const {oldPassword, newPassword} = req.body;

        // Verify password security;
        const isBadPassword = commonPasswordList.includes(newPassword);
        if (isBadPassword) {
            throw new BadRequestError("Bad password.");
        }

        let user;
        try {
            // Verify old password
            user = await User.findOne({id: req.currentUser!.userInfo!.id});
            if (!user) {
                throw new Error('User not found.');
            }
            const passwordsMatch = await PasswordManager.compare(user.password, oldPassword);
            if (!passwordsMatch) {
                throw new Error('Invalid Password.');
            }

            // Store new password
            user.password = newPassword;
            await user.save();
        } catch (ex) {
            throw new BadRequestError('Invalid credentials.')
        }

        try {
            // Revoke old sessions.
            await SessionManager.invalidate(req.currentUser!.userInfo.id);

            // Generate new session.
            req.session = SessionManager.generate({
                id: user.id,
                email: user.email
            });
        } catch (ex) {
            console.error(ex);
        }

        res.status(200).send();
    });

export {router as updateRouter};