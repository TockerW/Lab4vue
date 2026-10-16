<script setup lang="ts">
withDefaults(defineProps<{ variant?: string; type?: 'button' | 'submit'; disabled?: boolean }>(), {
  variant: 'primary',
  type: 'button',
  disabled: false,
})
</script>

<template>
  <button :type="type" :disabled="disabled" :class="['btn', `btn-${variant}`, 'btn-sm']">
    <slot />
  </button>
</template>
