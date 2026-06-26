import { useCallback, useEffect, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  Panel,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { ProcessNode } from '../RelationshipGraph/CustomNodes'
import { DetailPanel } from '../ProcessMap/DetailPanel'
import { buildVModelGraph, VMODEL_PROCESS_IDS } from './vmodelLayout'
import { ALL_PROCESSES, PROCESS_GROUPS } from '../../data'
import type { Language, Process } from '../../types/aspice'
import type { NavigateTarget } from '../../utils/searchUtils'
import { useTheme } from '../../store/themeStore'
import { cssVar } from '../../utils/themeColors'
import { useEscapeKey } from '../../hooks/useEscapeKey'

const nodeTypes = { processNode: ProcessNode }

interface Props {
  lang: Language
  navigateTo?: NavigateTarget | null
  onNavConsumed?: () => void
}

export function VModelView({ lang, navigateTo, onNavConsumed }: Props) {
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null)
  const [theme] = useTheme()

  useEscapeKey(!!selectedProcess, useCallback(() => setSelectedProcess(null), []))

  const { nodes, edges } = useMemo(() => buildVModelGraph(lang), [lang, theme])

  const handleNodeClick = useCallback<NodeMouseHandler>((_e, node) => {
    const p = ALL_PROCESSES.find((p) => p.id === node.id)
    if (p) setSelectedProcess(p)
  }, [])

  useEffect(() => {
    if (!navigateTo) return
    if (navigateTo.type === 'process' && VMODEL_PROCESS_IDS.has(navigateTo.processId)) {
      const p = ALL_PROCESSES.find((p) => p.id === navigateTo.processId)
      if (p) setSelectedProcess(p)
    }
    onNavConsumed?.()
  }, [navigateTo, onNavConsumed])

  const selectedGroupMeta = useMemo(
    () => (selectedProcess ? PROCESS_GROUPS.find((g) => g.id === selectedProcess.group)! : null),
    [selectedProcess]
  )

  return (
    <div className="flex h-full">
      {/* グラフキャンバス */}
      <div className="flex-1">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodeClick={handleNodeClick}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.25}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={true}
        >
          <Background color={cssVar('--color-line')} gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(n) => (n.data?.border as string) ?? cssVar('--color-line')}
            style={{ background: cssVar('--color-bg') }}
          />

          {/* フェーズラベル */}
          <Panel position="top-left">
            <div className="text-xs text-content-2 bg-surface px-3 py-1.5 rounded border border-line">
              {lang === 'en' ? '← Specification / Design' : '← 仕様・設計フェーズ'}
            </div>
          </Panel>
          <Panel position="top-center">
            <div className="text-xs text-content-muted bg-surface px-3 py-1.5 rounded border border-line-subtle">
              {lang === 'en' ? 'V-Model (SYS / SWE / HWE)' : 'Vモデル（SYS / SWE / HWE）'}
            </div>
          </Panel>
          <Panel position="top-right">
            <div className="text-xs text-content-2 bg-surface px-3 py-1.5 rounded border border-line">
              {lang === 'en' ? 'Integration / Verification →' : '統合・検証フェーズ →'}
            </div>
          </Panel>
        </ReactFlow>
      </div>

      {/* 詳細パネル */}
      {selectedProcess && selectedGroupMeta && (
        <div className="w-80 shrink-0">
          <DetailPanel
            process={selectedProcess}
            groupMeta={selectedGroupMeta}
            lang={lang}
            onClose={() => setSelectedProcess(null)}
            onSelectProcess={(p) => {
              // Vモデルに含まれるプロセスのみパネル内ナビゲーションを許可
              if (VMODEL_PROCESS_IDS.has(p.id)) setSelectedProcess(p)
            }}
          />
        </div>
      )}
    </div>
  )
}
