<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{ show: boolean; title: string }>()
const emit = defineEmits<{ close: [] }>()
const root = ref<HTMLElement | null>(null)

watch(() => props.show, async (open) => {
  if (open) {
    await nextTick()
    root.value?.focus() // ловити Esc
  }
})
</script>

<template>
  <Transition name="modal-fade">
    <div v-if="show" ref="root" class="modal-backdrop-custom" tabindex="-1"
      @keydown.esc="emit('close')" @click.self="emit('close')">
      <div class="modal-content">
        <div class="modal-header">
          <h6 class="modal-title">{{ title }}</h6>
          <button type="button" class="btn-close" aria-label="Close" @click="emit('close')" />
        </div>
        <div class="modal-body"><slot /></div>
        <div v-if="$slots.footer" class="modal-footer"><slot name="footer" /></div>
      </div>
    </div>
  </Transition>
</template>
