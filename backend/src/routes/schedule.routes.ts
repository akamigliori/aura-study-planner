/**
 * Schedule routes — registers all schedule CRUD endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { ScheduleController } from '../controllers/schedule.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createScheduleSchema, updateScheduleSchema } from '../schemas/schedule.schema.js'

export function registerScheduleRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new ScheduleController(prisma)

  // GET /schedule
  app.get(
    '/schedule',
    { preHandler: [authenticate] },
    controller.list.bind(controller)
  )

  // GET /schedule/:id
  app.get(
    '/schedule/:id',
    { preHandler: [authenticate] },
    controller.getById.bind(controller)
  )

  // POST /schedule
  app.post(
    '/schedule',
    { preHandler: [authenticate, validateBody(createScheduleSchema)] },
    controller.create.bind(controller)
  )

  // PUT /schedule/:id
  app.put(
    '/schedule/:id',
    { preHandler: [authenticate, validateBody(updateScheduleSchema)] },
    controller.update.bind(controller)
  )

  // DELETE /schedule/:id
  app.delete(
    '/schedule/:id',
    { preHandler: [authenticate] },
    controller.delete.bind(controller)
  )
}
