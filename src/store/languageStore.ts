import { useState, useCallback } from 'react'
import type { Language } from '../types/aspice'
import { loadSetting, saveSetting, STORAGE_KEYS } from '../utils/persistence'

function detectInitialLang(): Language {
  const saved = loadSetting<Language | null>(STORAGE_KEYS.lang, null)
  return saved === 'en' || saved === 'ja' ? saved : 'en'
}

let currentLang: Language = detectInitialLang()
const listeners = new Set<() => void>()

export function useLang(): [Language, () => void] {
  const [lang, setLangState] = useState<Language>(currentLang)

  const toggle = useCallback(() => {
    currentLang = currentLang === 'en' ? 'ja' : 'en'
    saveSetting(STORAGE_KEYS.lang, currentLang)
    listeners.forEach((l) => l())
  }, [])

  useState(() => {
    const update = () => setLangState(currentLang)
    listeners.add(update)
    return () => listeners.delete(update)
  })

  return [lang, toggle]
}

export function t(text: { en: string; ja: string }, lang: Language): string {
  return text[lang]
}
