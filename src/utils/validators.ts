const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^\+380\d{9}$/
const REQUIRED = 'This value is required.'

export const todayISO = (): string => new Date().toISOString().slice(0, 10)

export const validateName = (v: string): string => (v.trim() ? '' : REQUIRED)

export const validateBirthDate = (v: string): string => {
  if (!v) return REQUIRED
  return v > todayISO() ? 'Date of birth cannot be in the future.' : ''
}

export const validateEmail = (v: string): string => {
  if (!v.trim()) return REQUIRED
  return EMAIL_RE.test(v.trim()) ? '' : 'Invalid email address.'
}

export const validatePhone = (v: string): string => {
  if (!v.trim()) return REQUIRED
  return PHONE_RE.test(v.trim()) ? '' : 'Phone must be in format +380XXXXXXXXX.'
}

export const formatDate = (iso: string): string => {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}
