import useRouter from "../../hooks/use-router";
import useRequest from "../../hooks/use-request";
import {useEffect, useState} from "react";
import * as queryString from "querystring";
import {Image, InputGroup} from "react-bootstrap";
import {Search} from "react-bootstrap-icons";
import {getImageUrlFromBook} from "../../utility/book";
import Router from "next/router";

const SearchComponent = (props) => {
    let {currentUser} = props;

    const router = useRouter();

    if (!currentUser) {
        return router.push("/");
    }
    const [items, setItems] = useState([]);
    const [index, setIndex] = useState(0);
    const [term, setTerm] = useState('');
    const [fetching, setFetching] = useState(false);

    const getQueryString = () => {
        const base = "/api/book-info/search";
        const params = {
            term,
            pageIndex: index,
            pageItems: 25
        };

        return base + "?" + queryString.stringify(params);
    }

    const [doRequest, errors] = useRequest({
        url: getQueryString(),
        method: "get",
        onSuccess: (data) => {
            setItems(prevState => (prevState.concat(data.results)));
        }
    });

    useEffect(() => {
        async function fetchBooks() {
            setFetching(true);
            await doRequest();
            setFetching(false);
        }

        fetchBooks();
    }, [index]);

    const handleItemClick = (id) => {
        Router.push("/dashboard/book/" + id);
    }

    return <div className="flex-column d-flex flex-fill overflow-hidden">
        <div className="container d-grid gap-2 mb-3 mt-3">
            <InputGroup>
                <input
                    type="search"
                    className="form-control"
                    id="searchInput"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                />
                <button
                    className="btn btn-primary w-25 h-auto"
                    type="button"
                    onClick={() => {
                        setIndex(0);
                        setItems([]);
                        doRequest();
                    }}
                    disabled={fetching}
                >
                    <Search className="h-100 w-auto" color="white"/>
                </button>
            </InputGroup>
        </div>
        <hr className="p-0 m-0"/>
        <div className="container flex-column d-flex flex-fill overflow-auto gap-3 pt-2 pb-2">
            {items.length < 1 ?
                (<div className="d-flex h-100 justify-content-center align-items-center">
                    <label className="font-monospace">No results.</label>
                </div>)
                :
                items.map((item) => {
                    const imageUrl = getImageUrlFromBook(item) || "#";

                    return (<div
                        key={item.id}
                        className="enable font-monospace bg-light rounded p-2 border container gap-2"
                        style={{cursor: "pointer"}}
                        onClick={() => handleItemClick(item.id)}
                    >
                        <div className="row h-auto">
                            <div className="col w-100">
                                <Image className="w-100 rounded" src={imageUrl}/>
                            </div>
                            <div className="col-5 vstack gap-2">
                                <strong className="text-break">{item.title || "Unknown"}</strong>
                                {item.subtitle && <label className="fw-lighter">{item.subtitle}</label>}
                                <hr className="p-0 m-0"/>
                                {item.authors && <label className="opacity-75">{item.authors.join(", ")}</label>}
                            </div>
                        </div>

                    </div>)
                })
            }

            {items.length > 0 && (<button
                className="btn btn-secondary"
                onClick={async () => {
                    setIndex((index) => index + 1);
                }}
                disabled={fetching}
            >
                Load More
            </button>)}


            {/*{items.map((item) => {*/}
            {/*    const imageUrl = getImageUrl(item);*/}

            {/*    return (*/}
            {/*        <Card>*/}
            {/*            {imageUrl && <Card.Img variant="top" src={imageUrl}/>}*/}
            {/*            <Card.Body>*/}
            {/*                <Card.Title>{item.title || "Unknown"}</Card.Title>*/}
            {/*                {item.subtitle && <Card.Subtitle>{item.subtitle}</Card.Subtitle>}*/}
            {/*                {item.description && <Card.Text>{item.description}</Card.Text>}*/}
            {/*            </Card.Body>*/}
            {/*            {item.authors && <Card.Footer>{item.authors.join(', ')}</Card.Footer>}*/}
            {/*        </Card>*/}
            {/*    )*/}
            {/*})}*/}
        </div>
    </div>
}

SearchComponent.getInitialProps = async (context, c, currentUser) => {
    return {
        showMenu: true,
    }
}

export default SearchComponent;