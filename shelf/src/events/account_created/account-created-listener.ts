import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {AccountCreatedEvent} from "./account-created-event";
import {User} from "../../models/user";

export class AccountCreatedListener extends Listener<AccountCreatedEvent> {
    queueGroupName = 'shelf-service';
    readonly subject = Subjects.ACCOUNT_CREATED;

    async onMessage(data: AccountCreatedEvent['data'], msg: Message): Promise<void> {
        const shelves = await User.build({
            read: [], reading: [], wantToRead: [],
            userId: data.userId
        });

        await shelves.save();

        console.log('Shelves created for new user:', data.userId);
        msg.ack();
    }
}