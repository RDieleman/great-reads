import express from 'express';
import {SessionManager} from "../services/session-manager";

const router = express.Router();

router.post('/api/users/public/signout', async (req, res) => {
    req.session = null;

    if (req.currentUser) {
        await SessionManager.invalidate(req.currentUser.userInfo.id);
    }

    res.send({});
});

export {router as signoutRouter};