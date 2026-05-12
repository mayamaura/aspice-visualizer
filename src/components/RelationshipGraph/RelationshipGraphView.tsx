import { useCallback, useMemo, useState } from 'react'
// nodes/edges are fully controlled via useMemo — no useNodesState/useEdgesState needed
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { ProcessNode, OutcomeNode, BPNode, ItemNode } from './CustomNodes'
import { buildProcessLevelGraph, buildDetailLevelGraph, type GraphLevel } from './graphUtils'
import { ALL_PROCESSES } from '../../data'
import { GroupFilterBar } from '../common/GroupFilterBar'
import { EdgeTypeFilterBar, type EdgeType } from '../common/EdgeTypeFilterBar'
import type { Language, Process, ProcessGroup } from '../../types/aspice'
import { t } from '../../store/languageStore'
import { PROCESS_GROUPS } from '../../data'

const nodeTypes = {
  processNode: ProcessNode,
  outcomeNode: OutcomeNode,
  bpNode: BPNode,
  itemNode: ItemNode,
}

interface Props {
  lang: Language
}

export function RelationshipGraphView({ lang }: Props) {
  const [level, setLevel] = useState<GraphLevel>('process')
  const [focusProcess, setFocusProcess] = useState<Process | null>(null)
  const [activeGroups, setActiveGroups] = useState<Set<ProcessGroup>>(
    new Set(PROCESS_GROUPS.map((g) => g.id))
  )
  const [activeEdgeTypes, setActiveEdgeTypes] = useState<Set<EdgeType>>(
    new Set<EdgeType>(['supports', 'produces', 'input'])
  )

  const { nodes: initNodes, edges: initEdges } = useMemo(() => {
    if (level === 'process') {
      return buildProcessLevelGraph(ALL_PROCESSES, lang, activeGroups)
    } else if (focusProcess) {
      return buildDetailLevelGraph(focusProcess, lang, activeEdgeTypes)
    }
    return { nodes: [], edges: [] }
  }, [level, focusProcess, lang, activeGroups, activeEdgeTypes])

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (level === 'process') {
      const p = ALL_PROCESSES.find((proc) => proc.id === node.id)
      if (p) {
        setFocusProcess(p)
        setLevel('bp')
      }
    }
  }, [level])

  const handleBackToProcess = () => {
    setLevel('process')
    setFocusProcess(null)
  }

  const groupMeta = focusProcess ? PROCESS_GROUPS.find((g) => g.id === focusProcess.group) : null

  return (
    <div className="flex flex-col h-full">
      {/* Group filter (process level only) */}
      {level === 'process' && (
        <GroupFilterBar selected={activeGroups} lang={lang} onChange={setActiveGroups} />
      )}

      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-2.5 bg-gray-900 border-b border-gray-800 shrink-0 flex-wrap">
        {/* Level tabs */}
        <div className="flex rounded-lg overflow-hidden border border-gray-700 shrink-0">
          <button
            onClick={handleBackToProcess}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              level === 'process' ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            {lang === 'en' ? 'Process Level' : 'プロセスレベル'}
          </button>
          <button
            onClick={() => { if (focusProcess) setLevel('bp') }}
            className={`px-3 py-1.5 text-xs font-medium transition-colors border-l border-gray-700 ${
              level === 'bp'
                ? 'bg-gray-700 text-white'
                : focusProcess
                ? 'text-gray-400 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 cursor-not-allowed'
            }`}
          >
            {lang === 'en' ? 'BP / Item Level' : 'BP / 情報項目レベル'}
          </button>
        </div>

        {/* Focus process badge */}
        {level === 'bp' && focusProcess && groupMeta && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">→</span>
            <span className={`font-mono text-xs font-bold ${groupMeta.textColor}`}>{focusProcess.id}</span>
            <span className="text-xs text-gray-300">{t(focusProcess.name, lang)}</span>
            <button
              onClick={handleBackToProcess}
              className="ml-1 text-xs text-gray-500 hover:text-gray-200 underline"
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
          <span className="ml-auto text-xs text-gray-500">
            {lang === 'en' ? 'Click a node to drill down' : 'ノードをクリックして展開'}
          </span>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1">
        <ReactFlow
          nodes={initNodes}
          edges={initEdges}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.1}
          maxZoom={2}
        >
          <Background color="#1f2937" gap={20} />
          <Controls />
          <MiniMap
            nodeColor={(n) => (n.data as { bg?: string }).bg ?? '#374151'}
            style={{ background: '#111827' }}
          />
        </ReactFlow>
      </div>
    </div>
  )
}
