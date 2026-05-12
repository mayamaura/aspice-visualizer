import { useState } from 'react'
import type { Process } from '../../types/aspice'
import { ALL_PROCESSES, PROCESS_GROUPS } from '../../data'
import { ProcessCard } from './ProcessCard'
import { DetailPanel } from './DetailPanel'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'

interface Props {
  lang: Language
}

export function ProcessMapView({ lang }: Props) {
  const [selected, setSelected] = useState<Process | null>(null)

  const handleSelect = (p: Process) => {
    setSelected((prev) => (prev?.id === p.id ? null : p))
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: Process Map Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {PROCESS_GROUPS.map((group) => {
            const processes = ALL_PROCESSES.filter((p) => p.group === group.id)
            if (processes.length === 0) return null
            return (
              <div key={group.id} className={`rounded-xl border ${group.borderColor} overflow-hidden`}>
                {/* Group header */}
                <div className={`${group.color} px-4 py-2.5 border-b ${group.borderColor}`}>
                  <div className={`font-mono text-sm font-bold ${group.textColor}`}>{group.id}</div>
                  <div className={`text-xs ${group.textColor} opacity-80 mt-0.5`}>{t(group.name, lang)}</div>
                </div>
                {/* Process cards */}
                <div className="p-2 space-y-1.5 bg-gray-900/50">
                  {processes.map((p) => (
                    <ProcessCard
                      key={p.id}
                      process={p}
                      groupMeta={group}
                      isSelected={selected?.id === p.id}
                      lang={lang}
                      onClick={handleSelect}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Right: Detail Panel */}
      {selected && (() => {
        const groupMeta = PROCESS_GROUPS.find((g) => g.id === selected.group)!
        return (
          <div className="w-[420px] shrink-0 overflow-hidden">
            <DetailPanel
              process={selected}
              groupMeta={groupMeta}
              lang={lang}
              onClose={() => setSelected(null)}
            />
          </div>
        )
      })()}
    </div>
  )
}
