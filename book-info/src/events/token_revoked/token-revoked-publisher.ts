import {Publisher} from "../base-publisher";
import {TokenRevokedEvent} from "./token-revoked-event";
import {Subjects} from "../subjects";

export class TokenRevokedPublisher extends Publisher<TokenRevokedEvent> {
    readonly subject = Subjects.TOKEN_REVOKED;
}