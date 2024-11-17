export class AppError extends Error {
    public readonly isOperational: boolean;
  
    constructor(description: string, isOperational: boolean) {
      super(description);
      Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain
      this.isOperational = isOperational;
      Error.captureStackTrace(this);
    }
  }
  
  // centralized error handler encapsulates error-handling related logic
  class ErrorHandler {
    public async handleError(err: Error): Promise<void> {
      console.error(err);
    };
  
    public isTrustedError(error: Error) {
      if (error instanceof AppError) {
        return error.isOperational;
      }
      return false;
    }
  }
  
  export const handler = new ErrorHandler();