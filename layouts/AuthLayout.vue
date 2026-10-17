<script setup lang="ts">
import AppLogo from '@/components/AppLogo.vue'
</script>

<template>
  <main class="app" style="max-width: 420px">
    <div class="text-center mb-4"><AppLogo /></div>
    <slot />
  </main>
</template>
