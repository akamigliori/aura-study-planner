/**
 * Review routes — registers all review CRUD endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { ReviewController } from '../controllers/review.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createReviewSchema, completeReviewSchema } from '../schemas/review.schema.js'

export function registerReviewRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new ReviewController(prisma)

  // GET /reviews
  app.get(
    '/reviews',
    { preHandler: [authenticate] },
    controller.list.bind(controller)
  )

  // GET /reviews/due
  app.get(
    '/reviews/due',
    { preHandler: [authenticate] },
    controller.getDue.bind(controller)
  )

  // GET /reviews/:id
  app.get(
    '/reviews/:id',
    { preHandler: [authenticate] },
    controller.getById.bind(controller)
  )

  // POST /reviews
  app.post(
    '/reviews',
    { preHandler: [authenticate, validateBody(createReviewSchema)] },
    controller.create.bind(controller)
  )

  // POST /reviews/:id/complete
  app.post(
    '/reviews/:id/complete',
    { preHandler: [authenticate, validateBody(completeReviewSchema)] },
    controller.complete.bind(controller)
  )

  // PUT /reviews/:id
  app.put(
    '/reviews/:id',
    { preHandler: [authenticate] },
    controller.update.bind(controller)
  )

  // DELETE /reviews/:id
  app.delete(
    '/reviews/:id',
    { preHandler: [authenticate] },
    controller.delete.bind(controller)
  )
}
