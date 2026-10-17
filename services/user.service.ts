import { http } from '@/api/http-client'
import type { CreateUserDto, Page, UpdateUserDto, User } from '@/types/user'
import type { Creatable, Deletable, Editable, Readable } from './interfaces'

interface UsersResponse { users: User[]; total: number; skip: number; limit: number }

export class UserService
  implements Readable<User>, Creatable<User, CreateUserDto>, Editable<User, UpdateUserDto>, Deletable<User>
{
  async getAll({ limit = 10, skip = 0, q = '' } = {}): Promise<Page<User>> {
    const query = `limit=${limit}&skip=${skip}`
    const path = q ? `/users/search?q=${encodeURIComponent(q)}&${query}` : `/users?${query}`
    const data = await http<UsersResponse>(path)
    return { items: data.users, total: data.total }
  }
  getById(id: number): Promise<User> {
    return http<User>(`/users/${id}`)
  }
  create(data: CreateUserDto): Promise<User> {
    return http<User>('/users/add', { method: 'POST', body: JSON.stringify(data) })
  }
  update(id: number, data: UpdateUserDto): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  }
  delete(id: number): Promise<User> {
    return http<User>(`/users/${id}`, { method: 'DELETE' })
  }
}
