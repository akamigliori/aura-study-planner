/**
 * Zod schemas for kanban request validation.
 */

import { z } from 'zod'

export const kanbanColumnConfigSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1).max(50),
  color: z.string().optional(),
})

export type KanbanColumnConfig = z.infer<typeof kanbanColumnConfigSchema>

export const createBoardSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required').max(100),
    description: z.string().max(500).optional(),
    columns: z.array(kanbanColumnConfigSchema).optional(),
  }),
})

export const updateBoardSchema = z.object({
  body: z.object({
    name: z.string().min(1).max(100).optional(),
    description: z.string().max(500).optional().nullable(),
    columns: z.array(kanbanColumnConfigSchema).optional(),
  }),
})

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    description: z.string().max(1000).optional(),
    column: z.string().min(1).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
    dueDate: z.string().datetime().optional().or(z.null()),
  }),
})

export const moveTaskSchema = z.object({
  body: z.object({
    column: z.string().min(1),
    position: z.number().int().min(0).optional(),
  }),
})

export type CreateBoardInput = z.infer<typeof createBoardSchema>['body']
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>['body']
export type CreateTaskInput = z.infer<typeof createTaskSchema>['body']
export type MoveTaskInput = z.infer<typeof moveTaskSchema>['body']
