/**
 * Zod schemas for note request validation.
 */

import { z } from 'zod'

export const createNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200),
    content: z.string().max(10000).optional(),
    subjectId: z.string().optional().or(z.null()),
    tags: z.string().max(200).optional(),
    isPinned: z.boolean().optional(),
  }),
})

export const updateNoteSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Title is required').max(200).optional(),
    content: z.string().max(10000).optional(),
    subjectId: z.string().optional().or(z.null()),
    tags: z.string().max(200).optional(),
    isPinned: z.boolean().optional(),
  }),
})

export type CreateNoteInput = z.infer<typeof createNoteSchema>['body']
export type UpdateNoteInput = z.infer<typeof updateNoteSchema>['body']
