/**
 * Simple email format validation
 * @param email string
 * @returns boolean
 */
export function isValidEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email);
}
