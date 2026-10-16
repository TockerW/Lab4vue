<script setup lang="ts">
import { ref } from 'vue'
import RegisterForm from './RegisterForm.vue'
import type { ParticipantInput } from '../types/participant'

defineProps<{ isEmailTaken: (email: string) => boolean }>()
const emit = defineEmits<{ add: [values: ParticipantInput] }>()
const form = ref<InstanceType<typeof RegisterForm> | null>(null)

function onSubmit(values: ParticipantInput): void {
  emit('add', values)
  form.value?.reset()
}
</script>

<template>
  <div class="card mb-3">
    <div class="card-body">
      <h6 class="text-uppercase fw-bold mb-0">Register form</h6>
      <p class="text-muted">Please fill in all the fields.</p>
      <RegisterForm ref="form" :is-email-taken="isEmailTaken" @submit="onSubmit" />
    </div>
  </div>
</template>
