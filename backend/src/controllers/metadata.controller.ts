import { NextFunction, Request, Response } from "express";

export const metadata = (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    'application': 'MERN Skeleton project in Docker environment.',
    'version': '1.0.0',
    'documentation': 'http://localhost/docs',
    'contact': {
      'email': 'support@example.com'
    }
  });
}
