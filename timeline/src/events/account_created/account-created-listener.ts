import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountCreatedEvent} from "./account-created-event";
import {Timeline} from "../../models/Timeline";

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
    queueGroupName = 'timeline-service';
    readonly subject = Subjects.ACCOUNT_CREATED;

    async onMessage(data: AccountCreatedEvent['data'], msg: Message): Promise<void> {
        const timeline = await Timeline.build({
            shelfEvents: [],
            userId: data.userId
        });

        await timeline.save();

        console.log('Timeline created for new user:', data.userId);
        msg.ack();
    }
}