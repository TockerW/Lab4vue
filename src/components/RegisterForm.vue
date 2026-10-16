<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { ParticipantInput } from '../types/participant'
import {
  todayISO, validateBirthDate, validateEmail, validateName, validatePhone,
} from '../utils/validators'

const props = withDefaults(
  defineProps<{
    initial?: ParticipantInput
    submitLabel?: string
    isEmailTaken: (email: string) => boolean
  }>(),
  { initial: undefined, submitLabel: 'Save' },
)
const emit = defineEmits<{ submit: [values: ParticipantInput] }>()

const empty = (): ParticipantInput => ({ name: '', birthDate: '', email: '', phone: '' })
const form = reactive<ParticipantInput>(props.initial ? { ...props.initial } : empty())
const touched = reactive({ name: false, birthDate: false, email: false, phone: false })
const submitted = ref(false)

const errors = computed(() => ({
  name: validateName(form.name),
  birthDate: validateBirthDate(form.birthDate),
  email:
    validateEmail(form.email) ||
    (props.isEmailTaken(form.email.trim()) ? 'Participant with this email already exists.' : ''),
  phone: validatePhone(form.phone),
}))

const shown = (key: keyof ParticipantInput): string =>
  touched[key] || submitted.value ? errors.value[key] : ''

const isValid = computed(() => Object.values(errors.value).every((e) => !e))

function reset(): void {
  Object.assign(form, empty())
  Object.assign(touched, { name: false, birthDate: false, email: false, phone: false })
  submitted.value = false // валідація не спрацьовує після очищення
}

function onSubmit(): void {
  submitted.value = true
  if (!isValid.value) return
  emit('submit', {
    name: form.name.trim(),
    birthDate: form.birthDate,
    email: form.email.trim(),
    phone: form.phone.trim(),
  })
}

defineExpose({ reset })
</script>

<template>
  <form novalidate @submit.prevent="onSubmit" @keydown.enter.prevent="onSubmit">
    <BaseInput id="name" v-model="form.name" label="Name" placeholder="Enter user name"
      :error="shown('name')" @blur="touched.name = true" />
    <BaseInput id="birthDate" v-model="form.birthDate" label="Date of Birth" type="date"
      :max="todayISO()" :error="shown('birthDate')" @blur="touched.birthDate = true" />
    <BaseInput id="email" v-model="form.email" label="Email" placeholder="Enter email"
      :error="shown('email')" @blur="touched.email = true" />
    <BaseInput id="phone" v-model="form.phone" label="Phone number" placeholder="Enter Phone number"
      :error="shown('phone')" @blur="touched.phone = true" />
    <div class="text-end mt-4">
      <BaseButton type="submit">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
