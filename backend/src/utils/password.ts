/**
 * Password hashing and comparison utilities using bcrypt.
 *
 * Provides secure password hashing with configurable rounds
 * and constant-time comparison to prevent timing attacks.
 *
 * Usage:
 *   const hash = await hashPassword('mySecretPassword')
 *   const isValid = await comparePassword('mySecretPassword', hash)
 */

import bcrypt from 'bcrypt'

const ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '10', 10)

/**
 * Hashes a plain text password using bcrypt.
 * @param password - Plain text password to hash
 * @returns Hashed password string
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, ROUNDS)
}

/**
 * Compares a plain text password against a bcrypt hash.
 * @param password - Plain text password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns True if password matches the hash
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
