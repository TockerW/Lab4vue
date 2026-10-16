export interface ParticipantInput {
  name: string
  birthDate: string // 
  email: string
  phone: string
}

export interface Participant extends ParticipantInput {
  id: string
}

export type SortKey = 'name' | 'birthDate'
export type SortDir = 'asc' | 'desc'
