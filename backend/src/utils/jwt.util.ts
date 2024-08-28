import jwt from 'jsonwebtoken'
import {
  JWT_SECRET,
  JWT_SECRET_EXPIRES_IN,
  JWT_REFRESH_TOKEN,
  JWT_REFRESH_TOKEN_EXPIRES_IN,
} from '../config/env'
import { CustomJwtPayload } from '../types'

export const generateAccessToken = (userId: string): string => {  
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_SECRET_EXPIRES_IN })
}

export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ id: userId }, JWT_REFRESH_TOKEN, { expiresIn: JWT_REFRESH_TOKEN_EXPIRES_IN })
}

export const verifyAccessToken = (token: string): CustomJwtPayload | string => {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    throw new Error('Invalid Token!')
  }
}

export const verifyRefreshToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_REFRESH_TOKEN)
  } catch (error) {
    throw new Error('Invalid Refresh Token!')
  }
};
