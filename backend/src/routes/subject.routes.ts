/**
 * Subject routes — registers all subject CRUD endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { SubjectController } from '../controllers/subject.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createSubjectSchema, updateSubjectSchema } from '../schemas/subject.schema.js'

export function registerSubjectRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new SubjectController(prisma)

  // GET /subjects — List all
  app.get(
    '/subjects',
    { preHandler: [authenticate] },
    controller.list.bind(controller)
  )

  // GET /subjects/:id — Get one
  app.get(
    '/subjects/:id',
    { preHandler: [authenticate] },
    controller.getById.bind(controller)
  )

  // POST /subjects — Create
  app.post(
    '/subjects',
    { preHandler: [authenticate, validateBody(createSubjectSchema)] },
    controller.create.bind(controller)
  )

  // PUT /subjects/:id — Update
  app.put(
    '/subjects/:id',
    { preHandler: [authenticate, validateBody(updateSubjectSchema)] },
    controller.update.bind(controller)
  )

  // DELETE /subjects/:id — Delete
  app.delete(
    '/subjects/:id',
    { preHandler: [authenticate] },
    controller.delete.bind(controller)
  )
}
