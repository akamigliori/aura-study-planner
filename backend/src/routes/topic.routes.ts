/**
 * Topic routes — registers all topic CRUD endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from '../generated/client'
import { TopicController } from '../controllers/topic.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createTopicSchema, updateTopicSchema } from '../schemas/topic.schema.js'

export function registerTopicRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new TopicController(prisma)

  // GET /subjects/:subjectId/topics
  app.get(
    '/subjects/:subjectId/topics',
    { preHandler: [authenticate] },
    controller.list.bind(controller)
  )

  // GET /subjects/:subjectId/topics/:id
  app.get(
    '/subjects/:subjectId/topics/:id',
    { preHandler: [authenticate] },
    controller.getById.bind(controller)
  )

  // POST /subjects/:subjectId/topics
  app.post(
    '/subjects/:subjectId/topics',
    { preHandler: [authenticate, validateBody(createTopicSchema)] },
    controller.create.bind(controller)
  )

  // PUT /subjects/:subjectId/topics/:id
  app.put(
    '/subjects/:subjectId/topics/:id',
    { preHandler: [authenticate, validateBody(updateTopicSchema)] },
    controller.update.bind(controller)
  )

  // DELETE /subjects/:subjectId/topics/:id
  app.delete(
    '/subjects/:subjectId/topics/:id',
    { preHandler: [authenticate] },
    controller.delete.bind(controller)
  )
}
