import {Publisher} from "../base-publisher";
import {Subjects} from "../subjects";
import {AccountCreatedEvent} from "./account-created-event";

export class AccountCreatedPublisher extends Publisher<AccountCreatedEvent> {
    readonly subject = Subjects.ACCOUNT_CREATED;
}