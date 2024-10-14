import jwt from 'jsonwebtoken'
import {
  JWT_SECRET,
  JWT_SECRET_EXPIRES_IN,
  JWT_REFRESH_TOKEN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from '../config/env'
import { CustomJwtPayload } from '../types'
import IUser from '../interfaces/user.interface'

export const generateAccessToken = ({ id, name, email, roles, picture, isActive }: Partial<IUser>): string => {
  return jwt.sign(
    { id, name, email, roles, picture, isActive },
    JWT_SECRET,
    { algorithm: 'HS256', expiresIn: JWT_SECRET_EXPIRES_IN }
  )
}

export const generateRefreshToken = ({ id, name, email, roles, picture, isActive }: Partial<IUser>): string => {
  return jwt.sign(
    { id, name, email, roles, picture, isActive },
    JWT_REFRESH_TOKEN,
    { algorithm: 'HS256', expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN }
  )
}

export const verifyAccessToken = (token: string): CustomJwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error('Invalid Access Token!')
  }
}

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN, { algorithms: ['HS256'] })
  } catch (error) {
    throw new Error('Invalid Refresh Token!')
  }
};
