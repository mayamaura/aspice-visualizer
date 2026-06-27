import { useRef } from 'react'
import { X } from 'lucide-react'
import type { Language } from '../../types/aspice'
import { VIEWS } from '../../data/viewMeta'
import { useFocusTrap } from '../../hooks/useFocusTrap'

interface Props {
  open: boolean
  onClose: () => void
  lang: Language
}

const SHORTCUTS: { keys: string; en: string; ja: string }[] = [
  { keys: 'Ctrl/⌘ K  ·  /', en: 'Focus search', ja: '検索にフォーカス' },
  { keys: '↑ ↓', en: 'Navigate results', ja: '検索結果を移動' },
  { keys: 'Enter', en: 'Open selected', ja: '選択中を開く' },
  { keys: '1 – 5', en: 'Switch view', ja: 'ビュー切替' },
  { keys: '?', en: 'Toggle this help', ja: 'このヘルプを開閉' },
  { keys: 'Esc', en: 'Close search', ja: '検索を閉じる' },
]

export function HelpOverlay({ open, onClose, lang }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useFocusTrap(open, dialogRef, onClose)

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={lang === 'en' ? 'Keyboard shortcuts and help' : 'ヘルプ'}
        className="w-[28rem] max-w-[90vw] max-h-[80vh] overflow-y-auto bg-surface border border-line rounded-lg shadow-2xl p-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-content">
            {lang === 'en' ? 'Help' : 'ヘルプ'}
          </h2>
          <button
            onClick={onClose}
            aria-label={lang === 'en' ? 'Close' : '閉じる'}
            className="text-content-muted hover:text-content transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Section 1: Keyboard Shortcuts */}
        <h3 className="text-xs font-semibold text-content-2 uppercase tracking-wide mb-2">
          {lang === 'en' ? 'Keyboard Shortcuts' : 'キーボードショートカット'}
        </h3>
        <dl className="space-y-1.5 text-xs mb-5">
          {SHORTCUTS.map(({ keys, en, ja }) => (
            <div key={keys} className="flex items-center justify-between gap-4">
              <dt className="text-content-2">{lang === 'en' ? en : ja}</dt>
              <dd>
                <kbd className="px-1.5 py-0.5 rounded border border-line bg-surface-2 text-content-muted font-mono text-[10px]">
                  {keys}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>

        {/* Section 2: Views */}
        <h3 className="text-xs font-semibold text-content-2 uppercase tracking-wide mb-2">
          {lang === 'en' ? 'Views' : 'ビュー'}
        </h3>
        <ul className="space-y-2 text-xs">
          {VIEWS.map(({ id, icon: Icon, labelEn, labelJa, descEn, descJa }) => (
            <li key={id} className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-content-muted">
                <Icon size={13} />
              </span>
              <div>
                <span className="font-medium text-content">
                  {lang === 'en' ? labelEn : labelJa}
                </span>
                <span className="text-content-muted ml-1.5">
                  {lang === 'en' ? descEn : descJa}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
