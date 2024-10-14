import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.util';
import CustomError from '../utils/CustomError';
import userService from './user.service';
import IUser from '../interfaces/user.interface';
import { currentLocalDate } from '../utils/dates';

export class AuthService {
  static async login(identifier: string, password: string) {
    const user = await userService.findByIdentifier(identifier);

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid identifier or password');
    }

    const accessToken = generateAccessToken({
      id: user.id, name: user.name, email: user.email, roles: user.roles,
      picture: user.picture, isActive: user.isActive,
    });
    const refreshToken = generateRefreshToken({
      id: user.id, name: user.name, email: user.email, roles: user.roles,
      picture: user.picture, isActive: user.isActive,
    });
    user.refreshToken = refreshToken; // Store the refresh token in the database
    user.lastLoginAt = currentLocalDate();
    await user.save();

    return { accessToken, refreshToken };
  }

  static async register(data: IUser) {
    const hashedPassword = await bcrypt.hash(data.password as string, 10);
    const userWithPassword = new User({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      roles: data.roles,
      picture: "",
      isActive: false,
      createdAt: currentLocalDate(),
    });

    if (await User.exists({ name: data.name })) {
      throw new CustomError('Name already exists', 409)
    }

    if (await User.exists({ email: data.email })) {
      throw new CustomError('Email already exists', 409);
    }

    const accessToken = generateAccessToken({
      id: userWithPassword.id, name: data.name, email: data.email, roles: data.roles, picture: data.picture, isActive: data.isActive
    });
    const refreshToken = generateRefreshToken({
      id: userWithPassword.id, name: data.name, email: data.email, roles: data.roles, picture: data.picture, isActive: data.isActive
    });

    // Store the refresh token in the database
    const savedUser = await userWithPassword.save();

    // Omit hashed password from User Object
    const user = savedUser.toObject();
    delete user.password

    return { accessToken, refreshToken };
  }

  static async refreshTokens(refreshToken: string) {
    try {
      // verify token and return the decoded jwt payload
      const decoded = verifyRefreshToken(refreshToken);

      // check if the refreshToken (from user) is the same as stored in DB
      const user = await User.findById(decoded.id);
      if (!user || (user.refreshToken !== refreshToken)) {
        throw new Error('Invalid refresh token');
      }

      // generate new tokens (accessToken and refreshToken)
      const newAccessToken = generateAccessToken({
        id: user.id, name: user.name, email: user.email, roles: user.roles,
        picture: user.picture, isActive: user.isActive,
      });
      const newRefreshToken = generateRefreshToken({
        id: user.id, name: user.name, email: user.email, roles: user.roles,
        picture: user.picture, isActive: user.isActive,
      });

      // store the new generated refreshToken in DB
      if (newRefreshToken) {
        user.refreshToken = newRefreshToken;
        await user.save();
      }

      // return the new generated tokens (accessToken and refreshToken) to the client
      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Failed to refresh tokens');
    }
  }
}
