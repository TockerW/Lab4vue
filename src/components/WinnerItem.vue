<script setup lang="ts">
defineProps<{ name: string }>()
const emit = defineEmits<{ remove: [] }>()
</script>

<template>
  <span class="winner-tag">
    {{ name }}
    <button type="button" aria-label="Remove winner" @click="emit('remove')">×</button>
  </span>
</template>
