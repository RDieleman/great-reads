import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountDeletedEvent} from "./account-deleted-event";
import {ShelfMove} from "../../models/event";

export class AccountDeletedListener extends Listener<AccountDeletedEvent> {
    queueGroupName = 'shelf-service';
    readonly subject = Subjects.ACCOUNT_DELETED;

    async onMessage(data: AccountDeletedEvent['data'], msg: Message): Promise<void> {
        let events = await ShelfMove.find({userId: data.userId});
        if (!events) {
            events = [];
        }

        await Promise.all(
            events.map(async (event) => {
                return event.remove();
            })
        );

        console.log('Events deleted for user', data.userId);
        msg.ack();
    }
}