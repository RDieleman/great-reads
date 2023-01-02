import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

enum ShelfType {
    WANT_TO_READ = "wantToRead",
    READING = "reading",
    READ = "read"
}

interface ShelfEvent {
    bookId: string,
    targetShelf: ShelfType
    date: Date
}

interface TimelineAttrs {
    userId: string;
    shelfEvents: ShelfEvent[]
}

interface TimelineModel extends mongoose.Model<TimelineDoc> {
    build(attrs: TimelineAttrs): TimelineDoc;
}

interface TimelineDoc extends mongoose.Document {
    userId: string;
    shelfEvents: ShelfEvent[]
    version: number;
}

const timelineSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    shelfEvents: {
        type: [{
            bookId: {
                type: String,
                required: true
            },
            targetShelf: {
                type: String,
                required: true
            },
            date: {
                type: mongoose.Schema.Types.Date,
            }
        }],
        required: true,
        default: []
    },
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

timelineSchema.set("versionKey", "version");
timelineSchema.plugin(updateIfCurrentPlugin);

timelineSchema.statics.build = (attrs: TimelineAttrs) => {
    return new Timeline(attrs);
}
const Timeline = mongoose.model<TimelineDoc, TimelineModel>('Timeline', timelineSchema);

export {Timeline, TimelineDoc, ShelfType, ShelfEvent};