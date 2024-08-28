import dotenv from 'dotenv';

// Loads .env file contents into process.env 
dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://dev:dev@localhost:27017/skeleton';
export const PORT: string | number = process.env.BACKEND_PORT || 5000;

export const JWT_SECRET: string = process.env.JWT_SECRET || 'defaultSecret';
export const JWT_SECRET_EXPIRES_IN: string = process.env.JWT_SECRET_EXPIRES_IN || '1d';
export const JWT_REFRESH_TOKEN: string = process.env.JWT_REFRESH_TOKEN || 'defaultRefreshSecret';
export const JWT_REFRESH_TOKEN_EXPIRES_IN: string = process.env.JWT_REFRESH_TOKEN_EXPIRES_IN || '7d';
