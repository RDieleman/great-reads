import {CustomError} from "./custom-error";

export class NotAuthorizedError extends CustomError {
    statusCode: number = 401;

    constructor() {
        super("Not authorized to access this resource.");

        Object.setPrototypeOf(this, NotAuthorizedError.prototype);
    }

    serializeErrors(): { message: string; field?: string }[] {
        return [{
            message: "Not authorized to access this resource."
        }];
    }

}