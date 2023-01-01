import express, {Request, Response} from 'express';
import {currentUser} from "../middlewares/current-user";
import {requireAuth} from "../middlewares/require-auth";
import {body} from "express-validator";
import {ShelfType, User} from "../models/user";
import {validateRequest} from "../middlewares/validate-request";
import {NotFoundError} from "../errors/not-found-error";

const router = express.Router();

router.get(
    '/api/shelf/',
    currentUser,
    requireAuth,
    async (req: Request, res: Response) => {
        const {id} = req.currentUser!.userInfo
        const shelves = await User.findOne({userId: id});
        res.status(200).send(shelves);
    }
)

router.post(
    '/api/shelf/',
    currentUser,
    requireAuth,
    [
        body('bookId')
            .isString()
            .notEmpty(),
        body('shelfType')
            .isString()
            .isIn(Object.values(ShelfType))
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.userInfo.id;
        let shelves = await User.findOne({userId});

        if (!shelves) {
            throw new NotFoundError();
        }

        const {bookId, shelfType} = req.body;
        Object.values(ShelfType).forEach((type) => {
            const shelf = shelves![type] as string[];
            const index = shelf.indexOf(bookId);

            if (index > -1) {
                shelf.splice(index, 1);
            }

            if (type === shelfType) {
                shelf.push(bookId);
            }
        })

        shelves.save();

        res.status(200).send(shelves);
    });

router.delete(
    '/api/shelf/',
    currentUser,
    requireAuth,
    [
        body('bookId')
            .isString()
            .notEmpty()
    ],
    validateRequest,
    async (req: Request, res: Response) => {
        const userId = req.currentUser!.userInfo.id;
        let shelves = await User.findOne({userId});

        if (!shelves) {
            throw new NotFoundError();
        }

        const {bookId} = req.body;
        Object.values(ShelfType).forEach((type) => {
            const shelf = shelves![type] as string[];
            const index = shelf.indexOf(bookId);

            if (index > -1) {
                shelf.splice(index, 1);
            }
        })

        shelves.save();

        res.status(200).send(shelves);
    });

export {router as shelfRouter};