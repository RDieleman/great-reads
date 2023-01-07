enum ShelfType {
    WANT_TO_READ = "wantToRead",
    READING = "reading",
    READ = "read",
    NONE = "none"
}

interface Shelves {
    userId: string;
    books: {
        [prop: string]: ShelfType
    }
}

export {ShelfType, Shelves};