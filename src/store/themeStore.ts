import { useState } from 'react'
import { loadSetting, saveSetting, STORAGE_KEYS } from '../utils/persistence'

export type Theme = 'dark' | 'light'

function detectInitial(): Theme {
  const saved = loadSetting<Theme | null>(STORAGE_KEYS.theme, null)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

let currentTheme: Theme = detectInitial()
const listeners = new Set<() => void>()

function applyToDom(theme: Theme) {
  // ライト時のみ <html> に .light を付与（既定ダークは無印）
  document.documentElement.classList.toggle('light', theme === 'light')
}
applyToDom(currentTheme)

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme)

  const toggle = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
    saveSetting(STORAGE_KEYS.theme, currentTheme)
    applyToDom(currentTheme)
    listeners.forEach((l) => l())
  }

  useState(() => {
    const update = () => setTheme(currentTheme)
    listeners.add(update)
    return () => listeners.delete(update)
  })

  return [theme, toggle]
}
