import {Subjects} from "../subjects";

export interface AccountCreatedEvent {
    subject: Subjects.ACCOUNT_CREATED;
    data: {
        userId: string;
    };
}