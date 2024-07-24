import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import CustomError from '../utils/CustomError';

const validate = (schema: Joi.Schema) => (req: Request, res: Response, next: NextFunction) => {
  const { error } = schema.validate(req.body);
  if (error) {
    next(new CustomError(error.details[0].message, 400));
  } else {
    next();
  }
};

export default validate;
