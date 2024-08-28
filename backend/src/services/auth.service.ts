import User from '../models/user.model';
import bcrypt from 'bcryptjs';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from '../utils/jwt.util';
import CustomError from '../utils/CustomError';
import userService from './user.service';

export class AuthService {
  static async login(identifier: string, password: string) {
    const user = await userService.findByIdentifier(identifier);

    if (!user || !user.password || !(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid identifier or password');
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);
    user.refreshToken = refreshToken; // Store the refresh token in the database
    await user.save();

    return { accessToken, refreshToken };
  }

  static async register(name: string, email: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userWithPassword = new User({ name, email, password: hashedPassword });

    if (await User.exists({ name })) {
      throw new CustomError('Name already exists', 409)
    }

    if (await User.exists({ email })) {
      throw new CustomError('Email already exists', 409);
    }

    const accessToken = generateAccessToken(userWithPassword.id);
    const refreshToken = generateRefreshToken(userWithPassword.id);
    userWithPassword.refreshToken = refreshToken; // Store the refresh token in the database

    // Omit hashed password from User Object
    const savedUser = await userWithPassword.save();
    const user = savedUser.toObject();
    delete user.password

    return { accessToken, refreshToken };
  }

  static async refreshTokens(refreshToken: string) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      const user = await User.findById(decoded.id);

      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      const newAccessToken = generateAccessToken(user.id);
      const newRefreshToken = generateRefreshToken(user.id);
      user.refreshToken = newRefreshToken;
      await user.save();

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new Error('Failed to refresh tokens');
    }
  }
}
