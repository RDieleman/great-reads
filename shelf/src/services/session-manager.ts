import jwt from "jsonwebtoken";

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
    static getToken(session: Session): Token | null {
        try {
            // Decode the token.
            return jwt.verify(session.jwt, process.env.JWT_KEY!) as Token;
        } catch (err) {
            return null;
        }
    }
}

export {SessionManager, Session, UserInfo, Token};