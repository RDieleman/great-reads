import {Dropdown, Image} from "react-bootstrap";
import {getAuthorNames, getImageUrlFromBook} from "../../../utility/book";
import Rating from "../../../components/rating";
import DOMPurify from 'isomorphic-dompurify';
import {ShelfType} from "../../../components/shelf";
import useRequest from "../../../hooks/use-request";
import {useEffect, useRef, useState} from "react";
import DashboardLayout from "../../../components/layouts/dashboard";
import axios from "axios";
import Loader from "../../../components/loader";
import {useAppContext} from "../../_app";
import useRouter from "../../../hooks/use-router";

const BookComponent = (props) => {
    let {bookId} = props;

    const state = useAppContext();

    const firstRender = useRef(true);
    const secondRender = useRef(true);

    const [loading, setLoading] = useState(true);

    const book = useRef();

    const [selectedType, setSelectedType] = useState(null);
    const [moveBook, moveBookErrors] = useRequest({
        url: "/api/shelf",
        method: "post",
        body: {
            bookId,
            shelfType: selectedType?.id
        }
    });

    useEffect(() => {
        const fetchBook = async () => {
            setLoading(true);
            try {
                let res = await axios.get("/api/book-info/volume?id=" + bookId);

                if (res.status !== 200) {
                    return await signOut();
                }

                book.current = res.data;

                res = await axios.get("/api/shelf");
                const shelves = res.data;

                let shelvedBook = shelves.books[book.current.id];

                let currentType = (!shelvedBook) ? ShelfType.none : Object.values(ShelfType).find((type) => {
                    return shelvedBook === type.id;
                });

                setSelectedType(currentType);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }

        }
        fetchBook();
    }, [])

    useEffect(() => {
        // Ignore initial render.
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }

        if (secondRender.current) {
            secondRender.current = false;
            return;
        }

        async function shelfBook() {
            try {
                setLoading(true);
                await moveBook();
            } catch (ex) {
                console.error(ex);
            } finally {
                setLoading(false);
            }
        }

        shelfBook();
    }, [selectedType]);

    if (!state.user) {
        return useRouter().push('/');
    }

    if (loading) {
        return <Loader/>;
    }

    return <>
        <div className="flex-column d-flex flex-fill overflow-auto gap-3">
            <div
                className="d-flex justify-content-center align-items-center w-100 h-50 pt-4 pb-4 bg-dark bg-opacity-25">
                <Image className="h-100 w-auto shadow rounded" src={getImageUrlFromBook(book.current) || "#"}/>
            </div>
            <div className="font-monospace container d-flex flex-column justify-content-start align-items-center gap-0">
                <div className="fw-semibold fs-2">{book.current.title || "Unknown"}</div>
                {book.current.subtitle && <div className="fs-4">{book.current.subtitle}</div>}
                <div className="text-muted">by {getAuthorNames(book.current)}</div>
                <hr className="w-100"/>
                <Rating book={book.current}/>
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
                    </Dropdown.Menu>
                </Dropdown>
                <hr className="w-100"/>
                <div className="container d-flex flex-column justify-content-start align-items-center gap-2">
                    <div className="fw-semibold fs-2">{"Description"}</div>
                    {book.current.description ?
                        <div className="text-center"
                             dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(book.current.description)}}/>
                        :
                        <div>No description found.</div>}
                </div>

            </div>
        </div>
    </>
}

BookComponent.getInitialProps = async (context, client, currentUser) => {
    const {bookId} = context.query;

    const props = {
        bookId
    }

    return props;
}

BookComponent.PageLayout = DashboardLayout;

export default BookComponent;