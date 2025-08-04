import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from './BaseError.js';
import Joi from 'joi';

type ValidKeys = 'body' | 'query' | 'params';

const validate = (schema: Partial<Record<ValidKeys, Joi.Schema>>) => (req: Request, res: Response, next: NextFunction) => {
  const validationOptions = { abortEarly: false, allowUnknown: true, stripUnknown: true };
  (['body', 'query', 'params'] as ValidKeys[]).forEach((key) => {
    if (schema[key]) {
      const { error, value } = schema[key].validate(req[key], validationOptions);
      if (error as Joi.ValidationError) {
        if (error && error.details) {
          const errorMessage = error.details.map((detail: Joi.ValidationErrorItem) => detail.message).join(', ');
          throw new BadRequestError(errorMessage);
        }
      }
      req[key] = value;
    }
  });

  next();
};

export default validate;
