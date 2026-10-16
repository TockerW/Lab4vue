<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import WinnersBlock from './components/WinnersBlock.vue'
import RegistrationBlock from './components/RegistrationBlock.vue'
import ParticipantsTable from './components/ParticipantsTable.vue'
import SearchBar from './components/SearchBar.vue'
import BaseModal from './components/BaseModal.vue'
import BaseButton from './components/BaseButton.vue'
import RegisterForm from './components/RegisterForm.vue'
import type { Participant, ParticipantInput, SortDir, SortKey } from './types/participant'

const STORAGE_KEY = 'lottery-state'
const MAX_WINNERS = 3

function load(): { participants: Participant[]; winnerIds: string[] } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    // пошкоджені дані ігноруємо 
  }
  return { participants: [], winnerIds: [] }
}

const saved = load()
const participants = ref<Participant[]>(saved.participants)
const winnerIds = ref<string[]>(saved.winnerIds)

watch([participants, winnerIds], () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ participants: participants.value, winnerIds: winnerIds.value }))
}, { deep: true })

// переможці
const winners = computed(() =>
  winnerIds.value.map((id) => participants.value.find((p) => p.id === id)).filter((p): p is Participant => !!p),
)
const candidates = computed(() => participants.value.filter((p) => !winnerIds.value.includes(p.id)))
const canPick = computed(() => winnerIds.value.length < MAX_WINNERS && candidates.value.length > 0)

function pickWinner(): void {
  if (!canPick.value) return
  const c = candidates.value[Math.floor(Math.random() * candidates.value.length)]
  winnerIds.value.push(c.id)
}
const removeWinner = (id: string): void => {
  winnerIds.value = winnerIds.value.filter((w) => w !== id)
}

// учасники
const isEmailTaken = (email: string, exceptId?: string): boolean =>
  participants.value.some((p) => p.id !== exceptId && p.email.toLowerCase() === email.toLowerCase())

function addParticipant(values: ParticipantInput): void {
  participants.value.push({ id: crypto.randomUUID(), ...values })
}

// фільтр + сортування 
const filter = ref('')
const sortKey = ref<SortKey | null>(null)
const sortDir = ref<SortDir>('asc')

function toggleSort(key: SortKey): void {
  if (sortKey.value === key) sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  else { sortKey.value = key; sortDir.value = 'asc' }
}

const visible = computed(() => {
  const q = filter.value.trim().toLowerCase()
  const list = participants.value.filter((p) => p.name.toLowerCase().includes(q))
  const key = sortKey.value
  if (!key) return list
  const k = sortDir.value === 'asc' ? 1 : -1
  return [...list].sort((a, b) => a[key].localeCompare(b[key]) * k)
})

// редагування
const editing = ref<Participant | null>(null)
function updateParticipant(values: ParticipantInput): void {
  if (!editing.value) return
  const target = participants.value.find((p) => p.id === editing.value?.id)
  if (target) Object.assign(target, values)
  editing.value = null
}

// видалення
const deleting = ref<Participant | null>(null)
function confirmDelete(): void {
  if (!deleting.value) return
  const id = deleting.value.id
  participants.value = participants.value.filter((p) => p.id !== id)
  removeWinner(id)
  deleting.value = null
}
</script>

<template>
  <main class="app">
    <WinnersBlock :winners="winners" :can-pick="canPick" @new-winner="pickWinner" @remove="removeWinner" />
    <RegistrationBlock :is-email-taken="(e) => isEmailTaken(e)" @add="addParticipant" />

    <div class="card">
      <div class="card-body">
        <SearchBar @filter-by-name="filter = $event" />
        <ParticipantsTable :participants="visible" :sort-key="sortKey" :sort-dir="sortDir"
          @sort="toggleSort" @edit="editing = $event" @delete="deleting = $event" />
      </div>
    </div>

    <BaseModal :show="!!editing" title="Редагування учасника" @close="editing = null">
      <RegisterForm v-if="editing" :key="editing.id" :initial="editing" submit-label="Оновити дані"
        :is-email-taken="(e) => isEmailTaken(e, editing?.id)" @submit="updateParticipant" />
    </BaseModal>

    <BaseModal :show="!!deleting" title="Видалення учасника" @close="deleting = null">
      <p v-if="deleting" class="mb-0">
        Ви дійсно бажаєте видалити учасника "{{ deleting.name }}", "{{ deleting.email }}"?
      </p>
      <template #footer>
        <BaseButton variant="danger" @click="confirmDelete">Так</BaseButton>
        <BaseButton variant="secondary" @click="deleting = null">Ні</BaseButton>
      </template>
    </BaseModal>
  </main>
</template>
