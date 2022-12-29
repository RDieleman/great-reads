import express from 'express';
import {natsWrapper} from "../nats-wrapper";
import {User} from "../models/user";
import {AccountDeletedPublisher} from "../events/account_deleted/account-deleted-publisher";
import {currentUser} from "../middlewares/current-user";
import {requireAuth} from "../middlewares/require-auth";

const router = express.Router();

router.delete('/api/users', currentUser, requireAuth, async (req, res) => {
    // Delete the account.
    await User.findByIdAndDelete(req.currentUser?.userInfo.id);

    // Publish deletion event.
    await new AccountDeletedPublisher(natsWrapper.client).publish({
        userId: req.currentUser!.userInfo.id,
    });

    // Delete cookie
    req.session = null;

    res.status(200).send();
});

export {router as deleteRouter};