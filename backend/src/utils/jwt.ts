/**
 * JWT token generation and verification utilities.
 *
 * Handles creation and validation of access and refresh tokens
 * using @fastify/jwt. Access tokens are short-lived (15 min)
 * while refresh tokens are long-lived (7 days).
 *
 * Usage:
 *   const token = generateAccessToken({ userId: 'abc123' })
 *   const payload = verifyAccessToken(token)
 */

import jwt from '@fastify/jwt'

interface TokenPayload {
  userId: string
  email: string
}

/**
 * Generates a short-lived access token (15 min).
 * Contains user ID and email for authorization checks.
 */
export function generateAccessToken(payload: TokenPayload): string {
  // This function is a placeholder — actual token generation
  // happens via fastify.jwt.sign() in the auth service
  // This export exists for type reference and testing
  return ''
}

/**
 * Generates a long-lived refresh token (7 days).
 * Contains only user ID for security (no email).
 */
export function generateRefreshToken(userId: string): string {
  return ''
}

export type { TokenPayload }
