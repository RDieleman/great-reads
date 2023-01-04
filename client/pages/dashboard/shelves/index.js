import useRouter from "../../../hooks/use-router";
import Router from "next/router";
import {ShelfType} from "../../../components/shelf";

const ShelvesComponent = (props) => {
    let {currentUser} = props;

    const router = useRouter();

    if (!currentUser) {
        return router.push("/");
    }

    return <div
        className="container justify-content-center align-items-center gap-2 flex-column d-flex flex-column flex-fill overflow-hidden">
        {Object.values(ShelfType).map((type) => {
            return <button className="btn btn-secondary w-100"
                           onClick={() => Router.push("/dashboard/shelves/" + type.id)}>
                {type.value}
            </button>
        })}
    </div>
}

ShelvesComponent.getInitialProps = async (context, client, currentUser) => {
    return {
        showMenu: true,
    }
}

export default ShelvesComponent;