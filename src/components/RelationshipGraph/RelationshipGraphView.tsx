import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { GroupNode, ProcessNode, OutcomeNode, BPNode, ItemNode } from './CustomNodes'
import type { ProcessNodeData } from './CustomNodes'
import {
  buildProcessLevelGraph,
  buildDetailLevelGraph,
  buildItemLevelGraph,
  buildItemFocusGraph,
  type GraphLevel,
} from './graphUtils'
import { ALL_PROCESSES } from '../../data'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { EdgeTypeFilterBar, type EdgeType } from '../common/EdgeTypeFilterBar'
import { ItemDetailPanel } from './ItemDetailPanel'
import { BPLevelDetailPanel, type SelectedBPNode } from './BPLevelDetailPanel'
import { ProcessHoverTooltip } from './ProcessHoverTooltip'
import { GraphExportButton } from './GraphExportButton'
import type { Language, Process, ProcessGroup } from '../../types/aspice'
import { t } from '../../store/languageStore'
import { PROCESS_GROUPS } from '../../data'
import { INFORMATION_ITEMS } from '../../data'
import type { NavigateTarget } from '../../utils/searchUtils'
import { useTheme } from '../../store/themeStore'
import { cssVar, groupColorHex } from '../../utils/themeColors'
import { useEscapeKey } from '../../hooks/useEscapeKey'

const nodeTypes = {
  groupNode: GroupNode,
  processNode: ProcessNode,
  outcomeNode: OutcomeNode,
  bpNode: BPNode,
  itemNode: ItemNode,
}

interface TooltipInfo {
  purpose: string
  outcomeCount: number
  bpCount: number
  x: number
  y: number
}

interface Props {
  lang: Language
  navigateTo?: NavigateTarget | null
  onNavConsumed?: () => void
  initialLevel?: GraphLevel
  initialFocusId?: string | null
  onGraphStateChange?: (level: GraphLevel, focusId: string | null) => void
}

export function RelationshipGraphView({ lang, navigateTo, onNavConsumed, initialLevel, initialFocusId, onGraphStateChange }: Props) {
  const [theme] = useTheme()
  const [level, setLevel] = useState<GraphLevel>(initialLevel ?? 'process')
  const [focusProcess, setFocusProcess] = useState<Process | null>(() => {
    if (initialLevel === 'bp' && initialFocusId) {
      return (ALL_PROCESSES as Process[]).find((p) => p.id === initialFocusId) ?? null
    }
    return null
  })
  const [focusItemId, setFocusItemId] = useState<string | null>(() => {
    if (initialLevel === 'item' && initialFocusId) return initialFocusId
    return null
  })
  const isFirstGraphRender = useRef(true)
  const [activeGroups, setActiveGroups] = useState<Set<ProcessGroup>>(
    new Set(PROCESS_GROUPS.map((g) => g.id))
  )
  const [activeEdgeTypes, setActiveEdgeTypes] = useState<Set<EdgeType>>(
    new Set<EdgeType>(['supports', 'produces'])
  )
  const [selectedBPNode, setSelectedBPNode] = useState<SelectedBPNode | null>(null)
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [tooltipInfo, setTooltipInfo] = useState<TooltipInfo | null>(null)
  const hoverLeaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const graphContainerRef = useRef<HTMLDivElement>(null)

  const { nodes: initNodes, edges: initEdges } = useMemo(() => {
    if (level === 'process') {
      return buildProcessLevelGraph(ALL_PROCESSES, lang, activeGroups)
    } else if (level === 'bp' && focusProcess) {
      return buildDetailLevelGraph(focusProcess, lang, activeEdgeTypes)
    } else if (level === 'item') {
      if (focusItemId) {
        return buildItemFocusGraph(focusItemId, ALL_PROCESSES, lang)
      }
      return buildItemLevelGraph(ALL_PROCESSES, lang)
    }
    return { nodes: [], edges: [] }
  // theme を依存に追加してテーマ変更時にノード色を再計算
  }, [level, focusProcess, focusItemId, lang, activeGroups, activeEdgeTypes, theme]) // eslint-disable-line react-hooks/exhaustive-deps

  const { nodes, edges } = useMemo(() => {
    if (!hoveredNodeId) return { nodes: initNodes, edges: initEdges }

    const connectedEdges = initEdges.filter(
      (e) => e.source === hoveredNodeId || e.target === hoveredNodeId
    )
    const connectedEdgeIds = new Set(connectedEdges.map((e) => e.id))
    const connectedNodeIds = new Set<string>([hoveredNodeId])
    connectedEdges.forEach((e) => {
      connectedNodeIds.add(e.source)
      connectedNodeIds.add(e.target)
    })

    return {
      nodes: initNodes.map((n) => ({
        ...n,
        style: {
          ...n.style,
          opacity: connectedNodeIds.has(n.id) ? 1 : 0.08,
          transition: 'opacity 0.15s',
        },
      })),
      edges: initEdges.map((e) => {
        const active = connectedEdgeIds.has(e.id)
        return {
          ...e,
          style: { ...e.style, opacity: active ? 1 : 0.04, transition: 'opacity 0.15s' },
          labelStyle: { ...e.labelStyle, opacity: active ? 1 : 0 },
          labelBgStyle: { ...e.labelBgStyle, opacity: active ? 1 : 0 },
        }
      }),
    }
  }, [hoveredNodeId, initNodes, initEdges])

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (node.type === 'groupNode') return
    if (level === 'process') {
      const p = ALL_PROCESSES.find((proc) => proc.id === node.id)
      if (p) {
        setFocusProcess(p)
        setLevel('bp')
        setSelectedBPNode(null)
      }
    } else if (level === 'bp' && focusProcess) {
      if (node.type === 'bpNode') {
        const bp = focusProcess.base_practices.find((b) => b.id === node.id)
        if (bp) setSelectedBPNode({ type: 'bp', bp, process: focusProcess })
      } else if (node.type === 'outcomeNode') {
        const ocId = parseInt(node.id.replace(/^oc-/, ''), 10)
        const oc = focusProcess.outcomes.find((o) => o.id === ocId)
        if (oc) setSelectedBPNode({ type: 'outcome', outcome: oc, process: focusProcess })
      } else if (node.type === 'itemNode') {
        const itemId = node.id.replace(/^item-/, '')
        const item = INFORMATION_ITEMS.find((i) => i.id === itemId)
        if (item) setSelectedBPNode({ type: 'item', item })
      } else {
        setSelectedBPNode(null)
      }
    } else if (level === 'item' && !focusItemId) {
      const itemId = node.id.replace(/^item-/, '')
      setFocusItemId(itemId)
    }
  }, [level, focusItemId, focusProcess])

  const onNodeMouseEnter: NodeMouseHandler = useCallback((evt, node) => {
    if (hoverLeaveTimer.current !== null) {
      clearTimeout(hoverLeaveTimer.current)
      hoverLeaveTimer.current = null
    }

    if (level === 'bp' || level === 'item') {
      setHoveredNodeId(node.id)
      return
    }

    if (level === 'process' && node.type === 'processNode') {
      const d = node.data as ProcessNodeData
      if (d.purpose !== undefined) {
        setTooltipInfo({
          purpose: d.purpose,
          outcomeCount: d.outcomeCount ?? 0,
          bpCount: d.bpCount ?? 0,
          x: evt.clientX,
          y: evt.clientY,
        })
      }
    }
  }, [level])

  const onNodeMouseLeave: NodeMouseHandler = useCallback(() => {
    hoverLeaveTimer.current = setTimeout(() => {
      setHoveredNodeId(null)
      setTooltipInfo(null)
      hoverLeaveTimer.current = null
    }, 80)
  }, [])

  const handleBackToProcess = () => {
    setLevel('process')
    setFocusProcess(null)
    setSelectedBPNode(null)
  }

  const handleBackToItemList = () => {
    setFocusItemId(null)
  }

  useEffect(() => {
    if (isFirstGraphRender.current) {
      isFirstGraphRender.current = false
      return
    }
    const focusId =
      level === 'bp' ? (focusProcess?.id ?? null) :
      level === 'item' ? focusItemId :
      null
    onGraphStateChange?.(level, focusId)
  }, [level, focusProcess, focusItemId]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!navigateTo) return
    if (navigateTo.type === 'bp') {
      const p = (ALL_PROCESSES as Process[]).find((proc) => proc.id === navigateTo.processId)
      if (p) {
        setFocusProcess(p)
        setLevel('bp')
        setSelectedBPNode(null)
        const bp = p.base_practices.find((b) => b.id === navigateTo.bpId)
        if (bp) setSelectedBPNode({ type: 'bp', bp, process: p })
      }
    } else if (navigateTo.type === 'item') {
      setLevel('item')
      setFocusItemId(navigateTo.itemId)
    }
    onNavConsumed?.()
  }, [navigateTo, onNavConsumed])

  const groupMeta = focusProcess ? PROCESS_GROUPS.find((g) => g.id === focusProcess.group) : null
  const focusItem = focusItemId ? INFORMATION_ITEMS.find((i) => i.id === focusItemId) : null

  // Esc でサイドパネルを閉じる（BP/item パネルが開いている場合）
  const anyPanelOpen = !!(level === 'bp' && selectedBPNode) || !!(level === 'item' && focusItem)
  const closePanels = useCallback(() => {
    if (level === 'bp' && selectedBPNode) setSelectedBPNode(null)
    else if (level === 'item' && focusItem) handleBackToItemList()
  }, [level, selectedBPNode, focusItem]) // eslint-disable-line react-hooks/exhaustive-deps
  useEscapeKey(anyPanelOpen, closePanels)

  const bgColor = cssVar('--color-bg')
  const surfaceColor = cssVar('--color-surface')
  const lineColor = cssVar('--color-line')

  return (
    <div className="flex flex-col h-full">
      {/* Group filter (process level only) */}
      {level === 'process' && (
        <GroupFilterBar selected={activeGroups} lang={lang} onChange={setActiveGroups} />
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-surface border-b border-line-subtle shrink-0 flex-wrap">
        {/* Level tabs */}
        <div className="flex rounded-lg overflow-hidden border border-line shrink-0">
          <button
            onClick={handleBackToProcess}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              level === 'process' ? 'bg-surface-2 text-content' : 'text-content-2 hover:text-content hover:bg-surface-2'
            }`}
          >
            {lang === 'en' ? 'Process Level' : 'プロセスレベル'}
          </button>
          <button
            onClick={() => { if (focusProcess) setLevel('bp') }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-line ${
              level === 'bp'
                ? 'bg-surface-2 text-content'
                : focusProcess
                ? 'text-content-2 hover:text-content hover:bg-surface-2'
                : 'text-content-muted cursor-not-allowed'
            }`}
          >
            {lang === 'en' ? 'BP / Item Level' : 'BP / 情報項目レベル'}
          </button>
          <button
            onClick={() => { setLevel('item'); setFocusItemId(null) }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-line ${
              level === 'item' ? 'bg-surface-2 text-content' : 'text-content-2 hover:text-content hover:bg-surface-2'
            }`}
          >
            {lang === 'en' ? 'Item Origin' : '情報項目起点'}
          </button>
        </div>

        {/* Export button */}
        <GraphExportButton containerRef={graphContainerRef} lang={lang} />

        {/* Focus process badge (BP level) */}
        {level === 'bp' && focusProcess && groupMeta && (
          <div className="flex items-center gap-2">
            <span className="text-content-muted text-xs">→</span>
            <span className="font-mono text-xs font-bold" style={{ color: groupColorHex(groupMeta.id, 'text') }}>{focusProcess.id}</span>
            <span className="text-xs text-content">{t(focusProcess.name, lang)}</span>
            <button
              onClick={handleBackToProcess}
              className="ml-1 text-xs text-content-muted hover:text-content underline"
            >
              {lang === 'en' ? 'Back' : '戻る'}
            </button>
          </div>
        )}

        {/* Focus item badge (item origin level) */}
        {level === 'item' && focusItemId && (
          <div className="flex items-center gap-2">
            <span className="text-content-muted text-xs">→</span>
            <span className="font-mono text-xs font-bold text-item">{focusItemId}</span>
            <span className="text-xs text-content">
              {focusItem ? t(focusItem.name, lang) : focusItemId}
            </span>
            <button
              onClick={handleBackToItemList}
              className="ml-1 text-xs text-content-muted hover:text-content underline"
            >
              {lang === 'en' ? 'Back' : '戻る'}
            </button>
          </div>
        )}

        {/* Edge type filter (BP level only) */}
        {level === 'bp' && (
          <div className="ml-auto">
            <EdgeTypeFilterBar
              selected={activeEdgeTypes}
              lang={lang}
              onChange={setActiveEdgeTypes}
            />
          </div>
        )}

        {/* Hint text */}
        {level === 'process' && (
          <span className="ml-auto text-xs text-content-muted">
            {lang === 'en' ? 'Hover to preview · Click to drill down' : 'ホバーでプレビュー・クリックで展開'}
          </span>
        )}
        {level === 'item' && !focusItemId && (
          <span className="ml-auto text-xs text-content-muted">
            {lang === 'en' ? 'Click an item to see its sources' : '情報項目をクリックして生成元を表示'}
          </span>
        )}
        {level === 'bp' && (
          <span className="ml-auto text-xs text-content-muted">
            {lang === 'en' ? 'Click a node to view details' : 'ノードをクリックして詳細を表示'}
          </span>
        )}
        {level === 'item' && focusItemId && (
          <span className="ml-auto text-xs text-content-muted">
            {lang === 'en' ? 'Hover to highlight connections' : 'ホバーで接続を強調表示'}
          </span>
        )}
      </div>

      {/* Graph + Detail Panel */}
      <div className="flex-1 flex overflow-hidden">
        <div ref={graphContainerRef} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodeClick={onNodeClick}
            onNodeMouseEnter={onNodeMouseEnter}
            onNodeMouseLeave={onNodeMouseLeave}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.1}
            maxZoom={2}
          >
            <Background color={lineColor} gap={20} />
            <Controls />
            <MiniMap
              nodeColor={(n) => {
                const d = n.data as { bg?: string; color?: string }
                return d.bg ?? d.color ?? surfaceColor
              }}
              style={{ background: bgColor }}
            />
          </ReactFlow>
        </div>
        {level === 'bp' && selectedBPNode && groupMeta && (
          <BPLevelDetailPanel
            selected={selectedBPNode}
            groupMeta={groupMeta}
            lang={lang}
            onClose={() => setSelectedBPNode(null)}
          />
        )}
        {level === 'item' && focusItem && (
          <ItemDetailPanel item={focusItem} lang={lang} onClose={handleBackToItemList} />
        )}
      </div>

      {/* Process hover tooltip (process level only) */}
      {tooltipInfo && (
        <ProcessHoverTooltip
          purpose={tooltipInfo.purpose}
          outcomeCount={tooltipInfo.outcomeCount}
          bpCount={tooltipInfo.bpCount}
          x={tooltipInfo.x}
          y={tooltipInfo.y}
          lang={lang}
        />
      )}
    </div>
  )
}
