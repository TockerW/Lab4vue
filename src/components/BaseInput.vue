<script setup lang="ts">
withDefaults(
  defineProps<{ label: string; id: string; type?: string; placeholder?: string; error?: string; max?: string }>(),
  { type: 'text', placeholder: '', error: '', max: undefined },
)
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ blur: [] }>()
</script>

<template>
  <div class="mb-3">
    <label :for="id" class="form-label fw-semibold mb-1">{{ label }}</label>
    <input
      :id="id"
      v-model="model"
      :type="type"
      :max="max"
      :placeholder="placeholder"
      :class="['form-control', 'form-control-sm', { 'is-invalid': error }]"
      @blur="emit('blur')"
    />
    <div v-if="error" class="error-text">{{ error }}</div>
  </div>
</template>
