import {Token} from "./services/session-manager";
import Redis from "ioredis";

interface TokenStateStore {
    invalidate: (userId: string) => void;
    wasInvalidated: (token: Token) => Promise<boolean>;
}

class RedisWrapper implements TokenStateStore {
    private _client;

    constructor() {
        this._client = new Redis(process.env.REDIS_URL!);
        console.log("Connected to Redis.")
    }

    async invalidate(userId: string) {
        const iat = Math.floor(new Date().getTime() / 1000);
        await this._client.set(userId, iat);
    }

    async wasInvalidated(token: Token): Promise<boolean> {
        // Find potential invalidation entry.
        const entry = await this._client.get(token.userInfo.id).then((e) => {
            return e;
        });

        if (entry == null) {
            return false;
        }

        // See if token was issued before invalidation.
        return token.iat < parseInt(entry);
    }
}

export const redisWrapper = new RedisWrapper();