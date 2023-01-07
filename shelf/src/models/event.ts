import mongoose from "mongoose";
import {ShelfType} from "./shelf";

interface ShelfMoveAttrs {
    userId: string;
    bookId: string;
    target: ShelfType;
    date: Date;
}

interface ShelfMoveDoc extends mongoose.Document {
    userId: string;
    bookId: string;
    target: ShelfType;
    date: Date;
}

interface ShelfMoveModel extends mongoose.Model<ShelfMoveDoc> {
    build(attrs: ShelfMoveAttrs): ShelfMoveDoc;
}

const shelfMoveSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    bookId: {
        type: String,
        required: true,
    },
    target: {
        type: String,
        required: true,
    },
    date: {
        type: mongoose.Schema.Types.Date,
        required: true,
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

shelfMoveSchema.statics.build = (attrs: ShelfMoveAttrs) => {
    return new ShelfMove(attrs);
}

const ShelfMove = mongoose.model<ShelfMoveDoc, ShelfMoveModel>('ShelfMove', shelfMoveSchema);

export {ShelfMove, ShelfMoveDoc}