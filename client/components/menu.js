import {Button, Modal, Nav, Navbar} from "react-bootstrap";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {useState} from "react";
import {
    Bookmarks,
    BoxArrowDownRight,
    House,
    List,
    Search,
    ShieldExclamation,
    XCircleFill,
    XLg
} from "react-bootstrap-icons";
import Router from "next/router";
import useRequest from "../hooks/use-request";
import CustomModal from "./modal";
import {useAppContext} from "../pages/_app";

export default () => {
    const state = useAppContext();
    const [showMenu, setShowMenu] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteAccount, deleteAccountErrors] = useRequest({
        url: '/api/users',
        method: 'delete',
        onSuccess: () => {
            state.setUser(null);
            Router.push('/')
        }
    });
    const [logout, logoutErrors] = useRequest({
        url: '/api/users/signout',
        method: 'post',
        onSuccess: () => {
            state.setUser(null);
            Router.push('/');
        }
    })
    const [showPrivacyModal, setShowPrivacyModal] = useState(false);

    return (
        <>
            <Navbar className="p-0" key="xxl" bg="dark" expand="xxl">
                <div className="hstack flex-grow-1" style={{borderRadius: "0", maxHeight: "45px"}}>
                    <Button variant="dark" className="h-100 btn container p-2 flex-grow-1"
                            onClick={() => Router.push("/dashboard")}
                    >
                        <House className="h-100 w-auto" color="white"/>
                    </Button>
                    <Button variant="dark" className="h-100 btn container p-2 flex-grow-1"
                            onClick={() => Router.push("/dashboard/shelves")}
                    >
                        <Bookmarks className="h-100 w-auto" color="white"/>
                    </Button>
                    <Button variant="dark" className="h-100 btn container p-2 flex-grow-1"
                            onClick={() => Router.push("/dashboard/search")}
                    >
                        <Search className="h-100 w-auto" color="white"/>
                    </Button>
                    <Button variant="dark" className="h-100 btn container p-1 flex-grow-1"
                            onClick={() => setShowMenu(true)}>{
                        <List color="white" className="h-100 w-auto"/>}
                    </Button>
                </div>
                <Navbar.Offcanvas
                    placement="end"
                    show={showMenu}
                >
                    <Offcanvas.Header>
                        <Offcanvas.Title>
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body className="p-0">
                        <Nav className="justify-content-end h-100 flex-grow-1">
                            <Button variant="danger" className="btn-primary btn p-3 hstack"
                                    style={{borderRadius: "0px"}}
                                    onClick={() => setShowDeleteModal(true)}
                            >
                                <XCircleFill color="black" className="h-100 w-auto"/>
                                <label className="flex-grow-1">Delete Account</label>
                            </Button>
                            <Button variant="light" className="btn-primary btn p-3 hstack" style={{borderRadius: "0px"}}
                                    onClick={() => setShowPrivacyModal(true)}
                            >
                                <ShieldExclamation color="black" className="h-100 w-auto"/>
                                <label className="flex-grow-1">Privacy</label>
                            </Button>
                            <Button variant="light" className="btn-primary btn p-3 hstack" style={{borderRadius: "0px"}}
                                    onClick={() => logout()}
                            >
                                <BoxArrowDownRight color="black" className="h-100 w-auto"/>
                                <label className="flex-grow-1">Logout</label>
                            </Button>
                            <Button
                                variant="primary"
                                className="btn-primary btn p-3 hstack"
                                style={{borderRadius: "0px"}}
                                onClick={() => setShowMenu(false)}
                            >
                                <XLg color="white" className="h-100 w-auto"/>
                                <label className="flex-grow-1">Close</label>
                            </Button>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
            </Navbar>
            <CustomModal
                show={showPrivacyModal}
                onHide={() => setShowPrivacyModal(false)}
                title="Personal Data Usage"
                body={<div>
                    <p>You personal data is processed for the following purposes</p>
                    <ul>
                        <li><strong>Email:</strong> Identifying the user when signing up and authenticating.</li>
                    </ul>
                </div>
                }
            />
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                size="sm"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Careful!
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete your account?</p>
                    <p>Any information related to your account will be deleted.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Close</Button>
                    <Button variant="danger" onClick={() => deleteAccount()}>Delete</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};