/**
 * Zod schemas for topic request validation.
 */

import { z } from 'zod'

export const createTopicSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters'),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  }),
})

export const updateTopicSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(1, 'Name is required')
      .max(100, 'Name must be at most 100 characters')
      .optional(),
    description: z.string().max(500, 'Description must be at most 500 characters').optional(),
  }),
})

export type CreateTopicInput = z.infer<typeof createTopicSchema>['body']
export type UpdateTopicInput = z.infer<typeof updateTopicSchema>['body']
