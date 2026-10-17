import { http } from '@/api/http-client'
import type { AuthUser, LoginResponse } from '@/types/user'

export class AuthService {
  login(username: string, password: string): Promise<LoginResponse> {
    return http<LoginResponse>('/auth/login', {
      method: 'POST',
      skipAuth: true,
      body: JSON.stringify({ username, password, expiresInMins: 30 }),
    })
  }
  me(): Promise<AuthUser> {
    return http<AuthUser>('/auth/me')
  }
}
