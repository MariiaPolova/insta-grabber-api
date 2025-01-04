import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './BaseError';

const validate = (schema) => (req: Request, res: Response, next: NextFunction) => {
  const validationOptions = { abortEarly: false, allowUnknown: true, stripUnknown: true };
  ['body', 'query', 'params'].forEach((key) => {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], validationOptions);
      if (error) {
        throw new BadRequestError(error.details.map((detail) => detail.message).concat());
      }
      req[key] = value;
    }
  });

  next();
};

export default validate;
