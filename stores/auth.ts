import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { clearTokens, saveTokens, tokens } from '@/api/token-storage'
import { ServiceProvider } from '@/services/service-provider'
import type { AuthUser } from '@/types/user'

const USER_KEY = 'auth-user'

function readUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as AuthUser) : null
  } catch {
    return null
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthUser | null>(readUser())
  const accessToken = computed(() => tokens.accessToken)
  const isAuthenticated = computed(() => !!tokens.accessToken)

  function setUser(value: AuthUser | null): void {
    user.value = value
    if (value) localStorage.setItem(USER_KEY, JSON.stringify(value))
    else localStorage.removeItem(USER_KEY)
  }

  async function login(username: string, password: string): Promise<void> {
    const { accessToken: access, refreshToken, ...profile } = await ServiceProvider.auth.login(username, password)
    saveTokens(access, refreshToken)
    setUser(profile)
  }

  function logout(): void {
    clearTokens()
    setUser(null)
  }

  async function fetchMe(): Promise<void> {
    if (!tokens.accessToken) return
    try {
      setUser(await ServiceProvider.auth.me())
    } catch {
      /* 401 обробляє http-клієнт (refresh або logout) */
    }
  }

  return { user, accessToken, isAuthenticated, login, logout, fetchMe }
})
