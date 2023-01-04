import {BookImageSize, BookInfo} from "../models/book";
import * as queryString from "querystring";
import axios from "axios";
import {BadRequestError} from "../errors/bad-request-error";

let _ = require('lodash');

enum SearchField {
    TITLE = "intitle",
    AUTHOR = "inauthor",
    PUBLISHER = "inpublisher",
    CATEGORIES = "subject",
    ISBN = "isbn"
}

enum SearchFilter {
    CAN_PREVIEW = "partial",
    CAN_READ = "full",
    IS_EBOOK = "ebooks",
    IS_FREE_EBOOK = "free-ebooks",
    IS_PAID_EBOOK = "paid-ebooks",
}

enum SearchPrintType {
    ANY = "all",
    BOOK = "books",
    MAGAZINE = "magazines"
}

enum SearchSortBy {
    RELEVANCE = "relevance",
    NEWEST = "newest"
}

enum SearchProjection {
    FULL = "full",
    LITE = "lite"
}

interface SearchPageInfo {
    index: number;
    items: number;
}

interface SearchResult {
    totalItems: number;
    pageInfo: SearchPageInfo;
    results: BookInfo[];
}

class BookService {
    private static BASE_URL = "https://www.googleapis.com/books/v1";

    static search = async (term: string, pageInfo: SearchPageInfo, fields?: Record<SearchField, string>): Promise<SearchResult> => {
        if (fields) {
            for (let index = 0; index < Object.keys(fields).length; index++) {
                term += `+${Object.keys(fields)[index]}:${Object.values(fields)[index]}`;
            }
        }

        const params: Record<string, string | number> = {
            "q": term,
            "startIndex": pageInfo.index * pageInfo.items,
            "maxResults": pageInfo.items,
            "printType": SearchPrintType.BOOK,
            "projection": SearchProjection.FULL
        }

        const data = await this.sendRequest("/volumes", params);
        return {
            pageInfo,
            totalItems: data.totalItems,
            results: data.items.map((bookData: any) => this.parseBook(bookData))
        };
    }

    static getVolume = async (id: string): Promise<BookInfo> => {
        const data = await this.sendRequest("/volumes/" + id, {});
        return this.parseBook(data);
    }

    static sendRequest = async (
        path: string,
        params: Record<string, string | number>
    ) => {
        let url = this.BASE_URL + path;

        // Add API Key
        const API_KEY = process.env.API_KEY;
        if (API_KEY) {
            params.key = API_KEY;
        }

        if (params) {
            url += '?' + queryString.stringify(params);
        }

        return axios.get(url).then((res) => {
            if (res.status !== 200) {
                console.error(`Request to Google Books API failed with status code '${res.status}':`, res.data);
                throw new BadRequestError("An unexpected error occurred.");
            }

            return res.data;
        });
    }

    private static parseBook = (data: any): BookInfo => {
        let book = _.pick(data.volumeInfo, [
            "title",
            "subtitle",
            "authors",
            "description",
            "pageCount",
            "categories",
            "averageRating",
            "ratingsCount",
            "language"
        ]);

        _.extend(book, {
            id: data.id,
            imageLinks: _.pick(data.volumeInfo.imageLinks, Object.values(BookImageSize))
        })

        return book as BookInfo;
    }
}

export {SearchPageInfo, SearchField, BookService, SearchResult};
