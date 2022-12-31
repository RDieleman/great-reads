import {Subjects} from "../subjects";

export interface TokenRevokedEvent {
    subject: Subjects.TOKEN_REVOKED;
    data: {
        userId: string;
        at: number;
    };
}