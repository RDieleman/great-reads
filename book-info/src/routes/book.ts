import express, {Request, Response} from 'express';
import {query} from "express-validator";
import {validateRequest} from "../middlewares/validate-request";
import {BookService} from "../services/book-service";

const router = express.Router();

router.get(
    '/api/book-info/search',
    query("term").isString().isLength({min: 1, max: 40}),
    query("pageIndex").isInt({min: 0}),
    query("pageItems").isInt({min: 1, max: 40}),
    validateRequest,
    async (req: Request, res: Response) => {
        const {term, pageIndex, pageItems} = req.query;

        const result = await BookService.search(
            term as string, {
                index: pageIndex as unknown as number,
                items: pageItems as unknown as number
            });

        res.status(200).send(result);
    });

router.get(
    '/api/book-info/volume',
    query("id").isString().notEmpty(),
    validateRequest,
    async (req: Request, res: Response) => {
        const {id} = req.query;

        const result = await BookService.getVolume(id as string);
        res.status(200).send(result);
    });

export {router as bookRouter};