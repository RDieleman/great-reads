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
    valid: boolean;
}

class SessionManager {
    private static stateStore = redisWrapper;

    static generate(userInfo: UserInfo): Session {
        return {
            jwt: jwt.sign(
                {
                    userInfo
                },
                process.env.JWT_KEY!
            )
        };
    }

    static async invalidate(userId: string): Promise<void> {
        console.log("invalidate called", userId);
        await this.stateStore.invalidate(userId);
    }

    static async getToken(session: Session): Promise<Token | null> {
        try {
            // Decode the token.
            const token = jwt.verify(session.jwt, process.env.JWT_KEY!) as Token;
            console.log("token: ", token);
            token.valid = !(await this.stateStore.wasInvalidated(token));

            return token;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

export {SessionManager, Session, UserInfo, Token};