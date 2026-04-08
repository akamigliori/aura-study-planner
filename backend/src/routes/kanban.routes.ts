/**
 * Kanban routes — registers all kanban board and task endpoints.
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { KanbanController } from '../controllers/kanban.controller.js'
import { authenticate } from '../middlewares/auth.middleware.js'
import { validateBody } from '../middlewares/validate.middleware.js'
import { createBoardSchema, updateBoardSchema, createTaskSchema, moveTaskSchema } from '../schemas/kanban.schema.js'

export function registerKanbanRoutes(
  app: FastifyInstance,
  prisma: PrismaClient
): void {
  const controller = new KanbanController(prisma)

  // Boards
  app.get(
    '/kanban/boards',
    { preHandler: [authenticate] },
    controller.listBoards.bind(controller)
  )

  app.post(
    '/kanban/boards',
    { preHandler: [authenticate, validateBody(createBoardSchema)] },
    controller.createBoard.bind(controller)
  )

  app.get(
    '/kanban/boards/:id',
    { preHandler: [authenticate] },
    controller.getBoard.bind(controller)
  )

  app.put(
    '/kanban/boards/:id',
    { preHandler: [authenticate, validateBody(updateBoardSchema)] },
    controller.updateBoard.bind(controller)
  )

  app.delete(
    '/kanban/boards/:id',
    { preHandler: [authenticate] },
    controller.deleteBoard.bind(controller)
  )

  // Tasks
  app.get(
    '/kanban/boards/:boardId/tasks',
    { preHandler: [authenticate] },
    controller.listTasks.bind(controller)
  )

  app.post(
    '/kanban/boards/:boardId/tasks',
    { preHandler: [authenticate, validateBody(createTaskSchema)] },
    controller.createTask.bind(controller)
  )

  app.put(
    '/kanban/tasks/:id/move',
    { preHandler: [authenticate, validateBody(moveTaskSchema)] },
    controller.moveTask.bind(controller)
  )

  app.put(
    '/kanban/tasks/:id',
    { preHandler: [authenticate] },
    controller.updateTask.bind(controller)
  )

  app.delete(
    '/kanban/tasks/:id',
    { preHandler: [authenticate] },
    controller.deleteTask.bind(controller)
  )
}
