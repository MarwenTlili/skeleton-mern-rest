import { Response } from 'express';

const notFoundMiddleware = (res: Response) => {
  res.status(404).json({ message: 'Resource not found' });
};

export default notFoundMiddleware;
