import express from 'express';
import {TokensRevokedPublisher} from "../events/publishers/tokens-revoked-publisher";
import {BadRequestError, currentUser} from "@greatreads/common/";
import {natsWrapper} from "@greatreads/common";

const router = express.Router();

router.post('/api/users/signout', currentUser, async (req, res) => {
    if (!req.currentUser) {
        throw new BadRequestError("Not authenticated.");
    }

    req.session = null;

    await new TokensRevokedPublisher(natsWrapper.client).publish({
        userId: req.currentUser.userInfo.id,
        at: 123
    });

    res.send({});
});

export {router as signoutRouter};