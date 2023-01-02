import express, {Request, Response} from 'express';
import {currentUser} from "../middlewares/current-user";
import {requireAuth} from "../middlewares/require-auth";
import {query} from "express-validator";
import {validateRequest} from "../middlewares/validate-request";
import {Timeline} from "../models/Timeline";

const router = express.Router();

router.get(
    '/api/timeline',
    currentUser,
    requireAuth,
    query("index").isInt({min: 0}),
    query("items").isInt({min: 1, max: 40}),
    validateRequest,
    async (req: Request, res: Response) => {
        const {index, items} = req.query;
        let skip = Number(index) * Number(items);
        let limit = Number(items);

        let slice;

        if (skip === 0) {
            slice = limit * -1
        } else {
            slice = [(skip * -1) - limit, limit]
        }

        const timeline = await Timeline.findOne({
            userId: req.currentUser!.userInfo.id
        }, {
            shelfEvents: {
                $slice: slice
            }
        });

        //@ts-ignore
        timeline.shelfEvents.sort((a, b) => {
            //@ts-ignore
            return b.date - a.date;
        });

        res.status(200).send(timeline);
    });

export {router as timelineRouter};