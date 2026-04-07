import { describe, it, expect } from 'vitest'
import { hashPassword, comparePassword } from '../../../src/utils/password'

describe('password utils', () => {
  it('should hash a password and return a string', async () => {
    const hash = await hashPassword('testPassword123')
    expect(hash).toBeDefined()
    expect(typeof hash).toBe('string')
    expect(hash).not.toBe('testPassword123')
  })

  it('should produce different hashes for the same password', async () => {
    const hash1 = await hashPassword('samePassword')
    const hash2 = await hashPassword('samePassword')
    expect(hash1).not.toBe(hash2)
  })

  it('should compare a correct password successfully', async () => {
    const password = 'correctPassword123'
    const hash = await hashPassword(password)
    const isValid = await comparePassword(password, hash)
    expect(isValid).toBe(true)
  })

  it('should reject an incorrect password', async () => {
    const hash = await hashPassword('correctPassword')
    const isValid = await comparePassword('wrongPassword', hash)
    expect(isValid).toBe(false)
  })

  it('should handle empty string password', async () => {
    const hash = await hashPassword('')
    expect(typeof hash).toBe('string')
    const isValid = await comparePassword('', hash)
    expect(isValid).toBe(true)
  })
})
