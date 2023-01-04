export const getImageUrlFromBook = (book) => {
    const imageTypes = Object.keys(book.imageLinks);

    if (imageTypes.length < 1) {
        return null;
    }

    let index = imageTypes.indexOf("thumbnail");

    if (index < 0) {
        index = 0;
    }

    return Object.values(book.imageLinks)[index];
}

export const getAuthorNames = (book) => {
    if (!book.authors || book.authors.length < 1) {
        return "No authors found."
    }

    return book.authors.join(", ");
}