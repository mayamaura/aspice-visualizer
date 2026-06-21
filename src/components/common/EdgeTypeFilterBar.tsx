import type { Language } from '../../types/aspice'

export type EdgeType = 'supports' | 'produces'

interface Props {
  selected: Set<EdgeType>
  lang: Language
  onChange: (next: Set<EdgeType>) => void
}

const EDGE_TYPES: { id: EdgeType; labelEn: string; labelJa: string; color: string; border: string }[] = [
  { id: 'supports', labelEn: 'supports outcome', labelJa: 'プロセス成果を達成', color: 'bg-outcome-bg', border: 'border-outcome' },
  { id: 'produces', labelEn: 'produces item',    labelJa: '情報項目を生成',     color: 'bg-item-bg',    border: 'border-item' },
]

export function EdgeTypeFilterBar({ selected, lang, onChange }: Props) {
  const toggle = (id: EdgeType) => {
    const next = new Set(selected)
    if (next.has(id)) {
      if (next.size === 1) return
      next.delete(id)
    } else {
      next.add(id)
    }
    onChange(next)
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-content-muted shrink-0">
        {lang === 'en' ? 'Edge:' : 'エッジ:'}
      </span>
      {EDGE_TYPES.map((e) => {
        const active = selected.has(e.id)
        return (
          <button
            key={e.id}
            onClick={() => toggle(e.id)}
            className={`px-2 py-0.5 rounded text-xs font-medium border transition-all shrink-0 ${
              active
                ? `${e.color} ${e.border} text-content`
                : 'bg-transparent border-line-subtle text-content-muted hover:border-line hover:text-content-2'
            }`}
          >
            {lang === 'en' ? e.labelEn : e.labelJa}
          </button>
        )
      })}
    </div>
  )
}
