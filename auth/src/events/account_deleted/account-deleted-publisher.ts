import {Publisher} from "../base-publisher";
import {Subjects} from "../subjects";
import {AccountDeletedEvent} from "./account-deleted-event";

export class AccountDeletedPublisher extends Publisher<AccountDeletedEvent> {
    readonly subject = Subjects.ACCOUNT_DELETED;
}