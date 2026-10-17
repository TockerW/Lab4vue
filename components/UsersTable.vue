<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import type { User } from '@/types/user'

defineProps<{ users: User[]; offset: number }>()
const emit = defineEmits<{ delete: [user: User] }>()
</script>

<template>
  <table class="table table-sm align-middle mb-0">
    <thead>
      <tr><th>#</th><th>Name</th><th>Email</th><th>Phone number</th><th>Age</th><th /></tr>
    </thead>
    <tbody>
      <tr v-for="(u, i) in users" :key="u.id">
        <td class="text-muted">{{ offset + i + 1 }}</td>
        <td><RouterLink :to="{ name: 'user-details', params: { id: u.id } }">{{ u.firstName }} {{ u.lastName }}</RouterLink></td>
        <td>{{ u.email }}</td>
        <td>{{ u.phone }}</td>
        <td>{{ u.age }}</td>
        <td class="text-end text-nowrap">
          <RouterLink class="btn btn-sm btn-outline-primary me-1" :to="{ name: 'user-edit', params: { id: u.id } }">Редагувати дані</RouterLink>
          <BaseButton variant="outline-danger" @click="emit('delete', u)">Видалити учасника</BaseButton>
        </td>
      </tr>
    </tbody>
  </table>
</template>
