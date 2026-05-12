import type { Process } from '../../types/aspice'
import type { ProcessGroup_Meta } from '../../types/aspice'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'

interface Props {
  process: Process
  groupMeta: ProcessGroup_Meta
  isSelected: boolean
  lang: Language
  onClick: (p: Process) => void
}

export function ProcessCard({ process, groupMeta, isSelected, lang, onClick }: Props) {
  return (
    <button
      onClick={() => onClick(process)}
      className={`
        w-full text-left px-3 py-2 rounded-lg border transition-all duration-150
        ${isSelected
          ? `${groupMeta.color} ${groupMeta.borderColor} ${groupMeta.textColor} ring-2 ring-offset-1 ring-offset-gray-950 ring-white/30`
          : `bg-gray-900 border-gray-700 hover:${groupMeta.color} hover:${groupMeta.borderColor} text-gray-300 hover:${groupMeta.textColor}`
        }
      `}
    >
      <div className="font-mono text-xs font-bold mb-0.5 opacity-80">{process.id}</div>
      <div className="text-sm leading-tight">{t(process.name, lang)}</div>
    </button>
  )
}
