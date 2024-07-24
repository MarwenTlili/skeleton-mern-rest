import dotenv from 'dotenv';

// Loads .env file contents into process.env 
dotenv.config();

export const NODE_ENV: string = process.env.NODE_ENV || 'development';
export const MONGODB_URI: string = process.env.MONGODB_URI || 'mongodb://dev:dev@localhost:27017/skeleton';
export const PORT: string | number = process.env.BACKEND_PORT || 5000;
