/**
 * Zod schemas for review request validation.
 */

import { z } from 'zod'

export const createReviewSchema = z.object({
  body: z.object({
    topicId: z.string().min(1, 'Topic ID is required'),
  }),
})

export const completeReviewSchema = z.object({
  body: z.object({
    quality: z.number().int().min(0).max(5, 'Quality must be 0-5'),
  }),
})

export type CreateReviewInput = z.infer<typeof createReviewSchema>['body']
export type CompleteReviewInput = z.infer<typeof completeReviewSchema>['body']
