import type { Node, Edge } from 'reactflow'
import type { Process, ProcessGroup } from '../../types/aspice'
import type { Language } from '../../types/aspice'
import { t } from '../../store/languageStore'
import type { EdgeType } from '../common/EdgeTypeFilterBar'

export type GraphLevel = 'process' | 'bp'

const GROUP_COLOR: Record<string, string> = {
  SYS: '#1e3a5f',
  SWE: '#2d1b69',
  HWE: '#0e4f5c',
  MAN: '#4a3500',
  SUP: '#0f3d1f',
  ACQ: '#4a2000',
  SPL: '#4a1020',
  REU: '#0f3d3d',
}

const GROUP_BORDER: Record<string, string> = {
  SYS: '#2563eb',
  SWE: '#7c3aed',
  HWE: '#0891b2',
  MAN: '#d97706',
  SUP: '#16a34a',
  ACQ: '#ea580c',
  SPL: '#e11d48',
  REU: '#0d9488',
}

function processNodeColor(group: string) {
  return { bg: GROUP_COLOR[group] ?? '#1f2937', border: GROUP_BORDER[group] ?? '#4b5563' }
}

/** Build nodes/edges for process-level view with optional group filter */
export function buildProcessLevelGraph(
  processes: Process[],
  lang: Language,
  activeGroups: Set<ProcessGroup>
): { nodes: Node[]; edges: Edge[] } {
  const filtered = processes.filter((p) => activeGroups.has(p.group))
  const filteredIds = new Set(filtered.map((p) => p.id))

  const nodes: Node[] = filtered.map((p, i) => {
    const col = i % 6
    const row = Math.floor(i / 6)
    const { bg, border } = processNodeColor(p.group)
    return {
      id: p.id,
      type: 'processNode',
      position: { x: col * 220, y: row * 120 },
      data: { label: p.id, name: t(p.name, lang), group: p.group, bg, border },
    }
  })

  // Build edges: process A produces itemX → process B consumes itemX
  // Both endpoints must be in the filtered set
  const itemProducers: Record<string, string[]> = {}
  const itemConsumers: Record<string, string[]> = {}

  for (const p of filtered) {
    for (const bp of p.basePractices) {
      for (const ref of bp.outputs) {
        if (!itemProducers[ref.itemId]) itemProducers[ref.itemId] = []
        if (!itemProducers[ref.itemId].includes(p.id)) itemProducers[ref.itemId].push(p.id)
      }
      for (const ref of bp.inputs) {
        if (!itemConsumers[ref.itemId]) itemConsumers[ref.itemId] = []
        if (!itemConsumers[ref.itemId].includes(p.id)) itemConsumers[ref.itemId].push(p.id)
      }
    }
  }

  const edgeSet = new Set<string>()
  const edges: Edge[] = []

  for (const [itemId, producers] of Object.entries(itemProducers)) {
    const consumers = itemConsumers[itemId] ?? []
    for (const src of producers) {
      for (const tgt of consumers) {
        if (src === tgt) continue
        if (!filteredIds.has(src) || !filteredIds.has(tgt)) continue
        const key = `${src}→${tgt}:${itemId}`
        if (edgeSet.has(key)) continue
        edgeSet.add(key)
        edges.push({
          id: key,
          source: src,
          target: tgt,
          label: itemId,
          type: 'smoothstep',
          animated: false,
          style: { stroke: '#4b5563', strokeWidth: 1.5 },
          labelStyle: { fill: '#9ca3af', fontSize: 10 },
          labelBgStyle: { fill: '#111827' },
        })
      }
    }
  }

  return { nodes, edges }
}

/** Build nodes/edges for a single process expanded to BP + Item level with edge type filter */
export function buildDetailLevelGraph(
  process: Process,
  lang: Language,
  activeEdgeTypes: Set<EdgeType>
): { nodes: Node[]; edges: Edge[] } {
  const { bg, border } = processNodeColor(process.group)
  const nodes: Node[] = []
  const edges: Edge[] = []

  // Process root node
  nodes.push({
    id: process.id,
    type: 'processNode',
    position: { x: 0, y: 0 },
    data: { label: process.id, name: t(process.name, lang), group: process.group, bg, border, isRoot: true },
  })

  // Outcome nodes（supports エッジが有効な場合のみ表示）
  if (activeEdgeTypes.has('supports')) {
    process.outcomes.forEach((oc, i) => {
      nodes.push({
        id: oc.id,
        type: 'outcomeNode',
        position: { x: -320, y: i * 80 - (process.outcomes.length * 40) },
        data: { label: oc.id, description: t(oc.description, lang) },
      })
    })
  }

  // BP nodes
  process.basePractices.forEach((bp, i) => {
    const y = i * 110 - (process.basePractices.length * 55)
    nodes.push({
      id: bp.id,
      type: 'bpNode',
      position: { x: 320, y },
      data: { label: bp.id, name: t(bp.name, lang), bg, border },
    })

    // BP → supports Outcomes
    if (activeEdgeTypes.has('supports')) {
      bp.supportsOutcomes.forEach((ocId) => {
        edges.push({
          id: `${bp.id}→${ocId}`,
          source: bp.id,
          target: ocId,
          type: 'smoothstep',
          style: { stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 3' },
          label: lang === 'en' ? 'supports' : '達成',
          labelStyle: { fill: '#818cf8', fontSize: 10 },
          labelBgStyle: { fill: '#0f172a' },
        })
      })
    }

    // Output items
    if (activeEdgeTypes.has('produces')) {
      bp.outputs.forEach((ref) => {
        const itemNodeId = `item-${ref.itemId}`
        if (!nodes.find((n) => n.id === itemNodeId)) {
          const item = process.outputItems.find((it) => it.id === ref.itemId)
          nodes.push({
            id: itemNodeId,
            type: 'itemNode',
            position: { x: 700, y: nodes.length * 70 - 200 },
            data: {
              label: ref.itemId,
              name: item ? t(item.name, lang) : ref.itemId,
              isOutput: true,
            },
          })
        }
        edges.push({
          id: `${bp.id}→${itemNodeId}`,
          source: bp.id,
          target: itemNodeId,
          type: 'smoothstep',
          style: { stroke: '#22c55e', strokeWidth: 1.5 },
          label: lang === 'en' ? 'produces' : '生成',
          labelStyle: { fill: '#4ade80', fontSize: 10 },
          labelBgStyle: { fill: '#0f172a' },
        })
      })
    }

    // Input items
    if (activeEdgeTypes.has('input')) {
      bp.inputs.forEach((ref) => {
        const itemNodeId = `ext-${ref.itemId}`
        if (!nodes.find((n) => n.id === itemNodeId)) {
          nodes.push({
            id: itemNodeId,
            type: 'itemNode',
            position: { x: -700, y: nodes.length * 70 - 200 },
            data: {
              label: ref.itemId,
              name: ref.itemId,
              isOutput: false,
            },
          })
        }
        edges.push({
          id: `${itemNodeId}→${bp.id}`,
          source: itemNodeId,
          target: bp.id,
          type: 'smoothstep',
          style: { stroke: '#3b82f6', strokeWidth: 1.5 },
          label: lang === 'en' ? 'input' : '入力',
          labelStyle: { fill: '#60a5fa', fontSize: 10 },
          labelBgStyle: { fill: '#0f172a' },
        })
      })
    }
  })

  return { nodes, edges }
}
