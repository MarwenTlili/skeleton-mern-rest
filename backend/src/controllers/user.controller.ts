import { Request, Response, NextFunction } from 'express';
import userService from '../services/user.service';
import { createUserSchema, updateUserSchema } from '../validations/user.validation';
import validate from '../middlewares/validate.middleware';
import CustomError from '../utils/CustomError';

class UserController {
  // []: middleware composition (eg: validation, authentication, etc.)
  create = [
    validate(createUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.create(req.body);
        res.status(201).json(user);
      } catch (error) {
        next(error);
      }
    }
  ];

  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.getById(req.params.id);
      if (!user) {
        throw new CustomError('User not found', 404);
      }
      res.json(user);
    } catch (error) {
      next(error);
    }
  }

  getAll = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAll();
      res.json(users);
    } catch (error) {
      next(error);
    }
  }

  update = [
    validate(updateUserSchema),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const user = await userService.update(req.params.id, req.body);
        if (!user) {
          return next(new CustomError('User not found', 404));
        }
        res.json(user);
      } catch (error) {
        next(error);
      }
    }
  ]

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await userService.delete(req.params.id);
      if (!user) {
        throw new CustomError('User not found', 404);
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

export default new UserController();
