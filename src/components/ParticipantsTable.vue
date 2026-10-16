<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import type { Participant, SortDir, SortKey } from '../types/participant'
import { formatDate } from '../utils/validators'

defineProps<{ participants: Participant[]; sortKey: SortKey | null; sortDir: SortDir }>()
const emit = defineEmits<{ sort: [key: SortKey]; edit: [p: Participant]; delete: [p: Participant] }>()
</script>

<template>
  <table class="table table-sm align-middle mb-0">
    <thead>
      <tr>
        <th>#</th>
        <th>
          Name
          <button class="sort-btn" :class="{ active: sortKey === 'name' }" title="Sort by name" @click="emit('sort', 'name')">
            {{ sortKey === 'name' && sortDir === 'desc' ? '↑ Z-A' : '↓ A-Z' }}
          </button>
        </th>
        <th>
          Date of Birth
          <button class="sort-btn" :class="{ active: sortKey === 'birthDate' }" title="Sort by date" @click="emit('sort', 'birthDate')">
            {{ sortKey === 'birthDate' && sortDir === 'desc' ? '↑' : '↓' }}
          </button>
        </th>
        <th>Email</th>
        <th>Phone number</th>
        <th />
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(p, i) in participants" :key="p.id">
        <td class="text-muted">{{ i + 1 }}</td>
        <td>{{ p.name }}</td>
        <td>{{ formatDate(p.birthDate) }}</td>
        <td>{{ p.email }}</td>
        <td>{{ p.phone }}</td>
        <td><BaseButton variant="outline-primary" @click="emit('edit', p)">Редагувати дані</BaseButton></td>
        <td><BaseButton variant="outline-danger" @click="emit('delete', p)">Видалити учасника</BaseButton></td>
      </tr>
    </tbody>
  </table>
</template>
