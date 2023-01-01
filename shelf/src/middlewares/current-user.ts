import {NextFunction, Request, Response} from "express";
import {Session, SessionManager, Token} from "../services/session-manager";

declare global {
    namespace Express {
        interface Request {
            currentUser?: Token
        }
    }
}

export const currentUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (!req.session?.jwt) {
        return next();
    }

    try {
        const token = SessionManager.getToken(req.session as Session);
        if (token != null) {
            req.currentUser = token;
        }
    } catch (err) {
        console.log("Failed to get user from session: ", req.session);
    }

    next();
}