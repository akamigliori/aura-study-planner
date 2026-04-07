/**
 * Zod schemas for authentication request validation.
 *
 * Defines strict validation rules for registration, login,
 * and token refresh requests to prevent malformed input
 * from reaching the application logic.
 *
 * Usage:
 *   const result = registerSchema.safeParse(request.body)
 *   if (!result.success) throw new BadRequestError(result.error.message)
 */

import { z } from 'zod'

/**
 * Validates user registration input.
 * - Name: 2-100 characters
 * - Email: valid email format
 * - Password: minimum 8 characters
 */
export const registerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name must be at most 100 characters'),
    email: z.string().email('Invalid email format'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters'),
  }),
})

/**
 * Validates user login input.
 * - Email: valid email format
 * - Password: non-empty string
 */
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    password: z.string().min(1, 'Password is required'),
  }),
})

/**
 * Validates refresh token request.
 * - refreshToken: non-empty string
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
  }),
})

/**
 * Validates change password request.
 * - currentPassword: non-empty
 * - newPassword: minimum 8 characters
 */
export const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters'),
  }),
})

/**
 * Type inference from schemas
 */
export type RegisterInput = z.infer<typeof registerSchema>['body']
export type LoginInput = z.infer<typeof loginSchema>['body']
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body']
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body']
