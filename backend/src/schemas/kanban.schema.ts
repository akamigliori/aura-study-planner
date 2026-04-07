/**
 * Zod schemas for kanban request validation.
 */

import { z } from 'zod'

export const createBoardSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
  }),
})

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional(),
    column: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().datetime().optional().or(z.null()),
  }),
})

export const moveTaskSchema = z.object({
  body: z.object({
    column: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
    position: z.number().int().min(0).optional(),
  }),
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>['body']
export type CreateTaskInput = z.infer<typeof createTaskSchema>['body']
export type MoveTaskInput = z.infer<typeof moveTaskSchema>['body']
