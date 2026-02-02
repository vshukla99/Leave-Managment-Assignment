import bcrypt from "bcrypt";

/**
 * Hash a password
 */
export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
