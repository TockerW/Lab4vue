<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import type { UserFormValues } from '@/types/user'

const props = withDefaults(
  defineProps<{ initial?: Partial<UserFormValues>; submitLabel?: string; busy?: boolean }>(),
  { initial: undefined, submitLabel: 'Save', busy: false },
)
const emit = defineEmits<{ submit: [values: UserFormValues] }>()

const REQUIRED = 'This value is required.'
const schema = toTypedSchema(
  yup.object({
    firstName: yup.string().trim().required(REQUIRED),
    lastName: yup.string().trim().required(REQUIRED),
    email: yup.string().trim().required(REQUIRED).email('Invalid email address.'),
    username: yup.string().trim().required(REQUIRED),
    password: yup.string().required(REQUIRED).min(6, 'Password must be at least 6 characters.'),
    age: yup.number().typeError('Age must be a number.').required(REQUIRED).integer().min(1).max(120),
    gender: yup.string().oneOf(['male', 'female']).required(REQUIRED),
    phone: yup.string().trim().required(REQUIRED),
  }),
)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: schema,
  initialValues: { gender: 'male', ...props.initial },
})
const [firstName] = defineField('firstName')
const [lastName] = defineField('lastName')
const [email] = defineField('email')
const [username] = defineField('username')
const [password] = defineField('password')
const [age] = defineField('age')
const [gender] = defineField('gender')
const [phone] = defineField('phone')

const onSubmit = handleSubmit((values) => emit('submit', values as UserFormValues))
</script>

<template>
  <form novalidate @submit.prevent="onSubmit">
    <BaseInput id="firstName" v-model="firstName" label="First name" :error="errors.firstName" />
    <BaseInput id="lastName" v-model="lastName" label="Last name" :error="errors.lastName" />
    <BaseInput id="email" v-model="email" label="Email" :error="errors.email" />
    <BaseInput id="username" v-model="username" label="Username" :error="errors.username" />
    <BaseInput id="password" v-model="password" label="Password" type="password" :error="errors.password" />
    <BaseInput id="age" v-model="age" label="Age" type="number" :error="errors.age" />
    <div class="mb-3">
      <label for="gender" class="form-label fw-semibold mb-1">Gender</label>
      <select id="gender" v-model="gender" class="form-select form-select-sm">
        <option value="male">male</option>
        <option value="female">female</option>
      </select>
      <div v-if="errors.gender" class="error-text">{{ errors.gender }}</div>
    </div>
    <BaseInput id="phone" v-model="phone" label="Phone" :error="errors.phone" />
    <div class="text-end mt-4">
      <BaseButton type="submit" :disabled="busy">{{ submitLabel }}</BaseButton>
    </div>
  </form>
</template>
