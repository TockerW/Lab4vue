<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/yup'
import * as yup from 'yup'
import BaseInput from '@/components/BaseInput.vue'
import BaseButton from '@/components/BaseButton.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const router = useRouter()
const serverError = ref('')
const loading = ref(false)

const { errors, defineField, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      username: yup.string().trim().required('This value is required.'),
      password: yup.string().required('This value is required.').min(6, 'Password must be at least 6 characters.'),
    }),
  ),
  initialValues: { username: 'emilys', password: 'emilyspass' },
})
const [username] = defineField('username')
const [password] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  loading.value = true
  try {
    await auth.login(values.username, values.password)
    const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/users'
    await router.push(redirect)
  } catch (e) {
    serverError.value = (e as Error).message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="card"><div class="card-body">
    <h6 class="text-uppercase fw-bold mb-3">Login</h6>
    <div v-if="serverError" class="alert alert-danger py-2">{{ serverError }}</div>
    <form novalidate @submit.prevent="onSubmit">
      <BaseInput id="username" v-model="username" label="Username" :error="errors.username" />
      <BaseInput id="password" v-model="password" label="Password" type="password" :error="errors.password" />
      <div class="text-end mt-4"><BaseButton type="submit" :disabled="loading">Login</BaseButton></div>
    </form>
  </div></div>
</template>
