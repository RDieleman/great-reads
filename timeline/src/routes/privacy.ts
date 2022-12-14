import express, {Request, Response} from 'express';

const usageReport = require("../../personal-data-usage.json");

const router = express.Router();

router.get(
    '/api/timeline/public/privacy',
    async (req: Request, res: Response) => {
        res.status(200).send(usageReport);
    });

export {router as privacyRouter};