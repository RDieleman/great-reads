import Link from "next/link";

export default ({currentUser}) => {
    return <nav className="navbar navbar-expand-sm navbar-dark bg-dark">
        <div className="container d-flex flex-row align-items-end w-100">
            <Link className="fw-bold navbar-brand flex-shrink-1 font-monospace text-uppercase" href="/">gr</Link>
            <Link
                className="justify-content-end gap-1 navbar-nav fs-6 fw-lighter flex-fill hstack text-light text-decoration-none"
                href="https://books.google.com">powered
                by <span> Google Books</span></Link>
        </div>
    </nav>
};