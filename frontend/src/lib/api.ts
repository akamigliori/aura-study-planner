const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface AuthTokens {
  accessToken: string
  refreshToken: string
}

let tokens: AuthTokens | null = null

function getAccessToken(): string | null {
  return tokens?.accessToken || null
}

function setAuthTokens(newTokens: AuthTokens) {
  tokens = newTokens
  localStorage.setItem('auth_tokens', JSON.stringify(newTokens))
}

function clearAuthTokens() {
  tokens = null
  localStorage.removeItem('auth_tokens')
}

function loadTokens() {
  const stored = localStorage.getItem('auth_tokens')
  if (stored) {
    tokens = JSON.parse(stored)
  }
}

async function refreshToken(): Promise<string | null> {
  if (!tokens?.refreshToken) return null

  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken }),
    })

    if (!res.ok) {
      clearAuthTokens()
      return null
    }

    const data = await res.json()
    const newTokens = { ...tokens, accessToken: data.data.accessToken }
    setAuthTokens(newTokens)
    return newTokens.accessToken
  } catch {
    clearAuthTokens()
    return null
  }
}

export async function apiRequest<T>(
  method: string,
  path: string,
  body?: unknown
): Promise<T> {
  loadTokens()
  let accessToken = getAccessToken()

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`
  }

  let res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  // Retry with refreshed token on 401
  if (res.status === 401 && tokens?.refreshToken) {
    const newToken = await refreshToken()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
      })
    }
  }

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.error?.message || 'Request failed')
  }

  return data
}

export const api = {
  get: <T>(path: string) => apiRequest<T>('GET', path),
  post: <T>(path: string, body?: unknown) => apiRequest<T>('POST', path, body),
  put: <T>(path: string, body?: unknown) => apiRequest<T>('PUT', path, body),
  delete: <T>(path: string) => apiRequest<T>('DELETE', path),
  setAuthTokens,
  clearAuthTokens,
  loadTokens,
}
