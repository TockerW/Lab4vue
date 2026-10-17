import { ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/services/service-provider'
import type { CreateUserDto, UpdateUserDto, User } from '@/types/user'

export const PAGE_SIZE = 10

export const useUsersStore = defineStore('users', () => {
  const items = ref<User[]>([])
  const total = ref(0)
  const current = ref<User | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function run<T>(fn: () => Promise<T>): Promise<T | undefined> {
    loading.value = true
    error.value = null
    try {
      return await fn()
    } catch (e) {
      error.value = (e as Error).message
      return undefined
    } finally {
      loading.value = false
    }
  }

  const fetchPage = (page: number, q: string) =>
    run(async () => {
      const res = await ServiceProvider.users.getAll({ limit: PAGE_SIZE, skip: (page - 1) * PAGE_SIZE, q })
      items.value = res.items
      total.value = res.total
    })

  const fetchOne = (id: number) =>
    run(async () => {
      current.value = items.value.find((u) => u.id === id) ?? (await ServiceProvider.users.getById(id))
    })

  // POST/PUT/DELETE на DummyJSON лише імітуються → оновлюємо локальний стан самі
  async function create(dto: CreateUserDto): Promise<boolean> {
    const created = await run(() => ServiceProvider.users.create(dto))
    if (!created) return false
    items.value.unshift({ ...dto, ...created })
    total.value++
    return true
  }

  async function update(id: number, dto: UpdateUserDto): Promise<boolean> {
    const updated = await run(() => ServiceProvider.users.update(id, dto))
    if (!updated) return false
    const merged = { ...(current.value ?? items.value.find((u) => u.id === id)), ...dto, ...updated } as User
    items.value = items.value.map((u) => (u.id === id ? merged : u))
    current.value = merged
    return true
  }

  async function remove(id: number): Promise<boolean> {
    const done = await run(() => ServiceProvider.users.delete(id))
    if (!done) return false
    items.value = items.value.filter((u) => u.id !== id)
    total.value--
    if (current.value?.id === id) current.value = null
    return true
  }

  return { items, total, current, loading, error, fetchPage, fetchOne, create, update, remove }
})
