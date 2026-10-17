<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function logout(): void {
  auth.logout()
  void router.push({ name: 'login' })
}
</script>

<template>
  <nav class="app-nav">
    <!-- Home активний лише при точному збігу, решта - і для вкладених шляхів -->
    <RouterLink to="/" active-class="" exact-active-class="active">Home</RouterLink>
    <RouterLink to="/about" active-class="active">About author</RouterLink>
    <RouterLink to="/users" active-class="active">Users</RouterLink>
    <button v-if="auth.isAuthenticated" type="button" class="nav-btn" @click="logout">Logout</button>
    <RouterLink v-else to="/login" active-class="active">Login</RouterLink>
  </nav>
</template>
