/**
 * Authentication controller — HTTP request handlers for auth routes.
 *
 * Receives validated request data, delegates to AuthService for
 * business logic, and returns formatted HTTP responses.
 *
 * Usage:
 *   const controller = new AuthController(prisma, fastify)
 *   app.post('/auth/register', controller.register.bind(controller))
 */

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { PrismaClient } from './generated/client'
import { AuthService } from '../services/auth.service.js'
import { getUserFromRequest } from '../middlewares/auth.middleware.js'
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../schemas/auth.schema.js'

export class AuthController {
  private service: AuthService

  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {
    this.service = new AuthService(prisma, fastify)
  }

  /**
   * POST /auth/register
   * Creates a new user account and returns auth tokens.
   */
  async register(request: FastifyRequest, reply: FastifyReply) {
    const validated = registerSchema.parse(request)

    const result = await this.service.register(validated.body)

    return reply.status(201).send({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    })
  }

  /**
   * POST /auth/login
   * Authenticates user and returns auth tokens.
   */
  async login(request: FastifyRequest, reply: FastifyReply) {
    const validated = loginSchema.parse(request)

    const result = await this.service.login(validated.body)

    return reply.status(200).send({
      success: true,
      data: {
        user: result.user,
        tokens: result.tokens,
      },
    })
  }

  /**
   * POST /auth/refresh
   * Generates new access token using refresh token.
   */
  async refresh(request: FastifyRequest, reply: FastifyReply) {
    const validated = refreshTokenSchema.parse(request)

    const result = await this.service.refreshToken(validated.body.refreshToken)

    return reply.status(200).send({
      success: true,
      data: result,
    })
  }

  /**
   * GET /auth/me
   * Returns authenticated user profile.
   */
  async me(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)

    const user = await this.service.getProfile(userId)

    return reply.status(200).send({
      success: true,
      data: { user },
    })
  }

  /**
   * PUT /auth/change-password
   * Changes user password after verifying current password.
   */
  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const { userId } = getUserFromRequest(request)
    const validated = changePasswordSchema.parse(request)

    await this.service.changePassword(userId, validated.body)

    return reply.status(200).send({
      success: true,
      message: 'Password changed successfully',
    })
  }
}
