<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import BaseButton from '@/components/BaseButton.vue'
import UserDeleteModal from '@/components/UserDeleteModal.vue'
import { useUsersStore } from '@/stores/users'

const props = defineProps<{ id: string }>() // props: true у маршруті
const store = useUsersStore()
const router = useRouter()
const confirmDelete = ref(false)

watch(() => props.id, (id) => void store.fetchOne(Number(id)), { immediate: true })

async function onDelete(): Promise<void> {
  confirmDelete.value = false
  if (await store.remove(Number(props.id))) await router.push({ name: 'users' })
}
</script>

<template>
  <div class="card mb-3"><div class="card-body">
    <RouterLink :to="{ name: 'users' }">← Back to users</RouterLink>
    <div v-if="store.error" class="alert alert-danger py-2 mt-3">{{ store.error }}</div>
    <p v-if="store.loading && !store.current" class="text-muted mt-3">Loading…</p>
    <template v-if="store.current">
      <h4 class="mt-3">{{ store.current.firstName }} {{ store.current.lastName }}</h4>
      <dl class="row mb-3">
        <dt class="col-4">Username</dt><dd class="col-8">{{ store.current.username }}</dd>
        <dt class="col-4">Email</dt><dd class="col-8">{{ store.current.email }}</dd>
        <dt class="col-4">Phone</dt><dd class="col-8">{{ store.current.phone }}</dd>
        <dt class="col-4">Age</dt><dd class="col-8">{{ store.current.age }}</dd>
        <dt class="col-4">Gender</dt><dd class="col-8">{{ store.current.gender }}</dd>
      </dl>
      <RouterLink class="btn btn-sm btn-outline-primary me-2" :to="{ name: 'user-edit', params: { id } }">Редагувати дані</RouterLink>
      <BaseButton variant="outline-danger" @click="confirmDelete = true">Видалити учасника</BaseButton>
    </template>
  </div></div>
  <RouterView />
  <UserDeleteModal :user="confirmDelete ? store.current : null" @confirm="onDelete" @close="confirmDelete = false" />
</template>
