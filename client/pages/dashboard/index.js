import useRouter from "../../hooks/use-router";
import buildClient from "../../api/build-client";
import {ShelfType} from "../../components/shelf";
import {Image} from "react-bootstrap";
import {getImageUrlFromBook} from "../../utility/book";
import Router from "next/router";
import {formatDateString} from "../../utility/date";

const DashboardComponent = (props) => {
    let {currentUser, shelfEvents, books} = props;

    const router = useRouter();

    if (!currentUser) {
        return router.push("/");
    }

    const handleItemClick = (id) => {
        Router.push("/dashboard/book/" + id);
    }

    return <div className="vstack overflow-hidden">
        <div
            className="pt-2 pb-2 container d-flex h-100 flex-column gap-3 font-monospace overflow-auto justify-content-start align-items-center">
            {
                shelfEvents.length < 1 ?
                    (<div className="d-flex h-100 justify-content-center align-items-center">
                        <label className="font-monospace">Your timeline is empty.</label>
                    </div>)
                    :
                    shelfEvents.map((e) => {
                        const book = books[e.bookId];

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
    </div>
}

DashboardComponent.getInitialProps = async (context, c, currentUser) => {
    // Fetch information about current user.
    const client = buildClient(context);
    const {data} = await client.get('/api/timeline?index=0&items=25');

    const books = {}
    data.shelfEvents.forEach((e) => {
        books[e.bookId] = null;
    });

    await Promise.all(
        Object.keys(books).map((bookId) => {
            return client.get("/api/book-info/volume?id=" + bookId).then((res) => {
                books[bookId] = res.data;
            });
        })
    );

    return {
        showMenu: true,
        books,
        ...data
    }
}

export default DashboardComponent;