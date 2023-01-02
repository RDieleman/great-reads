import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountDeletedEvent} from "./account-deleted-event";
import {Timeline} from "../../models/Timeline";

export class AccountDeletedListener extends Listener<AccountDeletedEvent> {
    queueGroupName = 'timeline-service';
    readonly subject = Subjects.ACCOUNT_DELETED;

    async onMessage(data: AccountDeletedEvent['data'], msg: Message): Promise<void> {
        await Timeline.findOneAndDelete({userId: data.userId});
        console.log('Timeline deleted', data.userId);
        msg.ack();
    }
}