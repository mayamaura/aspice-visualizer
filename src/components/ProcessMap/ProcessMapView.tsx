import { useCallback, useEffect, useRef, useState } from 'react'
import type { Process, ProcessGroup } from '../../types/aspice'
import { ALL_PROCESSES, PROCESS_GROUPS } from '../../data'
import { ProcessCard } from './ProcessCard'
import { DetailPanel } from './DetailPanel'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'
import type { NavigateTarget } from '../../utils/searchUtils'
import { groupColorHex } from '../../utils/themeColors'
import { useEscapeKey } from '../../hooks/useEscapeKey'

interface Props {
  lang: Language
  navigateTo?: NavigateTarget | null
  onNavConsumed?: () => void
  initialProcessId?: string | null
  onProcessChange?: (processId: string | null) => void
}

export function ProcessMapView({ lang, navigateTo, onNavConsumed, initialProcessId, onProcessChange }: Props) {
  const [selected, setSelected] = useState<Process | null>(() => {
    if (!initialProcessId) return null
    return (ALL_PROCESSES as Process[]).find((p) => p.id === initialProcessId) ?? null
  })
  const [activeGroups, setActiveGroups] = useState<Set<ProcessGroup>>(() => {
    const all = new Set(PROCESS_GROUPS.map((g) => g.id)) as Set<ProcessGroup>
    if (initialProcessId) {
      const p = (ALL_PROCESSES as Process[]).find((proc) => proc.id === initialProcessId)
      if (p) all.add(p.group)
    }
    return all
  })
  const [highlightProcessId, setHighlightProcessId] = useState<string | null>(null)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    onProcessChange?.(selected?.id ?? null)
  }, [selected]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!navigateTo || navigateTo.type !== 'process') return
    const p = (ALL_PROCESSES as Process[]).find((proc) => proc.id === navigateTo.processId)
    if (p) {
      setActiveGroups((prev) => new Set([...prev, p.group]))
      setSelected(p)
      setHighlightProcessId(p.id)
      setTimeout(() => setHighlightProcessId(null), 2000)
    }
    onNavConsumed?.()
  }, [navigateTo, onNavConsumed])

  const clearSelection = useCallback(() => setSelected(null), [])
  useEscapeKey(!!selected, clearSelection)

  const handleSelect = (p: Process) => {
    setSelected((prev) => (prev?.id === p.id ? null : p))
  }

  const handleSelectFromPanel = (p: Process) => {
    setActiveGroups((prev) => new Set([...prev, p.group]))
    setSelected(p)
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
              const groupLine = groupColorHex(group.id, 'line')
              const groupSurface = groupColorHex(group.id, 'surface')
              const groupText = groupColorHex(group.id, 'text')
              return (
                <div key={group.id} className="rounded-xl border overflow-hidden" style={{ borderColor: groupLine }}>
                  <div className="px-4 py-2.5 border-b" style={{ background: groupSurface, borderColor: groupLine }}>
                    <div className="font-mono text-sm font-bold" style={{ color: groupText }}>{group.id}</div>
                    <div className="text-xs opacity-80 mt-0.5" style={{ color: groupText }}>{t(group.name, lang)}</div>
                  </div>
                  <div className="p-2 space-y-1.5 bg-surface/50">
                    {processes.map((p) => (
                      <ProcessCard
                        key={p.id}
                        process={p}
                        groupMeta={group}
                        isSelected={selected?.id === p.id}
                        isHighlighted={highlightProcessId === p.id}
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
                onSelectProcess={handleSelectFromPanel}
              />
            </div>
          )
        })()}
      </div>
    </div>
  )
}
