/**
 * Note routes — registers all note CRUD endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from '../generated/client'
import { NoteController } from '../controllers/note.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createNoteSchema, updateNoteSchema } from '../schemas/note.schema.js'

export function registerNoteRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new NoteController(prisma)

  // GET /notes
  app.get(
    '/notes',
    { preHandler: [authenticate] },
    controller.list.bind(controller)
  )

  // GET /notes/:id
  app.get(
    '/notes/:id',
    { preHandler: [authenticate] },
    controller.getById.bind(controller)
  )

  // POST /notes
  app.post(
    '/notes',
    { preHandler: [authenticate, validateBody(createNoteSchema)] },
    controller.create.bind(controller)
  )

  // PUT /notes/:id
  app.put(
    '/notes/:id',
    { preHandler: [authenticate, validateBody(updateNoteSchema)] },
    controller.update.bind(controller)
  )

  // DELETE /notes/:id
  app.delete(
    '/notes/:id',
    { preHandler: [authenticate] },
    controller.delete.bind(controller)
  )
}
