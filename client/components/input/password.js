import {EyeFill} from "react-bootstrap-icons";
import {InputGroup} from "react-bootstrap";
import {useState} from "react";

export default ({password, setPassword}) => {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <InputGroup className="d-flex flex-row w-100">
            <input type={(showPassword ? "text" : "password")} className="form-control" id="passwordInput"
                   value={password}
                   onChange={e => setPassword(e.target.value)}/>
            <button
                type="button"
                className="btn btn-outline-secondary active"
                onClick={() => setShowPassword((prevState) => !prevState)}
            >
                <EyeFill/>
            </button>
        </InputGroup>
    )
}