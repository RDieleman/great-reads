import {Token} from "./services/session-manager";
import Redis from "ioredis";

interface TokenStateStore {
    wasInvalidated: (token: Token) => Promise<boolean>;
}

class RedisWrapper implements TokenStateStore {
    private _client;

    constructor() {
        this._client = new Redis(process.env.REDIS_URL!);
        console.log("Connected to Redis.")
    }

    async wasInvalidated(token: Token): Promise<boolean> {
        // Find potential invalidation entry.
        const entry = await this._client.get(token.userInfo.id).then((e) => {
            return e;
        });
        if (entry == null) {
            return false;
        }

        console.log("Entry: ", entry);

        console.log("Comparing", token.iat);
        console.log("And ", parseInt(entry));
        console.log("result", token.iat < parseInt(entry));

        // See if token was issued before invalidation.
        return token.iat < parseInt(entry);
    }
}

export const redisWrapper = new RedisWrapper();