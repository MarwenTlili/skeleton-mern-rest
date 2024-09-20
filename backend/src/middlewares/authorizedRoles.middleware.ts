import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt.util";
import { CustomJwtPayload, CustomRequest } from "../types";
import userService from "../services/user.service";

export const authorizedRoles = (...allowedRoles: [string]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    // console.log('[INFO]: authorizedRoles.middleware called.');

    const accessToken = req.header('Authorization')?.replace('Bearer ', '');
    if (!accessToken) {
      return res.status(401).json({
        message: 'Access denied, No token provided!'
      })
    }

    try {
      // Verify and decode accessToken
      const decodedAccessToken = verifyAccessToken(accessToken);

      // Prevent token reuse issues by checking if the user is already attached
      if (req.user) {
        return next();
      }

      // Find the user in the database
      const userId = (decodedAccessToken as CustomJwtPayload).id;
      const user = await userService.getById(userId as string);
      if (!user) return res.status(401).json({ message: 'User who want`s to access data is not found!' });

      // Check if user roles match allowed roles
      const hasRole = user.roles?.some(role => allowedRoles.includes(role));
      if (!hasRole) return res.status(403).json({ message: 'Access denied' });

      // Attach user to the request and continue
      req.user = decodedAccessToken
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({ message: 'Invalid token!' });
    }
  }
}
