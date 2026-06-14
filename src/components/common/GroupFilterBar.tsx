import type { ProcessGroup } from '../../types/aspice'
import type { Language } from '../../types/aspice'
import { PROCESS_GROUPS } from '../../data'
import { t } from '../../store/languageStore'

interface Props {
  selected: Set<ProcessGroup>
  lang: Language
  onChange: (next: Set<ProcessGroup>) => void
}

export function GroupFilterBar({ selected, lang, onChange }: Props) {
  const allSelected = selected.size === PROCESS_GROUPS.length

  const handleClick = (id: ProcessGroup, e: React.MouseEvent) => {
    if (e.ctrlKey || e.metaKey) {
      const next = new Set(selected)
      if (next.has(id)) {
        if (next.size === 1) return
        next.delete(id)
      } else {
        next.add(id)
      }
      onChange(next)
    } else {
      onChange(new Set([id]))
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-line-subtle flex-wrap shrink-0">
      <span className="text-xs text-content-muted shrink-0">
        {lang === 'en' ? 'Group:' : 'グループ:'}
      </span>

      {/* All button */}
      <button
        onClick={() => onChange(new Set(PROCESS_GROUPS.map((g) => g.id)))}
        className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors shrink-0 ${
          allSelected
            ? 'bg-surface-2 border-line text-content'
            : 'bg-transparent border-line-subtle text-content-muted hover:border-line hover:text-content-2'
        }`}
      >
        {lang === 'en' ? 'All' : 'すべて'}
      </button>

      <span className="text-content-muted text-xs">|</span>

      {/* Per-group toggles */}
      {PROCESS_GROUPS.map((g) => {
        const active = selected.has(g.id)
        return (
          <button
            key={g.id}
            onClick={(e) => handleClick(g.id, e)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all shrink-0 ${
              active
                ? `${g.color} ${g.borderColor} ${g.textColor}`
                : 'bg-transparent border-line-subtle text-content-muted hover:border-line hover:text-content-2'
            }`}
            title={`${t(g.name, lang)}${lang === 'en' ? ' (Ctrl+click to multi-select)' : ' (Ctrl+クリックで複数選択)'}`}
          >
            {g.id}
          </button>
        )
      })}
    </div>
  )
}
