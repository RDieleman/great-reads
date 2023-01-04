import useRouter from "../../../hooks/use-router";
import {Dropdown, Image} from "react-bootstrap";
import {getAuthorNames, getImageUrlFromBook} from "../../../utility/book";
import Rating from "../../../components/rating";
import DOMPurify from 'isomorphic-dompurify';
import {ShelfType} from "../../../components/shelf";
import useRequest from "../../../hooks/use-request";
import {useEffect, useRef, useState} from "react";

const BookComponent = (props) => {
    let {currentUser, book, shelf} = props;

    const router = useRouter();

    if (!currentUser) {
        return router.push("/");
    }

    const firstRender = useRef(true);

    const [loading, setLoading] = useState(false);

    const [selectedType, setSelectedType] = useState(shelf);
    const [moveBook, moveBookErrors] = useRequest({
        url: "/api/shelf",
        method: "post",
        body: {
            bookId: book.id,
            shelfType: selectedType?.id
        }
    });

    const [deleteBook, deleteBookErrors] = useRequest({
        url: "/api/shelf",
        method: "delete",
        body: {
            bookId: book.id
        }
    });

    useEffect(() => {
        // Ignore initial render.
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        async function shelfBook() {
            try {
                setLoading(true);
                if (selectedType) {
                    await moveBook();
                } else {
                    await deleteBook();
                }
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

        shelfBook();
    }, [selectedType]);

    return <div className="text-center flex-column d-flex flex-fill overflow-hidden">
        <div className="flex-column d-flex flex-fill overflow-auto gap-3">
            <div
                className="d-flex justify-content-center align-items-center w-100 h-50 pt-4 pb-4 bg-dark bg-opacity-25">
                <Image className="h-100 w-auto shadow rounded" src={getImageUrlFromBook(book) || "#"}/>
            </div>
            <div className="font-monospace container d-flex flex-column justify-content-start align-items-center gap-0">
                <div className="fw-semibold fs-2">{book.title || "Unknown"}</div>
                {book.subtitle && <div className="fs-4">{book.subtitle}</div>}
                <div className="text-muted">by {getAuthorNames(book)}</div>
                <hr className="w-100"/>
                <Rating book={book}/>
                <hr className="w-100"/>
                <Dropdown className="d-flex flex-column align-items-stretch w-100">
                    <Dropdown.Toggle variant="secondary">
                        Bookshelves
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="w-100" variant="dark">
                        {
                            Object.values(ShelfType).map((type) => {
                                return (
                                    <Dropdown.Item
                                        active={selectedType && type.id === selectedType.id}
                                        onClick={() => setSelectedType(type)}
                                    >
                                        {type.value}
                                    </Dropdown.Item>
                                )
                            })
                        }
                        <Dropdown.Item
                            active={!selectedType}
                            onClick={() => setSelectedType(undefined)}
                        >
                            None
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <hr className="w-100"/>
                <div className="container d-flex flex-column justify-content-start align-items-center gap-2">
                    <div className="fw-semibold fs-2">{"Description"}</div>
                    {book.description ?
                        <div className="text-center"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(book.description)}}/>
                        :
                        <div>No description found.</div>}
                </div>

            </div>
        </div>
    </div>
}

BookComponent.getInitialProps = async (context, client, currentUser) => {
    const {bookId} = context.query;
    let res = await client.get("/api/book-info/volume?id=" + bookId);
    const book = res.data;

    res = await client.get("/api/shelf");
    const shelves = res.data;

    let currentType = Object.values(ShelfType).find((type) => {
        return shelves[type.id].includes(book.id);
    });

    const props = {
        showMenu: true,
        book,
        shelf: currentType
    }

    return props;
}

export default BookComponent;