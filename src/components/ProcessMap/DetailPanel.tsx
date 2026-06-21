import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { useState, useMemo } from 'react'
import type { Process, ProcessGroup_Meta, Characteristic } from '../../types/aspice'
import type { Language } from '../../types/aspice'
import { t } from '../../store/languageStore'
import { INFORMATION_ITEMS, ALL_PROCESSES, PROCESS_GROUPS } from '../../data'
import { groupColorHex } from '../../utils/themeColors'

interface Props {
  process: Process
  groupMeta: ProcessGroup_Meta
  lang: Language
  onClose: () => void
  onSelectProcess?: (p: Process) => void
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-line-subtle rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 bg-surface hover:bg-surface-2 transition-colors text-sm font-semibold text-content"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="px-4 py-3 space-y-2">{children}</div>}
    </div>
  )
}

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

export function DetailPanel({ process, groupMeta, lang, onClose, onSelectProcess }: Props) {
  const relatedProcesses = useMemo(() => {
    const myItemIds = new Set(process.output_information_items.map((o) => o.id))
    return (ALL_PROCESSES as Process[])
      .filter(
        (p) =>
          p.id !== process.id &&
          p.output_information_items.some((o) => myItemIds.has(o.id))
      )
      .map((p) => ({
        process: p,
        sharedItems: p.output_information_items
          .filter((o) => myItemIds.has(o.id))
          .map((o) => o.id),
      }))
  }, [process])

  const groupText = groupColorHex(groupMeta.id, 'text')

  return (
    <div className="flex flex-col h-full bg-bg border-l border-line-subtle">
      {/* Header */}
      <div
        className="px-5 py-4 border-b border-line-subtle flex items-start justify-between gap-3"
        style={{ background: groupColorHex(groupMeta.id, 'surface') }}
      >
        <div>
          <div className="font-mono text-sm font-bold mb-1" style={{ color: groupText }}>{process.id}</div>
          <div className="text-lg font-semibold leading-snug" style={{ color: groupText }}>
            {t(process.name, lang)}
          </div>
        </div>
        <button onClick={onClose} className="text-content-2 hover:text-content mt-0.5 shrink-0">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Purpose */}
        <Section title={lang === 'en' ? 'Purpose' : 'プロセス目的'}>
          <p className="text-sm text-content-2 leading-relaxed">{t(process.purpose, lang)}</p>
        </Section>

        {/* Outcomes */}
        <Section title={lang === 'en' ? `Outcomes (${process.outcomes.length})` : `プロセス成果 (${process.outcomes.length})`}>
          <ol className="space-y-2">
            {process.outcomes.map((oc) => (
              <li key={oc.id} className="flex gap-2 text-sm">
                <span className="font-mono text-xs shrink-0 mt-0.5 opacity-80" style={{ color: groupText }}>
                  {process.id}.{oc.id}
                </span>
                <span className="text-content leading-relaxed">{t(oc.text, lang)}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Base Practices */}
        <Section title={lang === 'en' ? `Base Practices (${process.base_practices.length})` : `基本プラクティス (${process.base_practices.length})`}>
          <div className="space-y-3">
            {process.base_practices.map((bp) => (
              <div key={bp.id} className="bg-surface rounded-lg p-3 space-y-1.5">
                <div className="flex gap-2 items-baseline">
                  <span className="font-mono text-xs font-bold" style={{ color: groupText }}>{bp.id}</span>
                  <span className="text-sm font-medium text-content">{t(bp.name, lang)}</span>
                </div>
                <p className="text-xs text-content-2 leading-relaxed">{t(bp.description, lang)}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {bp.outcome_refs.map((refId) => (
                    <span key={refId} className="text-xs bg-surface-2 text-content-2 px-1.5 py-0.5 rounded font-mono">
                      →{process.id}.{refId}
                    </span>
                  ))}
                </div>
                {bp.notes.length > 0 && (
                  <div className="pt-1 border-t border-line-subtle space-y-1">
                    {bp.notes.map((note) => (
                      <div key={note.id} className="text-xs text-content-muted italic leading-relaxed">
                        {t(note.text, lang)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Output Information Items */}
        <Section title={lang === 'en' ? `Output Information Items (${process.output_information_items.length})` : `アウトプット情報項目 (${process.output_information_items.length})`}>
          <div className="space-y-2">
            {process.output_information_items.map((poi) => {
              const item = INFORMATION_ITEMS.find((it) => it.id === poi.id)
              return (
                <div key={poi.id} className="bg-surface rounded-lg p-3">
                  <div className="flex gap-2 items-baseline mb-1">
                    <span className="font-mono text-xs text-item font-bold">{poi.id}</span>
                    <span className="text-sm text-content">
                      {item ? t(item.name, lang) : poi.id}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1.5">
                    {poi.outcome_refs.map((refId) => (
                      <span key={refId} className="text-xs bg-surface-2 text-content-muted px-1 py-0.5 rounded font-mono">
                        oc.{refId}
                      </span>
                    ))}
                  </div>
                  {item && item.characteristics.length > 0 && (
                    <CharacteristicList characteristics={item.characteristics} lang={lang} />
                  )}
                </div>
              )
            })}
          </div>
        </Section>

        {/* Related Processes */}
        {relatedProcesses.length > 0 && (
          <Section
            title={lang === 'en' ? `Related Processes (${relatedProcesses.length})` : `関連プロセス (${relatedProcesses.length})`}
            defaultOpen={false}
          >
            <div className="space-y-2">
              {relatedProcesses.map(({ process: rp, sharedItems }) => {
                const rpGroup = PROCESS_GROUPS.find((g) => g.id === rp.group)!
                return (
                  <div key={rp.id} className="bg-surface rounded-lg p-3">
                    <button
                      onClick={() => onSelectProcess?.(rp)}
                      className={`flex gap-2 items-baseline w-full text-left hover:opacity-80 transition-opacity ${onSelectProcess ? 'cursor-pointer' : 'cursor-default'}`}
                    >
                      <span className="font-mono text-xs font-bold shrink-0" style={{ color: groupColorHex(rpGroup.id, 'text') }}>{rp.id}</span>
                      <span className="text-sm text-content leading-snug">{t(rp.name, lang)}</span>
                    </button>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {sharedItems.map((itemId) => (
                        <span key={itemId} className="text-xs bg-surface-2 text-item px-1.5 py-0.5 rounded font-mono">
                          {itemId}
                        </span>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </Section>
        )}
      </div>
    </div>
  )
}
