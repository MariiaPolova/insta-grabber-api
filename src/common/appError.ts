
import { Response } from 'express';
import { BaseError } from "./BaseError";
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

// centralized error handler encapsulates error-handling related logic
class ErrorHandler {
  public async handleError(err: BaseError | Error, res?: Response): Promise<void> {
    console.error(err); // todo add logger
    if (res && err instanceof BaseError) {
      res
      .status(err.httpCode || StatusCodes.INTERNAL_SERVER_ERROR)
      .send(err.message ?? getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR));
    }
  };

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational;
    }
    return false;
  }
}

export const handler = new ErrorHandler();