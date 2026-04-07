/**
 * JWT authentication middleware for Fastify.
 *
 * Verifies the JWT token in the Authorization header
 * and attaches the decoded user payload to the request.
 *
 * Usage:
 *   app.get('/protected', { preHandler: [authenticate] }, handler)
 */

import { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthorizedError } from '../utils/errors.js'

export async function authenticate(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  try {
    await request.jwtVerify()
  } catch {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

/**
 * Middleware to attach user data from JWT to request.
 * Used by controllers to access the authenticated user.
 */
export function getUserFromRequest(request: FastifyRequest): {
  userId: string
  email: string
} {
  const user = request.user as { userId: string; email: string }

  if (!user?.userId) {
    throw new UnauthorizedError('User not authenticated')
  }

  return user
}
