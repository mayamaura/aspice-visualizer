import { useState, useCallback } from 'react'
import type { Language } from '../types/aspice'

let currentLang: Language = 'en'
const listeners = new Set<() => void>()

export function useLang(): [Language, () => void] {
  const [lang, setLangState] = useState<Language>(currentLang)

  const toggle = useCallback(() => {
    currentLang = currentLang === 'en' ? 'ja' : 'en'
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
