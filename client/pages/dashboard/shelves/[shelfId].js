import useRouter from "../../../hooks/use-router";
import Router from "next/router";
import {Image} from "react-bootstrap";
import {getAuthorNames, getImageUrlFromBook} from "../../../utility/book";

const ShelvesComponent = (props) => {
    let {currentUser, shelfId, books} = props;

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
    </div>
}

ShelvesComponent.getInitialProps = async (context, client, currentUser) => {
    const {shelfId} = context.query;
    let res = await client.get("/api/shelf");
    const shelves = res.data;

    const books = {}
    res.data[shelfId].forEach((bookId) => {
        books[bookId] = null;
    })

    await Promise.all(
        Object.keys(books).map((bookId) => {
            return client.get("/api/book-info/volume?id=" + bookId).then((res => {
                books[bookId] = res.data;
            }))
        })
    );

    return {
        showMenu: true,
        books,
        shelfId
    }
}

export default ShelvesComponent;