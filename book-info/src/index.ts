import {app} from "./app";
import {TokenRevokedListener} from "./events/token_revoked/token-revoked-listener";
import {natsWrapper} from "./nats-wrapper";

const start = async () => {
    // Verify environment variables
    if (!process.env.JWT_KEY) {
        throw new Error('JWT_KEY must be defined');
    }
    if (!process.env.COOKIE_KEY) {
        throw new Error('COOKIE_KEY must be defined');
    }
    if (!process.env.REDIS_URL) {
        throw new Error('REDIS_URL must be defined');
    }
    if (!process.env.NATS_URL) {
        throw new Error('NATS_URL must be defined')
    }
    if (!process.env.NATS_CLIENT_ID) {
        throw new Error('NATS_CLIENT_ID must be defined')
    }
    if (!process.env.NATS_CLUSTER_ID) {
        throw new Error('NATS_URL must be defined')
    }

    // Connect to NATS
    try {
        await natsWrapper.connect(
            process.env.NATS_CLUSTER_ID,
            process.env.NATS_CLIENT_ID,
            process.env.NATS_URL
        );

        // Shut down gracefully in case of process exit.
        natsWrapper.client.on('close', () => {
            console.log('NATS connection closed');
            process.exit();
        })
        process.on('SIGINT', () => natsWrapper.client.close());
        process.on('SIGTERM', () => natsWrapper.client.close());

        // Start listeners
        new TokenRevokedListener(natsWrapper.client).listen();
    } catch (err) {
        console.log(err);
    }

    // Start API.
    app.listen(3000, () => {
        console.log("Listening on port 3000.");
    });
};

start().then(() => console.log("App started."));