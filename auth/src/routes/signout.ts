import express from 'express';
import {SessionManager} from "../services/session-manager";
import {currentUser} from "../middlewares/current-user";

const router = express.Router();

router.post('/api/users/signout', currentUser, async (req, res) => {
    req.session = null;

    if (req.currentUser && req.currentUser.valid) {
        await SessionManager.invalidate(req.currentUser.userInfo.id);
    }

    res.send({});
});

export {router as signoutRouter};