import bcrypt from 'bcryptjs';

// export const hashPassword = async (password: string): Promise<string> => {
//   return await bcrypt.hash(password, 10);
// };
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
};

// export const comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
//   return await bcrypt.compare(password, hashedPassword);
// };
export async function comparePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
};