import { reactive } from 'vue'

const KEY = 'auth-tokens'

interface Tokens { accessToken: string | null; refreshToken: string | null }

function read(): Tokens {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return JSON.parse(raw) as Tokens
  } catch { /* ignore */ }
  return { accessToken: null, refreshToken: null }
}

// reactive, щоб стор і guard реагували на оновлення токена
export const tokens = reactive<Tokens>(read())

export function saveTokens(accessToken: string, refreshToken: string): void {
  tokens.accessToken = accessToken
  tokens.refreshToken = refreshToken
  localStorage.setItem(KEY, JSON.stringify({ accessToken, refreshToken }))
}

export function clearTokens(): void {
  tokens.accessToken = null
  tokens.refreshToken = null
  localStorage.removeItem(KEY)
}
