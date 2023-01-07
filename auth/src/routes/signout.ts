import express from 'express';
import {currentUser} from "../middlewares/current-user";
import {SessionManager} from "../services/session-manager";

const router = express.Router();

router.post('/api/users/signout', currentUser, async (req, res) => {
    req.session = null;

    if (req.currentUser) {
        await SessionManager.invalidate(req.currentUser.userInfo.id);
    }

    res.send({});
});

export {router as signoutRouter};