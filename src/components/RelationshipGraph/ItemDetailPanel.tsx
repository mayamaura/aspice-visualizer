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
            <div key={i} className="text-xs font-semibold text-gray-300 mt-2 first:mt-0">
              {text}
            </div>
          )
        }
        if (c.type === 'note') {
          return (
            <div key={i} className="text-xs text-gray-500 italic leading-relaxed">
              {text}
            </div>
          )
        }
        const lines = text.split('\n')
        return (
          <div key={i} className="text-xs text-gray-400">
            <span className="text-gray-600 mr-1">•</span>
            {lines[0]}
            {lines.slice(1).map((sub, j) => (
              <div key={j} className="ml-3 text-gray-500">{sub}</div>
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
    <div className="flex flex-col w-80 shrink-0 bg-gray-950 border-l border-gray-800 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-emerald-950 border-b border-emerald-900 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-bold text-emerald-400 mb-1">{item.id}</div>
          <div className="text-base font-semibold text-emerald-100 leading-snug">
            {t(item.name, lang)}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white mt-0.5 shrink-0">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {item.description && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {lang === 'en' ? 'Description' : '説明'}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">{t(item.description, lang)}</p>
          </div>
        )}

        {item.characteristics.length > 0 && (
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              {lang === 'en' ? 'Characteristics' : '特性'}
            </div>
            <CharacteristicList characteristics={item.characteristics} lang={lang} />
          </div>
        )}

        {item.characteristics.length === 0 && !item.description && (
          <p className="text-sm text-gray-500 italic">
            {lang === 'en' ? 'No details available.' : '詳細情報はありません。'}
          </p>
        )}
      </div>
    </div>
  )
}
