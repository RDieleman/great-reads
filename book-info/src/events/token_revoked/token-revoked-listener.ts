import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {TokenRevokedEvent} from "./token-revoked-event";
import {Subjects} from "../subjects";

export class TokenRevokedListener extends Listener<TokenRevokedEvent> {
    queueGroupName = 'auth-service';
    readonly subject = Subjects.TOKEN_REVOKED;

    onMessage(data: TokenRevokedEvent['data'], msg: Message): void {
        console.log('Token revoked for user', data.userId);
        msg.ack();
    }
}