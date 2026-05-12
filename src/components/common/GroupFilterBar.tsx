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

  const toggle = (id: ProcessGroup) => {
    const next = new Set(selected)
    if (next.has(id)) {
      // 最低1グループは残す
      if (next.size === 1) return
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(next)
  }

  const toggleAll = () => {
    if (allSelected) {
      // 全選択 → 最初の1つだけ残す（全解除はUX的に不可）
      onChange(new Set([PROCESS_GROUPS[0].id]))
    } else {
      onChange(new Set(PROCESS_GROUPS.map((g) => g.id)))
    }
  }

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-gray-900 border-b border-gray-800 flex-wrap shrink-0">
      <span className="text-xs text-gray-500 shrink-0">
        {lang === 'en' ? 'Group:' : 'グループ:'}
      </span>

      {/* All toggle */}
      <button
        onClick={toggleAll}
        className={`px-2 py-0.5 rounded text-xs font-medium border transition-colors shrink-0 ${
          allSelected
            ? 'bg-gray-600 border-gray-500 text-white'
            : 'bg-transparent border-gray-700 text-gray-500 hover:border-gray-500 hover:text-gray-300'
        }`}
      >
        {lang === 'en' ? 'All' : 'すべて'}
      </button>

      <span className="text-gray-700 text-xs">|</span>

      {/* Per-group toggles */}
      {PROCESS_GROUPS.map((g) => {
        const active = selected.has(g.id)
        return (
          <button
            key={g.id}
            onClick={() => toggle(g.id)}
            className={`px-2 py-0.5 rounded text-xs font-mono font-bold border transition-all shrink-0 ${
              active
                ? `${g.color} ${g.borderColor} ${g.textColor}`
                : 'bg-transparent border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
            }`}
            title={t(g.name, lang)}
          >
            {g.id}
          </button>
        )
      })}
    </div>
  )
}
