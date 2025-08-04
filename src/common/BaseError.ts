import { StatusCodes, getReasonPhrase } from 'http-status-codes';

export class BaseError extends Error {
    public readonly name: string;
    public readonly httpCode: StatusCodes;
    public readonly isOperational: boolean;

    constructor(name: string, httpCode: StatusCodes, description: string, isOperational: boolean) {
        super(description);
        Object.setPrototypeOf(this, new.target.prototype);

        this.name = name;
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this);
    }
}

export class APIError extends BaseError {
    constructor(
        name = 'API ERROR',
        httpCode = StatusCodes.INTERNAL_SERVER_ERROR,
        isOperational = true,
        description = getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR)) {
        super(name, httpCode, description, isOperational);
    }
}

export class BadRequestError extends BaseError {
    constructor(description = getReasonPhrase(StatusCodes.BAD_REQUEST)) {
        super('BAD REQUEST', StatusCodes.BAD_REQUEST, description, true);
    }
}

export class NotFoundError extends BaseError {
    constructor(description = getReasonPhrase(StatusCodes.NOT_FOUND)) {
        super('NOT FOUND', StatusCodes.NOT_FOUND, description, true);
    }
}