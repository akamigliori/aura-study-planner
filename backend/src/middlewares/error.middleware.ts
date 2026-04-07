/**
 * Global error handler middleware for Fastify.
 *
 * Catches all unhandled errors and returns consistent
 * JSON error responses. Differentiates between operational
 * errors (expected, user-facing) and programming errors
 * (unexpected, logged for debugging).
 *
 * Usage:
 *   // Registered automatically via setErrorHandler in app.ts
 */

import { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { AppError } from '../utils/errors.js'

export function errorHandler(
  error: FastifyError,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Operational errors (AppError subclasses)
  if (error instanceof AppError) {
    return reply.status(error.statusCode).send({
      success: false,
      error: {
        message: error.message,
        statusCode: error.statusCode,
      },
    })
  }

  // Zod validation errors from @fastify/jwt or other sources
  if (error.validation) {
    return reply.status(400).send({
      success: false,
      error: {
        message: 'Validation error',
        details: error.validation,
        statusCode: 400,
      },
    })
  }

  // Unexpected errors — log details, return generic message
  request.log.error(error)

  return reply.status(500).send({
    success: false,
    error: {
      message: 'Internal server error',
      statusCode: 500,
    },
  })
}
