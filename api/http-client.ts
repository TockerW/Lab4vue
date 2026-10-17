import { clearTokens, saveTokens, tokens } from './token-storage'

const BASE_URL = import.meta.env.VITE_API_URL

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message)
  }
}

interface HttpOptions extends RequestInit {
  skipAuth?: boolean // для login/refresh: без Bearer і без повтору після 401
}

let sessionExpiredHandler: (() => void) | null = null
export const setSessionExpiredHandler = (fn: () => void): void => {
  sessionExpiredHandler = fn
}

let refreshing: Promise<boolean> | null = null

async function refreshTokens(): Promise<boolean> {
  if (!tokens.refreshToken) return false
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: tokens.refreshToken, expiresInMins: 30 }),
    })
    if (!res.ok) return false
    const data = (await res.json()) as { accessToken: string; refreshToken: string }
    saveTokens(data.accessToken, data.refreshToken)
    return true
  } catch {
    return false
  }
}

function send(path: string, init: RequestInit, skipAuth?: boolean): Promise<Response> {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', 'application/json')
  if (!skipAuth && tokens.accessToken) headers.set('Authorization', `Bearer ${tokens.accessToken}`)
  return fetch(`${BASE_URL}${path}`, { ...init, headers })
}

export async function http<T>(path: string, options: HttpOptions = {}): Promise<T> {
  const { skipAuth, ...init } = options
  let res = await send(path, init, skipAuth)

  if (res.status === 401 && !skipAuth) {
    refreshing ??= refreshTokens().finally(() => { refreshing = null }) // один refresh на всі паралельні запити
    if (await refreshing) {
      res = await send(path, init, skipAuth)
    } else {
      clearTokens()
      sessionExpiredHandler?.()
    }
  }

  if (!res.ok) {
    let message = `HTTP ${res.status}: ${res.statusText}`
    try {
      const body = (await res.json()) as { message?: string }
      if (body.message) message = body.message
    } catch { /* тіло не JSON */ }
    throw new HttpError(res.status, message)
  }
  return res.json() as Promise<T>
}
