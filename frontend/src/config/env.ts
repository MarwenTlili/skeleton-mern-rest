export const NEXT_PUBLIC_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
export const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || '';
export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://backend:5000/api/v1';
export const BASE_URL = NEXT_PUBLIC_BASE_URL + NEXT_PUBLIC_BASE_PATH;

export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-secret';
