import Header from "../header";

export default function AuthLayout({children}) {
    return (
        <>
            <Header/>
            <main className="d-flex w-100 h-100 justify-content-center align-items-center">{children}</main>
        </>
    )
}