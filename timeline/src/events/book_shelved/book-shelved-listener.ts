import {Message} from "node-nats-streaming";
import {Listener} from "../base-listener";
import {Subjects} from "../subjects";
import {Timeline} from "../../models/Timeline";
import {BookShelvedEvent} from "./book-shelved-event";
import {NotFoundError} from "../../errors/not-found-error";

export class BookShelvedListener extends Listener<BookShelvedEvent> {
    queueGroupName = 'timeline-service';
    readonly subject = Subjects.BOOK_SHELVED;

    async onMessage(data: BookShelvedEvent['data'], msg: Message): Promise<void> {
        const timeline = await Timeline.findOne({userId: data.userId});
        if (!timeline) {
            throw new NotFoundError();
        }

        timeline.shelfEvents.push({
            bookId: data.bookId,
            targetShelf: data.targetShelf,
            date: new Date()
        })

        await timeline.save();

        console.log('Event added to timeline:', data);
        msg.ack();
    }
}