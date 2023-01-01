interface BookInfo {
    id: string;
    title: string;
    subtitle: string;
    authors: string;
    publisher: string;
    description: string;
    pageCount: number;
    averageRating: string;
    ratingCount: string;
    language: string;
    imageLinks: Record<BookImageSize, string>
}

enum BookImageSize {
    THUMBNAIL_SMALL = "smallThumbnail",
    THUMBNAIL = "thumbnail",
    SMALL = "small",
    MEDIUM = "medium",
    LARGE = "large",
    EXTRA_LARGE = "extraLarge"
}

export {BookInfo, BookImageSize}