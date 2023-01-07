import useRouter from "../../../hooks/use-router";
import Router from "next/router";
import {Image} from "react-bootstrap";
import {getAuthorNames, getImageUrlFromBook} from "../../../utility/book";
import DashboardLayout from "../../../components/layouts/dashboard";
import {useEffect, useState} from "react";
import axios from "axios";
import Loader from "../../../components/loader";
import {useAppContext} from "../../_app";

const ShelvesComponent = (props) => {
    let {shelfId} = props;
    const state = useAppContext();

    const [books, setBooks] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                let res = await axios.get("/api/shelf");

                const books = {};
                const entries = Object.entries(res.data.books).filter((entry) => {
                    return entry[1] === shelfId
                });

                await Promise.all(
                    entries.map((entry) => {
                        return axios.get("/api/book-info/volume?id=" + entry[0]).then((res => {
                            books[entry[0]] = res.data;
                        }))
                    })
                );

                setBooks(books);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchBooks();
    }, [])

    const router = useRouter();

    if (!state.user) {
        return useRouter().push('/');
    }

    if (isLoading) {
        return <Loader/>
    }

    const handleItemClick = (id) => {
        Router.push("/dashboard/book/" + id);
    }

    return <>
        <div
            className="pt-2 pb-2 container d-flex h-100 flex-column gap-3 font-monospace overflow-auto justify-content-start align-items-center">
            {
                Object.keys(books).length < 1 ?
                    (<div className="d-flex h-100 justify-content-center align-items-center">
                        <label className="font-monospace">No books, yet.</label>
                    </div>)
                    :
                    Object.values(books).map((book) => {
                        return (
                            <div
                                key={book.id}
                                className="container p-2 rounded border bg-light row h-auto gap-3"
                                style={{cursor: "pointer"}}
                                onClick={() => handleItemClick(book.id)}
                            >
                                <div className="p-0 col-6 vstack justify-content-between gap-1">
                                    {book.title}
                                    <hr className="mt-0 mb-0"/>
                                    <span className="text-muted">{getAuthorNames(book)}</span>
                                </div>
                                <div className="p-0 col w-100 rounded">
                                    <Image className="w-100 rounded" src={getImageUrlFromBook(book) || "#"}/>
                                </div>
                            </div>
                        )
                    })}
        </div>
    </>
}

ShelvesComponent.getInitialProps = async (context, client, currentUser) => {
    const {shelfId} = context.query;

    return {
        shelfId
    }
}

ShelvesComponent.PageLayout = DashboardLayout;

export default ShelvesComponent;