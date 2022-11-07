import {Listener, TokensRevokedEvent} from "@greatreads/common";
import {Subjects} from "@greatreads/common/";
import {Message} from "node-nats-streaming";

export class TokensRevokedListener extends Listener<TokensRevokedEvent> {
    queueGroupName = 'auth-service';
    readonly subject = Subjects.TOKENS_REVOKED;

    onMessage(data: TokensRevokedEvent['data'], msg: Message): void {
        console.log('Tokens revoked for user', data.userId);
        msg.ack();
    }
}