import { X } from 'lucide-react'
import type { BasePractice, Characteristic, InformationItem, Language, Outcome, Process, ProcessGroup_Meta } from '../../types/aspice'
import { t } from '../../store/languageStore'
import { INFORMATION_ITEMS } from '../../data'
import { groupColorHex } from '../../utils/themeColors'

export type SelectedBPNode =
  | { type: 'bp'; bp: BasePractice; process: Process }
  | { type: 'outcome'; outcome: Outcome; process: Process }
  | { type: 'item'; item: InformationItem }

interface Props {
  selected: SelectedBPNode
  groupMeta: ProcessGroup_Meta
  lang: Language
  onClose: () => void
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-xs font-semibold text-content-muted uppercase tracking-wide mb-2">
      {children}
    </div>
  )
}

function CharacteristicList({ characteristics, lang }: { characteristics: Characteristic[]; lang: Language }) {
  return (
    <div className="space-y-1">
      {characteristics.map((c, i) => {
        const text = lang === 'ja' && c.ja ? c.ja : c.en
        if (c.type === 'category') {
          return <div key={i} className="text-xs font-semibold text-content mt-2 first:mt-0">{text}</div>
        }
        if (c.type === 'note') {
          return <div key={i} className="text-xs text-content-muted italic leading-relaxed">{text}</div>
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

function BPContent({ bp, process, groupMeta, lang, onClose }: { bp: BasePractice; process: Process; groupMeta: ProcessGroup_Meta; lang: Language; onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-line-subtle flex items-start justify-between gap-3"
        style={{ background: groupColorHex(groupMeta.id, 'surface') }}
      >
        <div className="min-w-0">
          <div className="font-mono text-sm font-bold mb-1" style={{ color: groupColorHex(groupMeta.id, 'text') }}>{bp.id}</div>
          <div className="text-base font-semibold text-content leading-snug">{t(bp.name, lang)}</div>
        </div>
        <button onClick={onClose} aria-label={lang === 'en' ? 'Close' : '閉じる'} className="text-content-2 hover:text-content mt-0.5 shrink-0"><X size={18} /></button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <SectionLabel>{lang === 'en' ? 'Description' : '説明'}</SectionLabel>
          <p className="text-sm text-content leading-relaxed">{t(bp.description, lang)}</p>
        </div>

        <div>
          <SectionLabel>{lang === 'en' ? 'Supports Outcomes' : '達成する成果'}</SectionLabel>
          <div className="space-y-1">
            {bp.outcome_refs.map((refId) => {
              const oc = process.outcomes.find((o) => o.id === refId)
              return (
                <div key={refId} className="flex gap-2 text-sm">
                  <span className="font-mono text-xs shrink-0 mt-0.5 opacity-80" style={{ color: groupColorHex(groupMeta.id, 'text') }}>
                    {process.id}.{refId}
                  </span>
                  <span className="text-content-2 leading-relaxed text-xs">
                    {oc ? t(oc.text, lang) : String(refId)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {bp.notes.length > 0 && (
          <div>
            <SectionLabel>{lang === 'en' ? 'Notes' : 'ノート'}</SectionLabel>
            <div className="space-y-2">
              {bp.notes.map((note) => (
                <p key={note.id} className="text-xs text-content-muted italic leading-relaxed">
                  {t(note.text, lang)}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

function OutcomeContent({ outcome, process, groupMeta, lang, onClose }: { outcome: Outcome; process: Process; groupMeta: ProcessGroup_Meta; lang: Language; onClose: () => void }) {
  const relatedBPs = process.base_practices.filter((bp) => bp.outcome_refs.includes(outcome.id))
  const relatedItems = process.output_information_items.filter((poi) => poi.outcome_refs.includes(outcome.id))

  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 bg-outcome-bg border-b border-line-subtle flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-bold text-outcome mb-1">
            {process.id}.{outcome.id}
          </div>
          <div className="text-base font-semibold text-content leading-snug">
            {t(outcome.text, lang)}
          </div>
        </div>
        <button onClick={onClose} aria-label={lang === 'en' ? 'Close' : '閉じる'} className="text-content-2 hover:text-content mt-0.5 shrink-0"><X size={18} /></button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <SectionLabel>{lang === 'en' ? `Supported by BPs (${relatedBPs.length})` : `達成するBP (${relatedBPs.length})`}</SectionLabel>
          {relatedBPs.length > 0 ? (
            <div className="space-y-2">
              {relatedBPs.map((bp) => (
                <div key={bp.id} className="bg-surface rounded-lg p-3">
                  <div className="flex gap-2 items-baseline mb-1">
                    <span className="font-mono text-xs font-bold" style={{ color: groupColorHex(groupMeta.id, 'text') }}>{bp.id}</span>
                    <span className="text-xs text-content">{t(bp.name, lang)}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-content-muted italic">{lang === 'en' ? 'None' : 'なし'}</p>
          )}
        </div>

        <div>
          <SectionLabel>{lang === 'en' ? `Produces Items (${relatedItems.length})` : `生成する情報項目 (${relatedItems.length})`}</SectionLabel>
          {relatedItems.length > 0 ? (
            <div className="space-y-1">
              {relatedItems.map((poi) => {
                const item = INFORMATION_ITEMS.find((i) => i.id === poi.id)
                return (
                  <div key={poi.id} className="flex gap-2 items-baseline">
                    <span className="font-mono text-xs text-item font-bold">{poi.id}</span>
                    <span className="text-xs text-content-2">{item ? t(item.name, lang) : poi.id}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-xs text-content-muted italic">{lang === 'en' ? 'None' : 'なし'}</p>
          )}
        </div>
      </div>
    </>
  )
}

function ItemContent({ item, lang, onClose }: { item: InformationItem; lang: Language; onClose: () => void }) {
  return (
    <>
      {/* Header */}
      <div className="px-5 py-4 bg-item-bg border-b border-line-subtle flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-sm font-bold text-item mb-1">{item.id}</div>
          <div className="text-base font-semibold text-content leading-snug">{t(item.name, lang)}</div>
        </div>
        <button onClick={onClose} aria-label={lang === 'en' ? 'Close' : '閉じる'} className="text-content-2 hover:text-content mt-0.5 shrink-0"><X size={18} /></button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {item.description && (
          <div>
            <SectionLabel>{lang === 'en' ? 'Description' : '説明'}</SectionLabel>
            <p className="text-sm text-content leading-relaxed">{t(item.description, lang)}</p>
          </div>
        )}

        {item.characteristics.length > 0 && (
          <div>
            <SectionLabel>{lang === 'en' ? 'Characteristics' : '特性'}</SectionLabel>
            <CharacteristicList characteristics={item.characteristics} lang={lang} />
          </div>
        )}

        {item.characteristics.length === 0 && !item.description && (
          <p className="text-sm text-content-muted italic">
            {lang === 'en' ? 'No details available.' : '詳細情報はありません。'}
          </p>
        )}
      </div>
    </>
  )
}

export function BPLevelDetailPanel({ selected, groupMeta, lang, onClose }: Props) {
  return (
    <div className="flex flex-col w-80 shrink-0 bg-bg border-l border-line-subtle overflow-hidden animate-panel-in">
      {selected.type === 'bp' && (
        <BPContent bp={selected.bp} process={selected.process} groupMeta={groupMeta} lang={lang} onClose={onClose} />
      )}
      {selected.type === 'outcome' && (
        <OutcomeContent outcome={selected.outcome} process={selected.process} groupMeta={groupMeta} lang={lang} onClose={onClose} />
      )}
      {selected.type === 'item' && (
        <ItemContent item={selected.item} lang={lang} onClose={onClose} />
      )}
    </div>
  )
}
