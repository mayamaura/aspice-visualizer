import { useState } from 'react'
import { X } from 'lucide-react'
import type { Language } from '../../types/aspice'
import { loadSetting, saveSetting, STORAGE_KEYS } from '../../utils/persistence'

interface Props {
  lang: Language
  onOpenHelp: () => void
}

export function OnboardingBanner({ lang, onOpenHelp }: Props) {
  const [visible, setVisible] = useState(
    () => loadSetting(STORAGE_KEYS.onboarded, false) === false,
  )

  if (!visible) return null

  const handleClose = () => {
    saveSetting(STORAGE_KEYS.onboarded, true)
    setVisible(false)
  }

  return (
    <div className="shrink-0 flex items-center gap-3 px-5 py-2 bg-surface border-b border-line-subtle text-xs">
      <p className="flex-1 text-content-2 leading-snug">
        {lang === 'en'
          ? 'Welcome — switch views with the tabs, press Ctrl/⌘ K to search, toggle theme with the sun/moon button.'
          : 'ようこそ — タブでビュー切替、Ctrl/⌘K で検索、太陽/月ボタンでテーマ切替ができます。'}
      </p>
      <button
        onClick={onOpenHelp}
        className="shrink-0 text-accent hover:underline transition-colors"
      >
        {lang === 'en' ? 'View shortcuts' : 'ショートカット一覧'}
      </button>
      <button
        onClick={handleClose}
        aria-label={lang === 'en' ? 'Dismiss welcome banner' : 'バナーを閉じる'}
        className="shrink-0 text-content-muted hover:text-content transition-colors"
      >
        <X size={13} />
      </button>
    </div>
  )
}
