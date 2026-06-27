import { useState } from 'react'

export interface ToastItem { id: number; message: string }

let toasts: ToastItem[] = []
let nextId = 1
const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())

export function toast(message: string) {
  const item = { id: nextId++, message }
  toasts = [...toasts, item]
  emit()
  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== item.id)
    emit()
  }, 3000)
}

export function useToasts(): ToastItem[] {
  const [, force] = useState(0)
  useState(() => {
    const update = () => force((n) => n + 1)
    listeners.add(update)
    return () => listeners.delete(update)
  })
  return toasts
}
