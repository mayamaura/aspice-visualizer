import type { Language } from '../../types/aspice'

export type EdgeType = 'supports' | 'produces' | 'input'

interface Props {
  selected: Set<EdgeType>
  lang: Language
  onChange: (next: Set<EdgeType>) => void
}

const EDGE_TYPES: { id: EdgeType; labelEn: string; labelJa: string; color: string; border: string }[] = [
  { id: 'supports', labelEn: 'supports outcome', labelJa: 'プロセス成果を達成', color: 'bg-indigo-950', border: 'border-indigo-500' },
  { id: 'produces', labelEn: 'produces item',    labelJa: '情報項目を生成',     color: 'bg-green-950',  border: 'border-green-500' },
  { id: 'input',    labelEn: 'input item',       labelJa: '入力情報項目',       color: 'bg-blue-950',   border: 'border-blue-500' },
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
      <span className="text-xs text-gray-500 shrink-0">
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
                ? `${e.color} ${e.border} text-gray-200`
                : 'bg-transparent border-gray-800 text-gray-600 hover:border-gray-600 hover:text-gray-400'
            }`}
          >
            {lang === 'en' ? e.labelEn : e.labelJa}
          </button>
        )
      })}
    </div>
  )
}
