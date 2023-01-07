import {Spinner} from "react-bootstrap";

export default () => {
    return (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
            <Spinner className="" animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </div>
    );
}