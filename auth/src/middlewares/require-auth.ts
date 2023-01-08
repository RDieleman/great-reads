import {NextFunction, Request, Response} from "express";
import {NotAuthorizedError} from "../errors/not-authorized-error";
import {Session, SessionManager, Token} from "../services/session-manager";

declare global {
    namespace Express {
        interface Request {
            currentUser?: Token
        }
    }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    // Public endpoints don't require authentication.
    const inPublicEndpoint = req.path.startsWith('/api/users/public');

    let currentUser;

    // If present, attempt to get user from session.
    if (req.session && req.session.jwt) {
        try {
            const token = await SessionManager.getToken(req.session as Session);
            if (token != null) {
                currentUser = token;
            }
        } catch (ex) {
            console.error(ex);
        }
    }

    // Set current user in request.
    req.currentUser = currentUser;

    const isAuthenticated = currentUser !== undefined;

    // Authentication always required, unless in a public endpoint.
    if (isAuthenticated || inPublicEndpoint) {
        return next();
    }
    throw new NotAuthorizedError();
}