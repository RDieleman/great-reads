import express, {Request, Response} from 'express';
import {query} from "express-validator";
import {validateRequest} from "../middlewares/validate-request";
import {currentUser} from "../middlewares/current-user";
import {BookService} from "../services/book-service";
import {requireAuth} from "../middlewares/require-auth";

const router = express.Router();

router.get(
    '/api/book-info/search',
    query("term").isString().isLength({min: 1, max: 40}),
    query("pageIndex").isInt({min: 0}),
    query("pageItems").isInt({min: 1, max: 40}),
    currentUser,
    requireAuth,
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
    currentUser,
    requireAuth,
    validateRequest,
    async (req: Request, res: Response) => {
        const {id} = req.query;

        console.log(">>>>>>>>", id);

        const result = await BookService.getVolume(id as string);
        res.status(200).send(result);
    });

export {router as bookRouter};