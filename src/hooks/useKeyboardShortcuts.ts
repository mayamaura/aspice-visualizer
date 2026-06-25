import { useEffect, useRef } from 'react'

interface Handlers {
  onSearchFocus: () => void
  onSelectView: (index: number) => void // 0..4 → VIEWS index
  onToggleHelp: () => void
}

function isTypingTarget(t: EventTarget | null): boolean {
  const el = t as HTMLElement | null
  if (!el || !el.tagName) return false
  const tag = el.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable
}

export function useKeyboardShortcuts(handlers: Handlers) {
  const ref = useRef(handlers)
  ref.current = handlers
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const h = ref.current
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault(); h.onSearchFocus(); return
      }
      if (isTypingTarget(e.target)) return
      if (e.key === '/') { e.preventDefault(); h.onSearchFocus(); return }
      if (e.key === '?') { e.preventDefault(); h.onToggleHelp(); return }
      if (!e.metaKey && !e.ctrlKey && !e.altKey && e.key >= '1' && e.key <= '5') {
        h.onSelectView(Number(e.key) - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
}
