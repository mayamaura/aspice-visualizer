import { useMemo, useRef, useState } from 'react'
import type { Language, Process, InformationItem, ProcessGroup } from '../../types/aspice'
import { ALL_PROCESSES, INFORMATION_ITEMS, PROCESS_GROUPS } from '../../data'
import { t } from '../../store/languageStore'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { MatrixCell } from './MatrixCell'
import { CellDetailPopup } from './CellDetailPopup'
import type { NavigateTarget } from '../../utils/searchUtils'
import { groupColorHex } from '../../utils/themeColors'

interface Props {
  lang: Language
  onNavigate?: (target: NavigateTarget) => void
}

interface PopupState {
  process: Process
  item: InformationItem
}

export function MatrixView({ lang, onNavigate }: Props) {
  const [selectedGroups, setSelectedGroups] = useState<Set<ProcessGroup>>(
    new Set(PROCESS_GROUPS.map((g) => g.id))
  )
  const [popup, setPopup] = useState<PopupState | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const dragState = useRef({
    active: false,
    moved: false,
    startX: 0,
    startY: 0,
    startLeft: 0,
    startTop: 0,
  })
  const [isDragging, setIsDragging] = useState(false)

  const handleDragMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0 || !scrollRef.current) return
    const el = scrollRef.current
    dragState.current = {
      active: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: el.scrollLeft,
      startTop: el.scrollTop,
    }
    setIsDragging(true)
  }

  const handleDragMouseMove = (e: React.MouseEvent) => {
    const d = dragState.current
    if (!d.active || !scrollRef.current) return
    const dx = e.clientX - d.startX
    const dy = e.clientY - d.startY
    if (!d.moved && Math.abs(dx) + Math.abs(dy) > 4) d.moved = true
    scrollRef.current.scrollLeft = d.startLeft - dx
    scrollRef.current.scrollTop = d.startTop - dy
  }

  const endDrag = () => {
    if (!dragState.current.active) return
    dragState.current.active = false
    setIsDragging(false)
  }

  const handleDragClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      dragState.current.moved = false
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const allItemIds = useMemo(
    () =>
      [...new Set(ALL_PROCESSES.flatMap((p) => p.output_information_items.map((o) => o.id)))].sort(),
    []
  )

  const itemMap = useMemo(() => {
    const m: Record<string, InformationItem> = {}
    for (const item of INFORMATION_ITEMS) m[item.id] = item
    return m
  }, [])

  const columnGroups = useMemo(() => {
    const groups: { prefix: string; count: number }[] = []
    for (const id of allItemIds) {
      const prefix = id.split('-')[0]
      if (groups.length === 0 || groups[groups.length - 1].prefix !== prefix) {
        groups.push({ prefix, count: 1 })
      } else {
        groups[groups.length - 1].count++
      }
    }
    return groups
  }, [allItemIds])

  const filteredGroupedProcesses = useMemo(
    () =>
      PROCESS_GROUPS.filter((g) => selectedGroups.has(g.id))
        .map((g) => ({
          group: g,
          processes: (ALL_PROCESSES as Process[]).filter((p) => p.group === g.id),
        }))
        .filter((g) => g.processes.length > 0),
    [selectedGroups]
  )

  const outputSets = useMemo(() => {
    const map: Record<string, Set<string>> = {}
    for (const p of ALL_PROCESSES as Process[]) {
      map[p.id] = new Set(p.output_information_items.map((o) => o.id))
    }
    return map
  }, [])

  const handleCellClick = (process: Process, item: InformationItem) => {
    setPopup({ process, item })
  }

  const handleColumnHeaderClick = (itemId: string) => {
    onNavigate?.({ type: 'item', itemId })
  }

  return (
    <div className="flex flex-col h-full bg-bg">
      <GroupFilterBar selected={selectedGroups} lang={lang} onChange={setSelectedGroups} />

      <div
        ref={scrollRef}
        className={`flex-1 overflow-auto select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onMouseDown={handleDragMouseDown}
        onMouseMove={handleDragMouseMove}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
        onClickCapture={handleDragClickCapture}
      >
        <table className="border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
          <thead>
            {/* 列グループ見出し行 */}
            <tr>
              <th
                className="sticky left-0 top-0 z-30 bg-surface border border-line px-3 py-1.5 text-left text-content-2 font-semibold whitespace-nowrap"
                style={{ minWidth: '200px' }}
                rowSpan={2}
              >
                {lang === 'en' ? 'Process' : 'プロセス'}
              </th>
              {columnGroups.map((cg) => (
                <th
                  key={cg.prefix}
                  colSpan={cg.count}
                  className="sticky top-0 z-20 bg-surface-2 border border-line px-1 py-1 text-center text-content-2 font-mono font-bold"
                >
                  {cg.prefix}
                </th>
              ))}
            </tr>

            {/* 情報項目ID行 */}
            <tr>
              {allItemIds.map((id) => {
                const item = itemMap[id]
                return (
                  <th
                    key={id}
                    className="sticky top-6 z-20 bg-surface border border-line text-center cursor-pointer hover:bg-accent-bg hover:text-accent transition-colors"
                    style={{ minWidth: '24px', width: '24px' }}
                    title={item ? t(item.name, lang) : id}
                    onClick={() => handleColumnHeaderClick(id)}
                  >
                    <div
                      className="font-mono text-content-2"
                      style={{
                        writingMode: 'vertical-rl',
                        textOrientation: 'mixed',
                        padding: '4px 2px',
                        fontSize: '9px',
                        height: '72px',
                      }}
                    >
                      {id}
                    </div>
                  </th>
                )
              })}
            </tr>
          </thead>

          <tbody>
            {filteredGroupedProcesses.map(({ group, processes }) => (
              <>
                {/* グループヘッダー行 */}
                <tr key={`group-${group.id}`}>
                  <td
                    colSpan={allItemIds.length + 1}
                    className="px-3 py-1.5 font-bold text-xs border border-line"
                    style={{ background: groupColorHex(group.id, 'surface'), color: groupColorHex(group.id, 'text') }}
                  >
                    {group.id} — {t(group.name, lang)}
                  </td>
                </tr>

                {/* プロセス行 */}
                {processes.map((process) => (
                  <tr key={process.id} className="hover:bg-surface/50 transition-colors">
                    {/* 行ヘッダー（プロセスID＋名称） */}
                    <td
                      className="sticky left-0 z-10 border border-line-subtle px-3 py-1.5 whitespace-nowrap"
                      style={{ minWidth: '200px', background: groupColorHex(group.id, 'surface') }}
                    >
                      <span className="font-mono font-bold mr-2" style={{ color: groupColorHex(group.id, 'text') }}>{process.id}</span>
                      <span className="text-content">{t(process.name, lang)}</span>
                    </td>

                    {/* データセル */}
                    {allItemIds.map((id) => {
                      const item = itemMap[id]
                      const filled = outputSets[process.id]?.has(id) ?? false
                      if (!item) {
                        return <td key={id} className="border border-line-subtle w-6 h-6" />
                      }
                      return (
                        <MatrixCell
                          key={id}
                          process={process}
                          item={item}
                          filled={filled}
                          onClick={handleCellClick}
                        />
                      )
                    })}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>

      {popup && (
        <CellDetailPopup
          process={popup.process}
          item={popup.item}
          lang={lang}
          onClose={() => setPopup(null)}
        />
      )}
    </div>
  )
}
