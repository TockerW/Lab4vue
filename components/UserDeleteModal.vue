<script setup lang="ts">
import BaseModal from './BaseModal.vue'
import BaseButton from './BaseButton.vue'
import type { User } from '@/types/user'

defineProps<{ user: User | null }>()
const emit = defineEmits<{ confirm: []; close: [] }>()
</script>

<template>
  <BaseModal :show="!!user" title="Видалення учасника" @close="emit('close')">
    <p v-if="user" class="mb-0">
      Ви дійсно бажаєте видалити учасника "{{ user.firstName }} {{ user.lastName }}", "{{ user.email }}"?
    </p>
    <template #footer>
      <BaseButton variant="danger" @click="emit('confirm')">Так</BaseButton>
      <BaseButton variant="secondary" @click="emit('close')">Ні</BaseButton>
    </template>
  </BaseModal>
</template>
