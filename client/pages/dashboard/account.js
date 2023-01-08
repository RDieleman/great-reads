import {useEffect, useRef, useState} from "react";
import DashboardLayout from "../../components/layouts/dashboard";
import {useAppContext} from "../_app";
import useRouter from "../../hooks/use-router";
import Password from "../../components/input/password";
import CustomModal from "../../components/modal";
import useRequest from "../../hooks/use-request";

const AccountComponent = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const strength = useRef('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [doPasswordChange, errors] = useRequest({
        url: '/api/users/update/password',
        method: 'post',
        body: {
            oldPassword, newPassword
        },
        onSuccess: () => {
            setShowSuccessModal(true);
            setOldPassword('');
            setNewPassword('');
        }
    });
    const [showErrorModal, setShowErrorModal] = useState(false);
    useEffect(() => {
        if (errors == null) {
            return;
        }
        setShowErrorModal(true);
    }, [errors])

    const state = useAppContext();

    const onSubmit = async (event) => {
        event.preventDefault();
        await doPasswordChange();
    }

    if (!state.user) {
        return useRouter().push('/');
    }

    return <div className="d-flex flex-column justify-content-center align-items-center h-100">
        <form onSubmit={onSubmit} className="container">
            <div className="mb-3">
                <label htmlFor="passwordInput"
                       className="form-label">Current Password</label>
                <Password password={oldPassword} setPassword={setOldPassword}/>
            </div>
            <div className="mb-3">
                <label htmlFor="passwordInput"
                       className="form-label">New Password {newPassword.length > 0 && strength.current}</label>
                <Password password={newPassword} setPassword={setNewPassword}
                          setStrengthElement={(e) => strength.current = e}/>
            </div>
            <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit">Save</button>
            </div>
        </form>
        <CustomModal
            show={showErrorModal}
            onHide={() => setShowErrorModal(false)}
            title="Oops..."
            body={(
                <ul>
                    {errors && errors.map((err) => {
                        return <li>{err.message}</li>
                    })}
                </ul>
            )}
        />
        <CustomModal
            show={showSuccessModal}
            onHide={() => setShowSuccessModal(false)}
            title="Success!"
            body={(
                <div>Your password has been changed!</div>
            )}
        />
    </div>
}

AccountComponent.PageLayout = DashboardLayout;

export default AccountComponent;