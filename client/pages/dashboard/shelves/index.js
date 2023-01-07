import Router from "next/router";
import {ShelfType} from "../../../components/shelf";
import DashboardLayout from "../../../components/layouts/dashboard";
import {useAppContext} from "../../_app";
import useRouter from "../../../hooks/use-router";

const ShelvesComponent = (props) => {
    const state = useAppContext();

    if (!state.user) {
        return useRouter().push('/');
    }

    return <div className="container d-flex flex-column justify-content-center align-items-center w-100 h-100">
        {Object.values(ShelfType).map((type) => {
            return <button className="btn btn-secondary w-100 mb-2"
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

ShelvesComponent.PageLayout = DashboardLayout;

export default ShelvesComponent;