import jwt from "jsonwebtoken";
import {redisWrapper} from "../redis-wrapper";

interface Session {
    jwt: string;
}

interface UserInfo {
    id: string;
    email: string;
}

interface Token {
    userInfo: UserInfo;
    iat: number;
}

class SessionManager {
    private static stateStore = redisWrapper;

    static async getToken(session: Session): Promise<Token | null> {
        try {
            // Decode the token.
            const token = jwt.verify(session.jwt, process.env.JWT_KEY!) as Token;
            const wasInvalidated = await this.stateStore.wasInvalidated(token);
            if (wasInvalidated) {
                return null;
            }

            return token;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

export {SessionManager, Session, UserInfo, Token};