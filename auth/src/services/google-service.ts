import {OAuth2Client} from "google-auth-library";


export class GoogleService {
    private static client = new OAuth2Client(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET
    );

    static async getUserInfo(token: string) {
        const ticket = await GoogleService.client.verifyIdToken({
            idToken: token,
            audience: process.env.CLIENT_ID,
        }).catch((err) => {
            console.error('Failed to verify Google token', token);
            return null;
        });

        const payload = ticket?.getPayload();

        if (!payload) {
            return;
        }

        const id = payload['sub'];
        return {
            id,
            "email": payload['email'],
            "name": payload['name'],
            "picture_url": payload['picture']
        }
    }
}