import { Request, Response, NextFunction } from 'express';
import CustomError from '../utils/CustomError';

const errorMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  if (res.headersSent) {
    return next(err);
  }

  const status = err instanceof CustomError ? err.status : 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({ message });
};

export default errorMiddleware;
