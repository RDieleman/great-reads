import {useState} from "react";
import axios from "axios";

const useRequest = ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async () => {
        try {
            setErrors(null);
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data);
            }

            return response.data;
        } catch (err) {
            setErrors(err.response.data.errors);
        }
    };

    return [
        doRequest,
        errors
    ];
};

export default useRequest;