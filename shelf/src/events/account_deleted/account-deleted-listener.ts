import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountDeletedEvent} from "./account-deleted-event";
import {User} from "../../models/user";

export class AccountDeletedListener extends Listener<AccountDeletedEvent> {
    queueGroupName = 'shelf-service';
    readonly subject = Subjects.ACCOUNT_DELETED;

    async onMessage(data: AccountDeletedEvent['data'], msg: Message): Promise<void> {
        await User.findOneAndDelete({userId: data.userId});
        console.log('Account deleted', data.userId);
        msg.ack();
    }
}