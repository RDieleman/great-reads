import express, {Request, Response} from 'express';
import {body} from "express-validator";
import {validateRequest} from "../middlewares/validate-request";
import {BookShelvedPublisher} from "../events/book_shelved/book-shelved-publisher";
import {natsWrapper} from "../nats-wrapper";
import {ShelfMove} from "../models/event";
import {ShelfType, Shelves} from "../models/shelf";

const router = express.Router();

router.get(
    '/api/shelf/',
    async (req: Request, res: Response) => {
        const {id} = req.currentUser!.userInfo

        // Create the default shelves.
        const shelves: Shelves = {
            userId: id,
            books: {}
        };

        // Find all events related to this user.
        let events = await ShelfMove.find({userId: id});
        if (!events) {
            events = [];
        }

        // Reconstruct shelves.
        events.forEach((event) => {
            shelves.books[event.bookId] = event.target;
        });

        // Remove non-shelved books.
        Object.keys(shelves.books).forEach((key) => {
            if (shelves.books[key] === ShelfType.NONE) {
                delete shelves.books[key];
            }
        })

        res.status(200).send(shelves);
    }
)

router.post(
    '/api/shelf/',
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
        const {bookId, shelfType} = req.body;

        console.log("Move", bookId);
        console.log("To", shelfType);
        console.log("for user: ", userId);

        const move = await ShelfMove.build({
            bookId,
            userId,
            target: shelfType,
            date: new Date()
        });

        await move.save();

        new BookShelvedPublisher(natsWrapper.client).publish({
            bookId: bookId,
            targetShelf: shelfType,
            userId: userId
        });

        res.status(200).send(move);
    });

export {router as shelfRouter};