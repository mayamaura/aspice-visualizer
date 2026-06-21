import type { Process } from '../../types/aspice'
import type { ProcessGroup_Meta } from '../../types/aspice'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'
import { groupColorHex } from '../../utils/themeColors'

interface Props {
  process: Process
  groupMeta: ProcessGroup_Meta
  isSelected: boolean
  isHighlighted?: boolean
  lang: Language
  onClick: (p: Process) => void
}

export function ProcessCard({ process, groupMeta, isSelected, isHighlighted, lang, onClick }: Props) {
  const selectedStyle = isSelected
    ? {
        background: groupColorHex(groupMeta.id, 'surface'),
        borderColor: groupColorHex(groupMeta.id, 'line'),
        color: groupColorHex(groupMeta.id, 'text'),
      }
    : undefined
  return (
    <button
      onClick={() => onClick(process)}
      style={selectedStyle}
      className={`
        w-full text-left px-3 py-2 rounded-lg border transition-all duration-150
        ${isHighlighted ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-bg' : ''}
        ${isSelected
          ? 'ring-2 ring-offset-1 ring-offset-bg ring-content/20'
          : 'bg-surface border-line text-content-2 hover:bg-surface-2 hover:text-content hover:border-content-muted'
        }
      `}
    >
      <div className="font-mono text-xs font-bold mb-0.5 opacity-80">{process.id}</div>
      <div className="text-sm leading-tight">{t(process.name, lang)}</div>
    </button>
  )
}
