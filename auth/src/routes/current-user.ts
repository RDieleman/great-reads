import express from 'express';
import {currentUser} from "@greatreads/common/";

const router = express.Router();

router.get(
    '/api/users/me',
    currentUser,
    (req, res) => {
        res.status(200).send({"currentUser": req.currentUser || null});
    });

export {router as currentUserRouter};