import { X } from 'lucide-react'
import type { Process, InformationItem, Language } from '../../types/aspice'
import { t } from '../../store/languageStore'
import { PROCESS_GROUPS } from '../../data'
import { groupColorHex } from '../../utils/themeColors'

interface Props {
  process: Process
  item: InformationItem
  lang: Language
  onClose: () => void
}

export function CellDetailPopup({ process, item, lang, onClose }: Props) {
  const groupMeta = PROCESS_GROUPS.find((g) => g.id === process.group)!

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        className="bg-surface border border-line rounded-xl shadow-2xl w-[480px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ヘッダー */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-line-subtle">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="text-xs font-bold px-2 py-0.5 rounded"
                style={{ background: groupColorHex(groupMeta.id, 'surface'), color: groupColorHex(groupMeta.id, 'text') }}
              >
                {process.group}
              </span>
              <span className="text-sm font-bold text-content">{process.id}</span>
            </div>
            <p className="text-xs text-content-2">{t(process.name, lang)}</p>
          </div>
          <button onClick={onClose} className="text-content-muted hover:text-content mt-0.5">
            <X size={16} />
          </button>
        </div>

        {/* プロセス目的 */}
        <div className="px-5 py-4 border-b border-line-subtle">
          <p className="text-xs font-semibold text-content-2 mb-1.5">
            {lang === 'en' ? 'Process Purpose' : 'プロセス目的'}
          </p>
          <p className="text-xs text-content-2 leading-relaxed">{t(process.purpose, lang)}</p>
        </div>

        {/* 情報項目詳細 */}
        <div className="px-5 py-4">
          <p className="text-xs font-semibold text-content-2 mb-2">
            {lang === 'en' ? 'Output Information Item' : 'アウトプット情報項目'}
          </p>
          <div className="bg-surface-2 rounded-lg p-3 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent font-bold">{item.id}</span>
              <span className="text-xs text-content-2">{t(item.name, lang)}</span>
            </div>
            {item.description && (
              <p className="text-xs text-content-2 leading-relaxed">{t(item.description, lang)}</p>
            )}
            {item.characteristics.length > 0 && (
              <div className="pt-1 space-y-1">
                {item.characteristics.map((c, i) => {
                  const text = lang === 'ja' && c.ja ? c.ja : c.en
                  if (c.type === 'category') {
                    return (
                      <p key={i} className="text-xs font-semibold text-content mt-1 first:mt-0">{text}</p>
                    )
                  }
                  if (c.type === 'note') {
                    return (
                      <p key={i} className="text-xs text-content-muted italic">{text}</p>
                    )
                  }
                  return (
                    <p key={i} className="text-xs text-content-2">
                      <span className="text-content-muted mr-1">•</span>{text}
                    </p>
                  )
                })}
              </div>
            )}
          </div>

          {/* 対応するプロセス成果 */}
          {(() => {
            const outputItem = process.output_information_items.find((o) => o.id === item.id)
            if (!outputItem || outputItem.outcome_refs.length === 0) return null
            const outcomes = process.outcomes.filter((o) => outputItem.outcome_refs.includes(o.id))
            if (outcomes.length === 0) return null
            return (
              <div className="mt-3">
                <p className="text-xs font-semibold text-content-2 mb-1.5">
                  {lang === 'en' ? 'Related Outcomes' : '関連プロセス成果'}
                </p>
                <div className="space-y-1">
                  {outcomes.map((o) => (
                    <div key={o.id} className="flex gap-2 text-xs text-content-2">
                      <span className="text-content-muted shrink-0">oc.{o.id}</span>
                      <span>{t(o.text, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })()}
        </div>
      </div>
    </div>
  )
}
