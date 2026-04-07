import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const API_URL = 'http://localhost:3000'

describe('api', () => {
  let api: typeof import('../../../src/lib/api')['api']
  let apiRequest: typeof import('../../../src/lib/api')['apiRequest']

  beforeEach(async () => {
    vi.resetModules()
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    })
    vi.stubGlobal('fetch', vi.fn())
    const mod = await import('../../src/lib/api')
    api = mod.api
    apiRequest = mod.apiRequest
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  describe('api.get', () => {
    it('should call fetch with GET method and no body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { id: '1' } }),
      } as Response)

      await api.get<{ data: { id: string } }>('/subjects')

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/subjects`,
        expect.objectContaining({ method: 'GET', body: undefined })
      )
    })

    it('should return parsed response data', async () => {
      const expected = { data: { name: 'Math' } }
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve(expected),
      } as Response)

      const result = await api.get<typeof expected>('/subjects/1')

      expect(result).toEqual(expected)
    })
  })

  describe('api.post', () => {
    it('should call fetch with POST method and JSON body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ data: { id: '1' } }),
      } as Response)

      await api.post('/subjects', { name: 'Math', color: '#ff0000' })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/subjects`,
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Math', color: '#ff0000' }),
        })
      )
    })
  })

  describe('api.put', () => {
    it('should call fetch with PUT method and JSON body', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { id: '1' } }),
      } as Response)

      await api.put('/subjects/1', { name: 'Updated' })

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/subjects/1`,
        expect.objectContaining({
          method: 'PUT',
          body: JSON.stringify({ name: 'Updated' }),
        })
      )
    })
  })

  describe('api.delete', () => {
    it('should call fetch with DELETE method', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: null }),
      } as Response)

      await api.delete('/subjects/1')

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/subjects/1`,
        expect.objectContaining({ method: 'DELETE' })
      )
    })
  })

  describe('Authorization header', () => {
    it('should include access token when tokens are loaded', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({ accessToken: 'abc123', refreshToken: 'ref456' })
      )
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      } as Response)

      await api.get('/subjects')

      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer abc123',
          }),
        })
      )
    })

    it('should not include Authorization header when no tokens', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(null)
      vi.mocked(fetch).mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: {} }),
      } as Response)

      await api.get('/subjects')

      const callHeaders = (fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].headers
      expect(callHeaders).not.toHaveProperty('Authorization')
    })
  })

  describe('Token management', () => {
    it('should save tokens to localStorage on setAuthTokens', async () => {
      const tokens = { accessToken: 'new', refreshToken: 'newRef' }
      api.setAuthTokens(tokens)

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'auth_tokens',
        JSON.stringify(tokens)
      )
    })

    it('should clear tokens from localStorage on clearAuthTokens', async () => {
      api.clearAuthTokens()

      expect(localStorage.removeItem).toHaveBeenCalledWith('auth_tokens')
    })

    it('should load tokens from localStorage on loadTokens', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({ accessToken: 'stored', refreshToken: 'storedRef' })
      )

      api.loadTokens()

      expect(localStorage.getItem).toHaveBeenCalledWith('auth_tokens')
    })
  })

  describe('Error handling', () => {
    it('should throw error with message from response on non-OK status', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: { message: 'Not found', code: 'NOT_FOUND', statusCode: 404 } }),
      } as Response)

      await expect(api.get('/subjects/999')).rejects.toThrow('Not found')
    })

    it('should throw generic error when response has no message', async () => {
      vi.mocked(fetch).mockResolvedValue({
        ok: false,
        status: 500,
        json: () => Promise.resolve({ error: {} }),
      } as Response)

      await expect(api.get('/subjects')).rejects.toThrow('Request failed')
    })
  })

  describe('401 retry with refresh token', () => {
    it('should retry request with new token after 401', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({ accessToken: 'expired', refreshToken: 'validRef' })
      )

      const refreshResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { accessToken: 'newToken' } }),
      } as Response

      const successResponse = {
        ok: true,
        status: 200,
        json: () => Promise.resolve({ data: { id: '1' } }),
      } as Response

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: { message: 'Unauthorized' } }),
        } as Response)
        .mockResolvedValueOnce(refreshResponse)
        .mockResolvedValueOnce(successResponse)

      const result = await api.get<{ data: { id: string } }>('/subjects')

      expect(fetch).toHaveBeenCalledTimes(3)
      expect(result).toEqual({ data: { id: '1' } })

      const retryCall = (fetch as ReturnType<typeof vi.fn>).mock.calls[2]
      expect(retryCall[1].headers).toHaveProperty('Authorization', 'Bearer newToken')
    })

    it('should throw if refresh token also fails', async () => {
      vi.mocked(localStorage.getItem).mockReturnValue(
        JSON.stringify({ accessToken: 'expired', refreshToken: 'invalidRef' })
      )

      vi.mocked(fetch)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: { message: 'Unauthorized' } }),
        } as Response)
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          json: () => Promise.resolve({ error: { message: 'Invalid refresh token' } }),
        } as Response)

      await expect(api.get('/subjects')).rejects.toThrow('Unauthorized')
    })
  })
})
