import mongoose from "mongoose";
import {updateIfCurrentPlugin} from "mongoose-update-if-current";

enum ShelfType {
    WANT_TO_READ = "wantToRead",
    READING = "reading",
    READ = "read"
}

interface UserAttrs {
    userId: string;
    wantToRead: string[];
    reading: string[];
    read: string[];
}

interface UserModel extends mongoose.Model<UserDoc> {
    build(attrs: UserAttrs): UserDoc;
}

interface UserDoc extends mongoose.Document {
    userId: string;
    wantToRead: string[];
    reading: string[];
    read: string[];
    version: number;
}

const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    wantToRead: {
        type: [String],
        required: true,
        default: []
    },
    reading: {
        type: [String],
        required: true,
        default: []
    },
    read: {
        type: [String],
        required: true,
        default: []
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

userSchema.set("versionKey", "version");
userSchema.plugin(updateIfCurrentPlugin);

userSchema.statics.build = (attrs: UserAttrs) => {
    return new User(attrs);
}
const User = mongoose.model<UserDoc, UserModel>('User', userSchema);

export {User, UserDoc, ShelfType};