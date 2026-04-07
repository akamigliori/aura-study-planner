import { describe, it, expect } from 'vitest'
import {
  AppError,
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  InternalServerError,
} from '../../../src/utils/errors'

describe('errors', () => {
  it('should create AppError with default status 500', () => {
    const error = new AppError('Something went wrong')
    expect(error.message).toBe('Something went wrong')
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(true)
  })

  it('should create AppError with custom status', () => {
    const error = new AppError('Custom error', 418)
    expect(error.statusCode).toBe(418)
  })

  it('should create BadRequestError with status 400', () => {
    const error = new BadRequestError('Bad request')
    expect(error).toBeInstanceOf(AppError)
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('BadRequestError')
  })

  it('should create UnauthorizedError with status 401', () => {
    const error = new UnauthorizedError('Not authorized')
    expect(error.statusCode).toBe(401)
    expect(error.message).toBe('Not authorized')
  })

  it('should create UnauthorizedError with default message', () => {
    const error = new UnauthorizedError()
    expect(error.message).toBe('Unauthorized')
  })

  it('should create ForbiddenError with status 403', () => {
    const error = new ForbiddenError('Access denied')
    expect(error.statusCode).toBe(403)
  })

  it('should create NotFoundError with resource name', () => {
    const error = new NotFoundError('User')
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('User not found')
  })

  it('should create NotFoundError with default resource', () => {
    const error = new NotFoundError()
    expect(error.message).toBe('Resource not found')
  })

  it('should create ConflictError with status 409', () => {
    const error = new ConflictError('Email already exists')
    expect(error.statusCode).toBe(409)
  })

  it('should create InternalServerError with status 500 and non-operational', () => {
    const error = new InternalServerError()
    expect(error.statusCode).toBe(500)
    expect(error.isOperational).toBe(false)
  })
})
