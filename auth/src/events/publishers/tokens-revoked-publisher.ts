import {Publisher, TokensRevokedEvent} from "@greatreads/common";
import {Subjects} from "@greatreads/common/";

export class TokensRevokedPublisher extends Publisher<TokensRevokedEvent> {
    readonly subject = Subjects.TOKENS_REVOKED;
}