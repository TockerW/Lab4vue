<script setup lang="ts">
import WinnerItem from './WinnerItem.vue'
import BaseButton from './BaseButton.vue'
import type { Participant } from '../types/participant'

defineProps<{ winners: Participant[]; canPick: boolean }>()
const emit = defineEmits<{ 'new-winner': []; remove: [id: string] }>()
</script>

<template>
  <div class="card mb-3">
    <div class="card-body d-flex gap-3 align-items-center">
      <div class="winners-field">
        <WinnerItem v-for="w in winners" :key="w.id" :name="w.name" @remove="emit('remove', w.id)" />
        <span v-if="!winners.length">Winners</span>
      </div>
      <BaseButton :disabled="!canPick" @click="emit('new-winner')">New winner</BaseButton>
    </div>
  </div>
</template>
