export interface UserFormValues {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  age: number
  gender: string
  phone: string
}

export interface User extends UserFormValues {
  id: number
  image?: string
}

export type CreateUserDto = UserFormValues
export type UpdateUserDto = Partial<CreateUserDto>

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
}

export interface LoginResponse extends AuthUser {
  accessToken: string
  refreshToken: string
}

export interface Page<T> {
  items: T[]
  total: number
}
