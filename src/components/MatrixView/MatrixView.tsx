import { useMemo, useState } from 'react'
import type { Language, Process, InformationItem, ProcessGroup } from '../../types/aspice'
import { ALL_PROCESSES, INFORMATION_ITEMS, PROCESS_GROUPS } from '../../data'
import { t } from '../../store/languageStore'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { MatrixCell } from './MatrixCell'
import { CellDetailPopup } from './CellDetailPopup'
import type { NavigateTarget } from '../../utils/searchUtils'

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

  // 全情報項目ID（昇順・重複排除）
  const allItemIds = useMemo(
    () =>
      [...new Set(ALL_PROCESSES.flatMap((p) => p.output_information_items.map((o) => o.id)))].sort(),
    []
  )

  // 情報項目IDマップ
  const itemMap = useMemo(() => {
    const m: Record<string, InformationItem> = {}
    for (const item of INFORMATION_ITEMS) m[item.id] = item
    return m
  }, [])

  // 列グループ（情報項目IDの上部分でグループ化）
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

  // フィルター適用後のグループ別プロセス一覧
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

  // プロセスごとの出力情報項目IDセット（パフォーマンス最適化）
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
    <div className="flex flex-col h-full bg-gray-950">
      <GroupFilterBar selected={selectedGroups} lang={lang} onChange={setSelectedGroups} />

      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-xs" style={{ tableLayout: 'fixed' }}>
          <thead>
            {/* 列グループ見出し行 */}
            <tr>
              <th
                className="sticky left-0 top-0 z-30 bg-gray-900 border border-gray-700 px-3 py-1.5 text-left text-gray-400 font-semibold whitespace-nowrap"
                style={{ minWidth: '200px' }}
                rowSpan={2}
              >
                {lang === 'en' ? 'Process' : 'プロセス'}
              </th>
              {columnGroups.map((cg) => (
                <th
                  key={cg.prefix}
                  colSpan={cg.count}
                  className="sticky top-0 z-20 bg-gray-800 border border-gray-700 px-1 py-1 text-center text-gray-400 font-mono font-bold"
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
                    className="sticky top-6 z-20 bg-gray-900 border border-gray-700 text-center cursor-pointer hover:bg-blue-900 hover:text-blue-300 transition-colors"
                    style={{ minWidth: '24px', width: '24px' }}
                    title={item ? t(item.name, lang) : id}
                    onClick={() => handleColumnHeaderClick(id)}
                  >
                    <div
                      className="font-mono text-gray-400 hover:text-blue-300"
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
                    className={`px-3 py-1.5 font-bold text-xs ${group.color} ${group.textColor} border border-gray-700`}
                  >
                    {group.id} — {t(group.name, lang)}
                  </td>
                </tr>

                {/* プロセス行 */}
                {processes.map((process) => (
                  <tr key={process.id} className="hover:bg-gray-900/50 transition-colors">
                    {/* 行ヘッダー（プロセスID＋名称） */}
                    <td
                      className={`sticky left-0 z-10 border border-gray-800 px-3 py-1.5 whitespace-nowrap ${group.color} bg-opacity-50`}
                      style={{ minWidth: '200px' }}
                    >
                      <span className={`font-mono font-bold mr-2 ${group.textColor}`}>{process.id}</span>
                      <span className="text-gray-300">{t(process.name, lang)}</span>
                    </td>

                    {/* データセル */}
                    {allItemIds.map((id) => {
                      const item = itemMap[id]
                      const filled = outputSets[process.id]?.has(id) ?? false
                      if (!item) {
                        return <td key={id} className="border border-gray-800 w-6 h-6" />
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
