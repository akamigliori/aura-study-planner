/**
 * Authentication service — business logic for auth operations.
 *
 * Handles user registration, login, token refresh, and password
 * management. Coordinates between repository (data), password
 * hashing, and JWT token generation.
 *
 * Usage:
 *   const service = new AuthService(prisma, fastify)
 *   const result = await service.register({ name, email, password })
 */

import { FastifyInstance } from 'fastify'
import { PrismaClient } from './generated/client'
import { UserRepository } from '../repositories/user.repository.js'
import { hashPassword, comparePassword } from '../utils/password.js'
import {
  AppError,
  ConflictError,
  UnauthorizedError,
  NotFoundError,
  BadRequestError,
} from '../utils/errors.js'
import type {
  RegisterInput,
  LoginInput,
  ChangePasswordInput,
} from '../schemas/auth.schema.js'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

interface UserResponse {
  id: string
  name: string
  email: string
  avatarUrl: string | null
  createdAt: Date
}

export class AuthService {
  private userRepository: UserRepository

  constructor(
    private prisma: PrismaClient,
    private fastify: FastifyInstance
  ) {
    this.userRepository = new UserRepository(prisma)
  }

  /**
   * Register a new user account.
   * Hashes password and generates auth tokens.
   */
  async register(input: RegisterInput): Promise<{
    user: UserResponse
    tokens: AuthTokens
  }> {
    const exists = await this.userRepository.emailExists(input.email)

    if (exists) {
      throw new ConflictError('Email already registered')
    }

    const hashedPassword = await hashPassword(input.password)

    const user = await this.userRepository.create({
      name: input.name,
      email: input.email,
      password: hashedPassword,
    })

    const tokens = await this.generateTokens(user.id, user.email)

    return {
      user: this.toUserResponse(user),
      tokens,
    }
  }

  /**
   * Authenticate user with email and password.
   * Returns user data and auth tokens on success.
   */
  async login(input: LoginInput): Promise<{
    user: UserResponse
    tokens: AuthTokens
  }> {
    const user = await this.userRepository.findByEmail(input.email)

    if (!user) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const isValid = await comparePassword(input.password, user.password)

    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password')
    }

    const tokens = await this.generateTokens(user.id, user.email)

    return {
      user: this.toUserResponse(user),
      tokens,
    }
  }

  /**
   * Generate new access token using a valid refresh token.
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string
  }> {
    try {
      const decoded = this.fastify.jwt.verify<{
        userId: string
        email: string
        type: string
      }>(refreshToken)

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedError('Invalid token type')
      }

      const user = await this.userRepository.findById(decoded.userId)

      if (!user) {
        throw new UnauthorizedError('User not found')
      }

      const accessToken = this.fastify.jwt.sign({
        userId: user.id,
        email: user.email,
      })

      return { accessToken }
    } catch (error) {
      if (error instanceof AppError) {
        throw error
      }
      throw new UnauthorizedError('Invalid or expired refresh token')
    }
  }

  /**
   * Get authenticated user profile.
   */
  async getProfile(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundError('User')
    }

    return this.toUserResponse(user)
  }

  /**
   * Change user password.
   * Requires current password for verification.
   */
  async changePassword(
    userId: string,
    input: ChangePasswordInput
  ): Promise<void> {
    const user = await this.userRepository.findById(userId)

    if (!user) {
      throw new NotFoundError('User')
    }

    const isValid = await comparePassword(
      input.currentPassword,
      user.password
    )

    if (!isValid) {
      throw new BadRequestError('Current password is incorrect')
    }

    const hashedPassword = await hashPassword(input.newPassword)

    await this.userRepository.update(userId, { password: hashedPassword })
  }

  /**
   * Generate access and refresh tokens for a user.
   */
  private async generateTokens(
    userId: string,
    email: string
  ): Promise<AuthTokens> {
    const accessToken = this.fastify.jwt.sign(
      { userId, email },
      { expiresIn: process.env.JWT_EXPIRATION || '15m' }
    )

    const refreshToken = this.fastify.jwt.sign(
      { userId, email, type: 'refresh' },
      { expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d' }
    )

    return { accessToken, refreshToken }
  }

  /**
   * Convert User model to safe response (excludes password).
   */
  private toUserResponse(user: {
    id: string
    name: string
    email: string
    avatarUrl: string | null
    createdAt: Date
  }): UserResponse {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    }
  }
}
