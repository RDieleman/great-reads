import {Subjects} from "../subjects";
import {ShelfType} from "../../models/user";

export interface BookShelvedEvent {
    subject: Subjects.BOOK_SHELVED;
    data: {
        userId: string;
        bookId: string;
        targetShelf: ShelfType
    };
}