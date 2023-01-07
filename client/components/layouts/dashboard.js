import Header from "../header";
import Menu from "../menu";

export default function DashboardLayout({children}) {
    return (
        <>
            <Header/>
            <main className="flex-column d-flex flex-fill overflow-hidden">{children}</main>
            <Menu/>
        </>
    )
}