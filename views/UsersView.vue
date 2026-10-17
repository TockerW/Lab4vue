<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import BaseModal from '@/components/BaseModal.vue'
import SearchBar from '@/components/SearchBar.vue'
import UserForm from '@/components/UserForm.vue'
import UsersTable from '@/components/UsersTable.vue'
import UserDeleteModal from '@/components/UserDeleteModal.vue'
import { PAGE_SIZE, useUsersStore } from '@/stores/users'
import type { User, UserFormValues } from '@/types/user'

const store = useUsersStore()
const route = useRoute()
const router = useRouter()

// стан списку живе в query-параметрах: /users?page=2&q=john
const page = computed(() => Math.max(1, Number(route.query.page) || 1))
const q = computed(() => (typeof route.query.q === 'string' ? route.query.q : ''))
const totalPages = computed(() => Math.max(1, Math.ceil(store.total / PAGE_SIZE)))

watch([page, q], () => void store.fetchPage(page.value, q.value), { immediate: true })

const setQuery = (patch: { page?: number; q?: string }): void => {
  const next = { page: page.value, q: q.value, ...patch }
  void router.push({
    query: { ...(next.page > 1 && { page: String(next.page) }), ...(next.q && { q: next.q }) },
  })
}

const showCreate = ref(false)
async function onCreate(values: UserFormValues): Promise<void> {
  if (await store.create(values)) showCreate.value = false
}

const deleting = ref<User | null>(null)
async function onDelete(): Promise<void> {
  if (deleting.value) await store.remove(deleting.value.id)
  deleting.value = null
}
</script>

<template>
  <div class="card"><div class="card-body">
    <div class="d-flex gap-3 mb-3">
      <div class="flex-grow-1"><SearchBar :initial="q" @filter-by-name="setQuery({ q: $event, page: 1 })" /></div>
      <BaseButton @click="showCreate = true">Add user</BaseButton>
    </div>
    <div v-if="store.error" class="alert alert-danger py-2">{{ store.error }}</div>
    <p v-if="store.loading" class="text-muted">Loading…</p>
    <UsersTable :users="store.items" :offset="(page - 1) * PAGE_SIZE" @delete="deleting = $event" />
    <p v-if="!store.loading && !store.items.length && !store.error" class="text-muted mt-3 mb-0">No users found.</p>
    <div class="pager">
      <BaseButton variant="outline-primary" :disabled="page <= 1" @click="setQuery({ page: page - 1 })">Prev</BaseButton>
      <span>Page {{ page }} of {{ totalPages }}</span>
      <BaseButton variant="outline-primary" :disabled="page >= totalPages" @click="setQuery({ page: page + 1 })">Next</BaseButton>
    </div>
  </div>

  <BaseModal :show="showCreate" title="Новий учасник" @close="showCreate = false">
    <UserForm v-if="showCreate" submit-label="Save" :busy="store.loading" @submit="onCreate" />
  </BaseModal>
  <UserDeleteModal :user="deleting" @confirm="onDelete" @close="deleting = null" />
  </div>
</template>
