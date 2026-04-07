/**
 * Zod schemas for subject request validation.
 */

import { z } from 'zod'

export const createSubjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format. Use hex format: #RRGGBB'),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  }),
})

export const updateSubjectSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format').optional(),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  }),
})

export type CreateSubjectInput = z.infer<typeof createSubjectSchema>['body']
export type UpdateSubjectInput = z.infer<typeof updateSubjectSchema>['body']
