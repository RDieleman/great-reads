import {Subjects} from "../subjects";

export interface AccountDeletedEvent {
    subject: Subjects.ACCOUNT_DELETED;
    data: {
        userId: string;
    };
}