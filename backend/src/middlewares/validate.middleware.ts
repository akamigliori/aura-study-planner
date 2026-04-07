/**
 * Request validation middleware using Zod schemas.
 *
 * Validates request body, params, or query against a Zod schema
 * before the route handler executes. Returns 400 with detailed
 * error messages if validation fails.
 *
 * Usage:
 *   app.post('/register', { preHandler: [validateBody(registerSchema)] }, handler)
 */

import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify'
import { z } from 'zod'
import { BadRequestError } from '../utils/errors.js'

/**
 * Creates a validation middleware for request body.
 * @param schema - Zod schema to validate against
 * @returns Fastify preHandler middleware
 */
export function validateBody(schema: z.ZodType) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request)

    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(', ')
      throw new BadRequestError(messages)
    }
  }
}

/**
 * Creates a validation middleware for request params.
 * @param schema - Zod schema to validate against
 * @returns Fastify preHandler middleware
 */
export function validateParams(schema: z.ZodType) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request)

    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(', ')
      throw new BadRequestError(messages)
    }
  }
}

/**
 * Creates a validation middleware for request query.
 * @param schema - Zod schema to validate against
 * @returns Fastify preHandler middleware
 */
export function validateQuery(schema: z.ZodType) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    const result = schema.safeParse(request)

    if (!result.success) {
      const messages = result.error.issues.map((e) => e.message).join(', ')
      throw new BadRequestError(messages)
    }
  }
}
