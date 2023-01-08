import {ShelfType} from "../../components/shelf";
import {Image} from "react-bootstrap";
import {getImageUrlFromBook} from "../../utility/book";
import Router from "next/router";
import {formatDateString} from "../../utility/date";
import DashboardLayout from "../../components/layouts/dashboard";
import {useEffect, useRef, useState} from "react";
import axios from "axios";
import Loader from "../../components/loader";
import {useAppContext} from "../_app";
import useRouter from "../../hooks/use-router";

const DashboardComponent = (props) => {
    const state = useAppContext();
    const [isLoading, setIsLoading] = useState(true);
    const [shelfEvents, setShelfEvents] = useState({});
    const [pageIndex, setPageIndex] = useState(0);
    const books = useRef({});

    useEffect(() => {
        const retrieveEvents = async () => {
            setIsLoading(true);

            try {
                const res = await axios.get(`/api/timeline?index=${pageIndex}&items=25`);

                res.data.shelfEvents.forEach((e) => {
                    books.current[e.bookId] = null;
                });

                await Promise.all(
                    Object.keys(books.current).map((bookId) => {
                        return axios.get("/api/book-info/volume?id=" + bookId).then((res) => {
                            books.current[bookId] = res.data;
                        });
                    })
                );
                setShelfEvents((previousEvents) => previousEvents[pageIndex] = res.data.shelfEvents);
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        retrieveEvents();
    }, [pageIndex]);


    if (!state.user) {
        return useRouter().push('/');
    }

    if (isLoading) {
        return <Loader/>
    }

    const handleItemClick = (id) => {
        Router.push("/dashboard/book/" + id);
    }

    let events = [];
    Object.keys(shelfEvents).forEach((key) => {
        events = events.concat(shelfEvents[key]);
    });

    return <>
        <div
            className="pt-2 pb-2 container d-flex h-100 flex-column gap-3 font-monospace overflow-auto justify-content-start align-items-center">
            {
                events.length < 1 ?
                    (<div className="d-flex h-100 justify-content-center align-items-center">
                        <label className="font-monospace">Your timeline is empty.</label>
                    </div>)
                    :
                    events.map((e) => {
                        const book = books.current[e.bookId];

                        let action;

                        switch (e.targetShelf) {
                            case ShelfType.read.id:
                                action = <span>You finished reading <strong>{book.title}</strong>!</span>
                                break;
                            case ShelfType.reading.id:
                                action = <span>You started reading <strong>{book.title}</strong>!</span>
                                break;
                            case ShelfType.wantToRead.id:
                                action = <span><strong>{book.title}</strong> was added to your wishlist.</span>
                                break;
                            default:
                                return null;
                        }

                        return (
                            <div
                                key={e.id}
                                className="container p-2 rounded border bg-light row h-auto gap-3"
                                style={{cursor: "pointer"}}
                                onClick={() => handleItemClick(book.id)}
                            >
                                <div className="p-0 col-6 vstack justify-content-between gap-1">
                                    {action}
                                    <hr className="mt-0 mb-0"/>
                                    <span className="text-muted">{formatDateString(e.date)}</span>
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

DashboardComponent.PageLayout = DashboardLayout;

export default DashboardComponent;