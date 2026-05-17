import argon2 from "argon2";

/**
 * Hashes a plain text password using argon2.
 * @param password The plain text password to hash
 */
export async function hashPassword(password: string): Promise<string> {
  return argon2.hash(password);
}

/**
 * Verifies a plain text password against a hash using argon2.
 * @param hash The stored password hash
 * @param plain The plain text password to verify
 */
export async function verifyPassword(hash: string, plain: string): Promise<boolean> {
  try {
    return await argon2.verify(hash, plain);
  } catch {
    return false;
  }
}
