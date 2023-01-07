import {useEffect, useRef, useState} from "react";
import * as queryString from "querystring";
import {Image, InputGroup} from "react-bootstrap";
import {Search} from "react-bootstrap-icons";
import {getImageUrlFromBook} from "../../utility/book";
import DashboardLayout from "../../components/layouts/dashboard";
import Loader from "../../components/loader";
import axios from "axios";
import {useAppContext} from "../_app";
import useRouter from "../../hooks/use-router";
import Router from "next/router";

const SearchComponent = () => {
    const state = useAppContext();
    const [fetching, setFetching] = useState(false);
    const [error, setError] = useState(null);
    const listRef = useRef(null);

    useEffect(() => {
        try {
            listRef.current.scrollTop = state.searchScrollLocation;
        } catch (err) {
            console.error(err);
        }

    }, []);


    useEffect(() => {
        if (!state.searchTerm) {
            state.setSearchTerm('');
            state.setSearchItems({});
            state.setSearchScrollLocation(0);

            return;
        }
        fetchBooks();
    }, [state.searchIndex]);

    if (!state.user) {
        return useRouter().push('/');
    }

    const getQueryString = () => {
        const base = "/api/book-info/search";
        const params = {
            term: state.searchTerm,
            pageIndex: state.searchIndex,
            pageItems: 25
        };

        return base + "?" + queryString.stringify(params);
    }

    const fetchBooks = async () => {
        if (!state.searchTerm) {
            state.setSearchTerm('');
            state.setSearchItems({});
            state.setSearchScrollLocation(0);
            state.setSearchIndex(0);

            return;
        }

        setFetching(true);
        try {
            const res = await axios.get(getQueryString());
            if (res.status !== 200) {
                setError('Search request failed. Please try again.');
                return;
            }
            state.setSearchItems(prevState => prevState[state.searchIndex] = res.data.results);
        } finally {
            setFetching(false);
        }
    }

    const handleItemClick = (id) => {
        return Router.push("/dashboard/book/" + id);
    }

    let list = [];
    Object.values(state.searchItems).forEach((page) => {
        list = list.concat(page);
    });

    return <>
        <div className="container d-grid gap-2 mb-3 mt-3">
            <InputGroup>
                <input
                    type="search"
                    className="form-control"
                    id="searchInput"
                    value={state.searchTerm}
                    onChange={(e) => state.setSearchTerm(e.target.value)}
                    placeholder="Search..."
                    autoFocus
                />
                <button
                    className="btn btn-primary w-25 h-auto"
                    type="button"
                    onClick={() => {
                        state.setSearchIndex(0);
                        state.setSearchItems({});
                        fetchBooks();
                    }}
                    disabled={fetching}
                >
                    <Search className="h-100 w-auto" color="white"/>
                </button>
            </InputGroup>
        </div>
        <hr className="p-0 m-0"/>
        <div ref={listRef} className="container flex-column d-flex flex-fill overflow-auto gap-3 pt-2 pb-2"
             onScroll={(e) => {
                 state.setSearchScrollLocation(e.target.scrollTop);
             }
             }>
            {list.length < 1 ?
                (fetching ? (
                        <Loader/>
                    ) : (
                        <div className="d-flex h-100 justify-content-center align-items-center">
                            <label className="font-monospace">No results.</label>
                        </div>)
                )
                :
                list.map((item) => {
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
                                {item.authors &&
                                    <label className="opacity-75">{item.authors.join(", ")}</label>}
                            </div>
                        </div>

                    </div>)
                })
            }
            {(list.length > 0 && fetching) ? (
                <Loader/>
            ) : null}
            {list.length > 0 && (<button
                className="btn btn-secondary"
                onClick={async () => {
                    state.setSearchIndex((index) => index + 1);
                }}
                disabled={fetching}
            >
                Load More
            </button>)}
        </div>
    </>
}

SearchComponent.PageLayout = DashboardLayout;

export default SearchComponent;