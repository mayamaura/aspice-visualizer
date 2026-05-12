import { X, ChevronDown, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Process, ProcessGroup_Meta } from '../../types/aspice'
import type { Language } from '../../types/aspice'
import { t } from '../../store/languageStore'

interface Props {
  process: Process
  groupMeta: ProcessGroup_Meta
  lang: Language
  onClose: () => void
}

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border border-gray-800 rounded-lg overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-2.5 bg-gray-900 hover:bg-gray-800 transition-colors text-sm font-semibold text-gray-200"
        onClick={() => setOpen(!open)}
      >
        {title}
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
      </button>
      {open && <div className="px-4 py-3 space-y-2">{children}</div>}
    </div>
  )
}

export function DetailPanel({ process, groupMeta, lang, onClose }: Props) {
  return (
    <div className="flex flex-col h-full bg-gray-950 border-l border-gray-800">
      {/* Header */}
      <div className={`px-5 py-4 ${groupMeta.color} border-b border-gray-800 flex items-start justify-between gap-3`}>
        <div>
          <div className={`font-mono text-sm font-bold ${groupMeta.textColor} mb-1`}>{process.id}</div>
          <div className={`text-lg font-semibold ${groupMeta.textColor} leading-snug`}>
            {t(process.name, lang)}
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white mt-0.5 shrink-0">
          <X size={18} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {/* Purpose */}
        <Section title={lang === 'en' ? 'Purpose' : 'プロセス目的'}>
          <p className="text-sm text-gray-400 leading-relaxed">{t(process.purpose, lang)}</p>
        </Section>

        {/* Outcomes */}
        <Section title={lang === 'en' ? `Outcomes (${process.outcomes.length})` : `プロセス成果 (${process.outcomes.length})`}>
          <ol className="space-y-2">
            {process.outcomes.map((oc) => (
              <li key={oc.id} className="flex gap-2 text-sm">
                <span className={`font-mono text-xs shrink-0 mt-0.5 ${groupMeta.textColor} opacity-80`}>{oc.id}</span>
                <span className="text-gray-300 leading-relaxed">{t(oc.description, lang)}</span>
              </li>
            ))}
          </ol>
        </Section>

        {/* Base Practices */}
        <Section title={lang === 'en' ? `Base Practices (${process.basePractices.length})` : `基本プラクティス (${process.basePractices.length})`}>
          <div className="space-y-3">
            {process.basePractices.map((bp) => (
              <div key={bp.id} className="bg-gray-900 rounded-lg p-3 space-y-1.5">
                <div className="flex gap-2 items-baseline">
                  <span className={`font-mono text-xs font-bold ${groupMeta.textColor}`}>{bp.id}</span>
                  <span className="text-sm font-medium text-gray-200">{t(bp.name, lang)}</span>
                </div>
                <p className="text-xs text-gray-400 leading-relaxed">{t(bp.description, lang)}</p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {bp.supportsOutcomes.map((oc) => (
                    <span key={oc} className="text-xs bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded font-mono">
                      →{oc}
                    </span>
                  ))}
                </div>
                {(bp.inputs.length > 0 || bp.outputs.length > 0) && (
                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-gray-800">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{lang === 'en' ? 'Inputs' : '入力'}</div>
                      {bp.inputs.map((ref) => (
                        <div key={ref.itemId} className="text-xs font-mono text-blue-400">{ref.itemId}</div>
                      ))}
                      {bp.inputs.length === 0 && <div className="text-xs text-gray-600">—</div>}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">{lang === 'en' ? 'Outputs' : '出力'}</div>
                      {bp.outputs.map((ref) => (
                        <div key={ref.itemId} className="text-xs font-mono text-green-400">{ref.itemId}</div>
                      ))}
                      {bp.outputs.length === 0 && <div className="text-xs text-gray-600">—</div>}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>

        {/* Output Information Items */}
        <Section title={lang === 'en' ? `Output Information Items (${process.outputItems.length})` : `アウトプット情報項目 (${process.outputItems.length})`}>
          <div className="space-y-2">
            {process.outputItems.map((item) => (
              <div key={item.id} className="bg-gray-900 rounded-lg p-3">
                <div className="flex gap-2 items-baseline mb-1">
                  <span className="font-mono text-xs text-green-400 font-bold">{item.id}</span>
                  <span className="text-sm text-gray-200">{t(item.name, lang)}</span>
                </div>
                <ul className="space-y-0.5">
                  {item.characteristics.map((c, i) => (
                    <li key={i} className="text-xs text-gray-400 flex gap-1">
                      <span className="text-gray-600">•</span>
                      {t(c, lang)}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Section>
      </div>
    </div>
  )
}
