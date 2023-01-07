import express from 'express';
import {TokenRevokedPublisher} from "../events/token_revoked/token-revoked-publisher";
import {natsWrapper} from "../nats-wrapper";
import {currentUser} from "../middlewares/current-user";

const router = express.Router();

router.post('/api/users/signout', currentUser, async (req, res) => {
    req.session = null;

    if (req.currentUser) {
        await new TokenRevokedPublisher(natsWrapper.client).publish({
            userId: req.currentUser.userInfo.id,
            at: 123
        });
    }

    res.send({});
});

export {router as signoutRouter};