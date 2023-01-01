import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountDeletedEvent} from "./account-deleted-event";

export class AccountDeletedListener extends Listener<AccountDeletedEvent> {
    queueGroupName = 'shelf-service';
    readonly subject = Subjects.ACCOUNT_DELETED;

    onMessage(data: AccountDeletedEvent['data'], msg: Message): void {
        console.log('Account deleted', data.userId);
        msg.ack();
    }
}