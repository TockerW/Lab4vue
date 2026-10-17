<script setup lang="ts">
import { useRouter } from 'vue-router'
import UserForm from '@/components/UserForm.vue'
import { useUsersStore } from '@/stores/users'
import type { UserFormValues } from '@/types/user'

const props = defineProps<{ id: string }>()
const store = useUsersStore()
const router = useRouter()

async function onSubmit(values: UserFormValues): Promise<void> {
  if (await store.update(Number(props.id), values)) await router.push({ name: 'user-details', params: { id: props.id } })
}
</script>

<template>
  <div v-if="store.current" class="card"><div class="card-body">
    <h6 class="text-uppercase fw-bold mb-3">Edit user</h6>
    <UserForm :key="store.current.id" :initial="store.current" submit-label="Оновити дані" :busy="store.loading" @submit="onSubmit" />
  </div></div>
</template>
