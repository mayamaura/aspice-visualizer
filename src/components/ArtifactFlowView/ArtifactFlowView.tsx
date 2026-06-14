import { useState, useMemo, useEffect, useCallback } from 'react'
import { ChevronLeft } from 'lucide-react'
import type { Language, ProcessGroup } from '../../types/aspice'
import type { NavigateTarget } from '../../utils/searchUtils'
import { ALL_PROCESSES, PROCESS_GROUPS, INFORMATION_ITEMS } from '../../data'
import { buildGroupSankeyData, buildProcessSankeyData } from './sankeyData'
import { SankeyCanvas } from './SankeyCanvas'
import { FlowDetailPanel } from './FlowDetailPanel'
import type { FlowSelection } from './FlowDetailPanel'
import type { LayoutLink } from './sankeyLayout'
import { groupColorHex } from '../../utils/themeColors'

interface Props {
  lang: Language
  navigateTo?: NavigateTarget | null
  onNavConsumed?: () => void
  initialFlowGroup?: string | null
  onFlowStateChange?: (group: string | null) => void
  onNavigate?: (target: NavigateTarget) => void
}

export function ArtifactFlowView({
  lang,
  navigateTo,
  onNavConsumed,
  initialFlowGroup,
  onFlowStateChange,
  onNavigate,
}: Props) {
  const [selectedGroup, setSelectedGroup] = useState<ProcessGroup | null>(
    () => (initialFlowGroup as ProcessGroup | null) ?? null,
  )
  const [selection, setSelection] = useState<FlowSelection | null>(null)

  useEffect(() => {
    if (!navigateTo) return
    if (navigateTo.type === 'item') {
      const item = INFORMATION_ITEMS.find((i) => i.id === navigateTo.itemId)
      if (item) {
        setSelection({
          type: 'rightNode',
          title: lang === 'en' ? item.name.en : item.name.ja,
          itemIds: [navigateTo.itemId],
        })
      }
    }
    onNavConsumed?.()
  }, [navigateTo, onNavConsumed, lang])

  const handleGroupSelect = useCallback(
    (nodeId: string) => {
      if (!nodeId.startsWith('group-')) return
      const grp = nodeId.replace('group-', '') as ProcessGroup
      setSelectedGroup(grp)
      setSelection(null)
      onFlowStateChange?.(grp)
    },
    [onFlowStateChange],
  )

  const handleBackToGroup = useCallback(() => {
    setSelectedGroup(null)
    setSelection(null)
    onFlowStateChange?.(null)
  }, [onFlowStateChange])

  const handleNodeClick = useCallback(
    (nodeId: string) => {
      if (selectedGroup === null) {
        if (nodeId.startsWith('group-')) {
          handleGroupSelect(nodeId)
        } else if (nodeId.startsWith('prefix-')) {
          const prefix = nodeId.replace('prefix-', '')
          const items = INFORMATION_ITEMS.filter((i) => i.id.startsWith(`${prefix}-`))
          const itemIds = items.map((i) => i.id)
          setSelection({
            type: 'rightNode',
            title: lang === 'en' ? `Category ${prefix}-XX` : `カテゴリ ${prefix}-XX`,
            itemIds,
          })
        }
      } else {
        if (nodeId.startsWith('item-')) {
          const itemId = nodeId.replace('item-', '')
          const item = INFORMATION_ITEMS.find((i) => i.id === itemId)
          if (item) {
            setSelection({
              type: 'rightNode',
              title: lang === 'en' ? item.name.en : item.name.ja,
              itemIds: [itemId],
            })
          }
        }
      }
    },
    [selectedGroup, handleGroupSelect, lang],
  )

  const handleLinkClick = useCallback(
    (ll: LayoutLink) => {
      const parts = ll.id.split('->')
      const srcLabel = parts[0].replace(/^(group-|proc-)/, '')
      const tgtLabel = parts[1]?.replace(/^(prefix-|item-)/, '') ?? ''
      const title =
        selectedGroup === null
          ? lang === 'en'
            ? `${srcLabel} → ${tgtLabel}-XX`
            : `${srcLabel} → ${tgtLabel}-XX`
          : lang === 'en'
            ? `${srcLabel} → ${tgtLabel}`
            : `${srcLabel} → ${tgtLabel}`
      setSelection({
        type: 'link',
        title,
        itemIds: ll.itemIds,
      })
    },
    [selectedGroup, lang],
  )

  const { nodes, links } = useMemo(() => {
    if (selectedGroup === null) {
      return buildGroupSankeyData(ALL_PROCESSES, lang)
    }
    return buildProcessSankeyData(ALL_PROCESSES, selectedGroup, lang)
  }, [selectedGroup, lang])

  const groupMeta = selectedGroup
    ? PROCESS_GROUPS.find((g) => g.id === selectedGroup)
    : null

  const handleNavigate = useCallback(
    (target: NavigateTarget) => {
      onNavigate?.(target)
    },
    [onNavigate],
  )

  return (
    <div className="flex h-full overflow-hidden">
      {/* メインキャンバスエリア */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* ツールバー */}
        <div className="flex items-center gap-3 px-4 py-2.5 bg-surface border-b border-line-subtle shrink-0">
          {selectedGroup === null ? (
            <span className="text-sm font-semibold text-content">
              {lang === 'en' ? 'Process Group → Item Category' : 'プロセスグループ → 情報項目カテゴリ'}
            </span>
          ) : (
            <>
              <button
                onClick={handleBackToGroup}
                className="flex items-center gap-1 text-xs text-content-2 hover:text-content transition-colors"
              >
                <ChevronLeft size={14} />
                {lang === 'en' ? 'Back to Groups' : 'グループビューに戻る'}
              </button>
              <span className="text-content-muted">|</span>
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded"
                style={{ background: selectedGroup ? groupColorHex(selectedGroup, 'surface') : undefined }}
              >
                <span className="text-white">{selectedGroup}</span>
                {groupMeta && (
                  <span className="text-white/70 ml-1">
                    {lang === 'en' ? groupMeta.name.en : groupMeta.name.ja}
                  </span>
                )}
              </span>
              <span className="text-content-2 text-xs">
                {lang === 'en' ? '— Process → Information Item' : '— プロセス → 情報項目'}
              </span>
            </>
          )}

          <div className="ml-auto text-xs text-content-muted">
            {lang === 'en'
              ? 'Band width = number of information items'
              : '帯幅 = 情報項目数に比例'}
          </div>
        </div>

        {/* SVG キャンバス */}
        <div className="flex-1 overflow-hidden bg-bg">
          <SankeyCanvas
            nodes={nodes}
            links={links}
            onNodeClick={handleNodeClick}
            onLinkClick={handleLinkClick}
          />
        </div>
      </div>

      {/* 詳細パネル */}
      {selection !== null && (
        <FlowDetailPanel
          selection={selection}
          lang={lang}
          onClose={() => setSelection(null)}
          onNavigate={handleNavigate}
        />
      )}
    </div>
  )
}
