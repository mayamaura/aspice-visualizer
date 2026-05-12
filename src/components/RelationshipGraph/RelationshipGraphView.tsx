import { useCallback, useMemo, useState } from 'react'
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type NodeMouseHandler,
} from 'reactflow'
import 'reactflow/dist/style.css'

import { ProcessNode, OutcomeNode, BPNode, ItemNode } from './CustomNodes'
import { buildProcessLevelGraph, buildDetailLevelGraph, type GraphLevel } from './graphUtils'
import { ALL_PROCESSES } from '../../data'
import type { Language, Process } from '../../types/aspice'
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

  const { nodes: initNodes, edges: initEdges } = useMemo(() => {
    if (level === 'process') {
      return buildProcessLevelGraph(ALL_PROCESSES, lang)
    } else if (focusProcess) {
      return buildDetailLevelGraph(focusProcess, lang)
    }
    return { nodes: [], edges: [] }
  }, [level, focusProcess, lang])

  const [nodes, , onNodesChange] = useNodesState(initNodes)
  const [edges, , onEdgesChange] = useEdgesState(initEdges)

  // Re-init when source data changes
  const currentNodes = useMemo(() => initNodes, [initNodes])
  const currentEdges = useMemo(() => initEdges, [initEdges])

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    if (level === 'process') {
      const p = ALL_PROCESSES.find((proc) => proc.id === node.id)
      if (p) {
        setFocusProcess(p)
        setLevel('bp')
      }
    }
  }, [level])

  const groupMeta = focusProcess ? PROCESS_GROUPS.find((g) => g.id === focusProcess.group) : null

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex rounded-lg overflow-hidden border border-gray-700">
          <button
            onClick={() => setLevel('process')}
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

        {level === 'bp' && focusProcess && groupMeta && (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-xs">→</span>
            <span className={`font-mono text-xs font-bold ${groupMeta.textColor}`}>{focusProcess.id}</span>
            <span className="text-xs text-gray-300">{t(focusProcess.name, lang)}</span>
            <button
              onClick={() => { setLevel('process'); setFocusProcess(null) }}
              className="ml-2 text-xs text-gray-500 hover:text-gray-200 underline"
            >
              {lang === 'en' ? 'Back' : '戻る'}
            </button>
          </div>
        )}

        {level === 'process' && (
          <span className="text-xs text-gray-500">
            {lang === 'en' ? 'Click a process node to drill down' : 'プロセスノードをクリックして展開'}
          </span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 px-5 py-2 bg-gray-950 border-b border-gray-800 shrink-0 text-xs text-gray-500">
        {level === 'bp' && (
          <>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-indigo-500 inline-block" style={{ borderTop: '2px dashed #6366f1' }}></span>{lang === 'en' ? 'supports outcome' : 'プロセス成果を達成'}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-green-500 inline-block"></span>{lang === 'en' ? 'produces item' : '情報項目を生成'}</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span>{lang === 'en' ? 'input item' : '入力情報項目'}</span>
          </>
        )}
        {level === 'process' && (
          <span>{lang === 'en' ? 'Edges = information item flow between processes' : 'エッジ = プロセス間の情報項目フロー'}</span>
        )}
      </div>

      {/* Graph */}
      <div className="flex-1">
        <ReactFlow
          nodes={currentNodes}
          edges={currentEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
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
