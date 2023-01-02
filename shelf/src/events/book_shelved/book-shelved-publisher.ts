import {Publisher} from "../base-publisher";
import {Subjects} from "../subjects";
import {BookShelvedEvent} from "./book-shelved-event";

export class BookShelvedPublisher extends Publisher<BookShelvedEvent> {
    readonly subject = Subjects.BOOK_SHELVED;
}