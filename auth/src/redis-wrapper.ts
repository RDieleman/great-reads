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
        const iat = new Date().getTime();
        console.log('storing token: ', iat);
        await this._client.set(userId, iat);
    }

    async wasInvalidated(token: Token): Promise<boolean> {
        // Find potential invalidation entry.
        const entry = await this._client.get(token.userInfo.id);
        if (entry == null) {
            return false;
        }

        // See if token was issued before invalidation.
        return token.iat < parseInt(entry);
    }
}

export const redisWrapper = new RedisWrapper();