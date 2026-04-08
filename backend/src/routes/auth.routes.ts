/**
 * Authentication routes — registers all auth endpoints.
 *
 * Routes:
 *   POST /auth/register     — Create new account
 *   POST /auth/login        — Authenticate user
 *   POST /auth/refresh      — Refresh access token
 *   GET  /auth/me           — Get user profile (protected)
 *   PUT  /auth/change-password — Change password (protected)
 *
 * Usage:
 *   import { registerAuthRoutes } from './routes/auth.routes.js'
 *   registerAuthRoutes(app, prisma)
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { AuthController } from '../controllers/auth.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  changePasswordSchema,
} from '../schemas/auth.schema.js'

export function registerAuthRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new AuthController(prisma, app)

  // POST /auth/register
  app.post(
    '/auth/register',
    {
      preHandler: [validateBody(registerSchema)],
    },
    controller.register.bind(controller)
  )

  // POST /auth/login
  app.post(
    '/auth/login',
    {
      preHandler: [validateBody(loginSchema)],
    },
    controller.login.bind(controller)
  )

  // POST /auth/refresh
  app.post(
    '/auth/refresh',
    {
      preHandler: [validateBody(refreshTokenSchema)],
    },
    controller.refresh.bind(controller)
  )

  // GET /auth/me (protected)
  app.get(
    '/auth/me',
    {
      preHandler: [authenticate],
    },
    controller.me.bind(controller)
  )

  // PUT /auth/change-password (protected)
  app.put(
    '/auth/change-password',
    {
      preHandler: [authenticate, validateBody(changePasswordSchema)],
    },
    controller.changePassword.bind(controller)
  )
}
