import { X } from 'lucide-react'
import type { InformationItem, Characteristic, Language } from '../../types/aspice'
import { t } from '../../store/languageStore'

function CharacteristicList({ characteristics, lang }: { characteristics: Characteristic[]; lang: Language }) {
  return (
    <div className="space-y-1">
      {characteristics.map((c, i) => {
        const text = lang === 'ja' && c.ja ? c.ja : c.en
        if (c.type === 'category') {
          return (
            <div key={i} className="text-xs font-semibold text-content mt-2 first:mt-0">
              {text}
            </div>
          )
        }
        if (c.type === 'note') {
          return (
            <div key={i} className="text-xs text-content-muted italic leading-relaxed">
              {text}
            </div>
          )
        }
        const lines = text.split('\n')
        return (
          <div key={i} className="text-xs text-content-2">
            <span className="text-content-muted mr-1">•</span>
            {lines[0]}
            {lines.slice(1).map((sub, j) => (
              <div key={j} className="ml-3 text-content-muted">{sub}</div>
            ))}
          </div>
        )
      })}
    </div>
  )
}

interface Props {
  item: InformationItem
  lang: Language
  onClose: () => void
}

export function ItemDetailPanel({ item, lang, onClose }: Props) {
  return (
    <div className="flex flex-col w-80 shrink-0 bg-bg border-l border-line-subtle overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-item-bg border-b border-line-subtle flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-bold text-item mb-1">{item.id}</div>
          <div className="text-base font-semibold text-content leading-snug">
            {t(item.name, lang)}
          </div>
        </div>
        <button onClick={onClose} className="text-content-2 hover:text-content mt-0.5 shrink-0">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {item.description && (
          <div>
            <div className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-2">
              {lang === 'en' ? 'Description' : '説明'}
            </div>
            <p className="text-sm text-content leading-relaxed">{t(item.description, lang)}</p>
          </div>
        )}

        {item.characteristics.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-2">
              {lang === 'en' ? 'Characteristics' : '特性'}
            </div>
            <CharacteristicList characteristics={item.characteristics} lang={lang} />
          </div>
        )}

        {item.characteristics.length === 0 && !item.description && (
          <p className="text-sm text-content-muted italic">
            {lang === 'en' ? 'No details available.' : '詳細情報はありません。'}
          </p>
        )}
      </div>
    </div>
  )
}
