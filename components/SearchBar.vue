<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const emit = defineEmits<{ 'filter-by-name': [value: string] }>()
const props = defineProps<{ initial?: string }>()
const query = ref(props.initial ?? '')
let timer: ReturnType<typeof setTimeout> | undefined

watch(query, (value) => {
  clearTimeout(timer)
  timer = setTimeout(() => emit('filter-by-name', value), 300) // debounce 300 мс
})
onBeforeUnmount(() => clearTimeout(timer))
</script>

<template>
  <input v-model="query" type="search" class="form-control form-control-sm mb-3" placeholder="Search by name" />
</template>
