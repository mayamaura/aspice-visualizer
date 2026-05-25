import { useEffect, useState } from 'react'
import type { Process, ProcessGroup } from '../../types/aspice'
import { ALL_PROCESSES, PROCESS_GROUPS } from '../../data'
import { ProcessCard } from './ProcessCard'
import { DetailPanel } from './DetailPanel'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'
import type { NavigateTarget } from '../../utils/searchUtils'

interface Props {
  lang: Language
  navigateTo?: NavigateTarget | null
  onNavConsumed?: () => void
}

export function ProcessMapView({ lang, navigateTo, onNavConsumed }: Props) {
  const [selected, setSelected] = useState<Process | null>(null)
  const [activeGroups, setActiveGroups] = useState<Set<ProcessGroup>>(
    new Set(PROCESS_GROUPS.map((g) => g.id))
  )

  // グローバル検索からのナビゲーション処理
  useEffect(() => {
    if (!navigateTo || navigateTo.type !== 'process') return
    const p = (ALL_PROCESSES as Process[]).find((proc) => proc.id === navigateTo.processId)
    if (p) {
      setActiveGroups((prev) => new Set([...prev, p.group]))
      setSelected(p)
    }
    onNavConsumed?.()
  }, [navigateTo, onNavConsumed])

  const handleSelect = (p: Process) => {
    setSelected((prev) => (prev?.id === p.id ? null : p))
  }

  const handleGroupChange = (next: Set<ProcessGroup>) => {
    setActiveGroups(next)
    if (selected && !next.has(selected.group)) setSelected(null)
  }

  const visibleGroups = PROCESS_GROUPS.filter((g) => activeGroups.has(g.id))

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Filter bar */}
      <GroupFilterBar selected={activeGroups} lang={lang} onChange={handleGroupChange} />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Process Map Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleGroups.map((group) => {
              const processes = (ALL_PROCESSES as Process[]).filter((p) => p.group === group.id)
              if (processes.length === 0) return null
              return (
                <div key={group.id} className={`rounded-xl border ${group.borderColor} overflow-hidden`}>
                  <div className={`${group.color} px-4 py-2.5 border-b ${group.borderColor}`}>
                    <div className={`font-mono text-sm font-bold ${group.textColor}`}>{group.id}</div>
                    <div className={`text-xs ${group.textColor} opacity-80 mt-0.5`}>{t(group.name, lang)}</div>
                  </div>
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
    </div>
  )
}
