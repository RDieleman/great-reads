import {EyeFill} from "react-bootstrap-icons";
import {InputGroup} from "react-bootstrap";
import {useState} from "react";

export default ({password, setPassword, setStrengthElement}) => {
    const [showPassword, setShowPassword] = useState(false);

    const strengths = {
        weak: ["Weak", "red"],
        okay: ["Okay", "orange"],
        good: ["Good", "green"],
    }

    if (setStrengthElement) {
        const strength = (password.length < 6) ? strengths.weak
            : (password.length < 12) ? strengths.okay : strengths.good;

        setStrengthElement(<span style={{color: strength[1]}}> - {strength[0]}</span>)
    }

    return (<div>
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
        </div>
    )
}