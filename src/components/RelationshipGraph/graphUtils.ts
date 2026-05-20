import type { Node, Edge } from 'reactflow'
import type { Process, ProcessGroup } from '../../types/aspice'
import type { Language } from '../../types/aspice'
import { t } from '../../store/languageStore'
import type { EdgeType } from '../common/EdgeTypeFilterBar'
import { INFORMATION_ITEMS, PROCESS_GROUPS } from '../../data'
import dagre from '@dagrejs/dagre'

export type GraphLevel = 'process' | 'bp' | 'item'

const GROUP_COLOR: Record<string, string> = {
  SYS: '#1e3a5f',
  SWE: '#2d1b69',
  HWE: '#0e4f5c',
  VAL: '#1a3a1a',
  MLE: '#2d1b5a',
  MAN: '#4a3500',
  SUP: '#0f3d1f',
  PIM: '#3d3a00',
  ACQ: '#4a2000',
  SPL: '#4a1020',
  REU: '#0f3d3d',
  SEC: '#4a1010',
}

const GROUP_BORDER: Record<string, string> = {
  SYS: '#2563eb',
  SWE: '#7c3aed',
  HWE: '#0891b2',
  VAL: '#65a30d',
  MLE: '#7e22ce',
  MAN: '#d97706',
  SUP: '#16a34a',
  PIM: '#ca8a04',
  ACQ: '#ea580c',
  SPL: '#e11d48',
  REU: '#0d9488',
  SEC: '#dc2626',
}

const NODE_SIZE: Record<string, { width: number; height: number }> = {
  processNode: { width: 175, height: 65 },
  outcomeNode:  { width: 155, height: 55 },
  bpNode:       { width: 175, height: 55 },
  itemNode:     { width: 145, height: 50 },
}

function processNodeColor(group: string) {
  return { bg: GROUP_COLOR[group] ?? '#1f2937', border: GROUP_BORDER[group] ?? '#4b5563' }
}

function applyDagreLayout(
  nodes: Node[],
  edges: Edge[],
  options: { rankdir?: 'LR' | 'TB'; ranksep?: number; nodesep?: number } = {}
): Node[] {
  const g = new dagre.graphlib.Graph()
  g.setDefaultEdgeLabel(() => ({}))
  g.setGraph({
    rankdir: options.rankdir ?? 'LR',
    ranksep: options.ranksep ?? 100,
    nodesep: options.nodesep ?? 50,
    marginx: 30,
    marginy: 30,
  })

  for (const node of nodes) {
    const size = NODE_SIZE[node.type ?? 'processNode'] ?? { width: 160, height: 60 }
    g.setNode(node.id, { width: size.width, height: size.height })
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    const size = NODE_SIZE[node.type ?? 'processNode'] ?? { width: 160, height: 60 }
    return {
      ...node,
      position: {
        x: pos.x - size.width / 2,
        y: pos.y - size.height / 2,
      },
    }
  })
}

// ASPICE 4.0 プロセスアーキテクチャ図に準拠したグループコンテナの絶対座標・サイズ
// 列構成: [SUP/ACQ] [SYS/SWE/SEC] [VAL/HWE/MLE] [MAN/PIM/REU/SPL]
const GROUP_LAYOUT: Record<string, { x: number; y: number; width: number; height: number }> = {
  SUP: { x: 0,    y: 0,   width: 205, height: 410 },
  SYS: { x: 225,  y: 0,   width: 395, height: 260 },
  VAL: { x: 640,  y: 0,   width: 205, height: 110 },
  MAN: { x: 1055, y: 0,   width: 205, height: 335 },
  SWE: { x: 225,  y: 280, width: 395, height: 260 },
  HWE: { x: 640,  y: 280, width: 395, height: 185 },
  ACQ: { x: 0,    y: 430, width: 205, height: 185 },
  SEC: { x: 225,  y: 560, width: 395, height: 185 },
  MLE: { x: 640,  y: 485, width: 395, height: 185 },
  PIM: { x: 1055, y: 355, width: 205, height: 110 },
  REU: { x: 1055, y: 485, width: 205, height: 110 },
  SPL: { x: 1055, y: 615, width: 205, height: 110 },
}

// 各プロセスのグループコンテナ内ローカル座標（x:15=左パディング、y:30=ラベル分の上パディング）
// 列ステップ: 175(ノード幅)+15(列間ギャップ)=190、行ステップ: 65(ノード高)+10(行間ギャップ)=75
const PROCESS_POSITIONS: Record<string, { x: number; y: number }> = {
  // SUP: 1列×5行
  'SUP.1':  { x: 15, y: 30  },
  'SUP.8':  { x: 15, y: 105 },
  'SUP.9':  { x: 15, y: 180 },
  'SUP.10': { x: 15, y: 255 },
  'SUP.11': { x: 15, y: 330 },
  // SYS: 2列×3行（画像のカスケード配置: SYS.5を右列上段、中段右は空、下段にSYS.3/SYS.4）
  'SYS.1':  { x: 15,  y: 30  },
  'SYS.5':  { x: 205, y: 30  },
  'SYS.2':  { x: 15,  y: 105 },
  'SYS.3':  { x: 15,  y: 180 },
  'SYS.4':  { x: 205, y: 180 },
  // VAL: 1ノード
  'VAL.1':  { x: 15, y: 30 },
  // MAN: 1列×4行
  'MAN.3':  { x: 15, y: 30  },
  'MAN.5':  { x: 15, y: 105 },
  'MAN.6':  { x: 15, y: 180 },
  'MAN.7':  { x: 15, y: 255 },
  // SWE: 2列×3行
  'SWE.1':  { x: 15,  y: 30  },
  'SWE.6':  { x: 205, y: 30  },
  'SWE.2':  { x: 15,  y: 105 },
  'SWE.5':  { x: 205, y: 105 },
  'SWE.3':  { x: 15,  y: 180 },
  'SWE.4':  { x: 205, y: 180 },
  // HWE: 2列×2行
  'HWE.1':  { x: 15,  y: 30 },
  'HWE.4':  { x: 205, y: 30 },
  'HWE.2':  { x: 15,  y: 105 },
  'HWE.3':  { x: 205, y: 105 },
  // ACQ: 1列×2行
  'ACQ.2':  { x: 15, y: 30 },
  'ACQ.4':  { x: 15, y: 105 },
  // SEC: 2列×2行
  'SEC.1':  { x: 15,  y: 30 },
  'SEC.4':  { x: 205, y: 30 },
  'SEC.2':  { x: 15,  y: 105 },
  'SEC.3':  { x: 205, y: 105 },
  // MLE: 2列×2行
  'MLE.1':  { x: 15,  y: 30 },
  'MLE.4':  { x: 205, y: 30 },
  'MLE.2':  { x: 15,  y: 105 },
  'MLE.3':  { x: 205, y: 105 },
  // PIM / REU / SPL: 各1ノード
  'PIM.3':  { x: 15, y: 30 },
  'REU.2':  { x: 15, y: 30 },
  'SPL.2':  { x: 15, y: 30 },
}

/**
 * プロセスレベルグラフ。
 * ASPICE 4.0 プロセスアーキテクチャ図に準拠した固定レイアウトで表示する。
 * アクティブなグループのみ GroupNode（コンテナ）を生成し、
 * 各プロセスをその子ノードとして配置する。エッジなし。
 */
export function buildProcessLevelGraph(
  processes: Process[],
  lang: Language,
  activeGroups: Set<ProcessGroup>
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []

  for (const groupId of activeGroups) {
    const layout = GROUP_LAYOUT[groupId]
    if (!layout) continue

    const { bg, border } = processNodeColor(groupId)
    const groupMeta = PROCESS_GROUPS.find((g) => g.id === groupId)
    const groupName = groupMeta ? t(groupMeta.name, lang) : groupId

    // グループコンテナノード
    const groupNodeId = `group-${groupId}`
    nodes.push({
      id: groupNodeId,
      type: 'groupNode',
      position: { x: layout.x, y: layout.y },
      style: { width: layout.width, height: layout.height },
      selectable: false,
      draggable: false,
      data: { label: groupId, name: groupName, color: bg, borderColor: border },
    })

    // プロセスノード（グループコンテナの子）
    const groupProcesses = processes.filter((p) => p.group === groupId)
    for (const p of groupProcesses) {
      const pos = PROCESS_POSITIONS[p.id] ?? { x: 15, y: 30 }
      nodes.push({
        id: p.id,
        type: 'processNode',
        position: pos,
        parentNode: groupNodeId,
        extent: 'parent' as const,
        data: {
          label: p.id,
          name: t(p.name, lang),
          group: p.group,
          bg,
          border,
          showHandles: false,
        },
      })
    }
  }

  return { nodes, edges: [] }
}

/**
 * BPレベルグラフ（単一プロセスの詳細）。
 *
 * エッジ構成（ASPICE 4.0 対応）:
 *   supports: BP → Outcome  （bp.outcome_refs から構築）
 *   produces: Outcome → OutputItem  （output_information_items[].outcome_refs から構築）
 */
export function buildDetailLevelGraph(
  process: Process,
  lang: Language,
  activeEdgeTypes: Set<EdgeType>
): { nodes: Node[]; edges: Edge[] } {
  const { bg, border } = processNodeColor(process.group)
  const nodes: Node[] = []
  const edges: Edge[] = []

  // プロセスルートノード
  nodes.push({
    id: process.id,
    type: 'processNode',
    position: { x: 0, y: 0 },
    data: { label: process.id, name: t(process.name, lang), group: process.group, bg, border, isRoot: true },
  })

  const showSupports = activeEdgeTypes.has('supports')
  const showProduces = activeEdgeTypes.has('produces')

  // Outcome ノード（supports または produces が有効なら表示）
  if (showSupports || showProduces) {
    process.outcomes.forEach((oc) => {
      const ocNodeId = `oc-${oc.id}`
      nodes.push({
        id: ocNodeId,
        type: 'outcomeNode',
        position: { x: 0, y: 0 },
        data: { label: `${process.id}.${oc.id}`, description: t(oc.text, lang) },
      })
    })
  }

  // BP ノード + supports エッジ（BP → Outcome）
  if (showSupports) {
    process.base_practices.forEach((bp) => {
      nodes.push({
        id: bp.id,
        type: 'bpNode',
        position: { x: 0, y: 0 },
        data: { label: bp.id, name: t(bp.name, lang), bg, border },
      })

      bp.outcome_refs.forEach((refId) => {
        const ocNodeId = `oc-${refId}`
        edges.push({
          id: `${bp.id}→${ocNodeId}`,
          source: bp.id,
          target: ocNodeId,
          type: 'default',
          style: { stroke: '#6366f1', strokeWidth: 1.5, strokeDasharray: '4 3' },
          label: lang === 'en' ? 'supports' : '達成',
          labelStyle: { fill: '#818cf8', fontSize: 10 },
          labelBgStyle: { fill: '#0f172a' },
        })
      })
    })
  }

  // OutputItem ノード + produces エッジ（Outcome → OutputItem）
  if (showProduces) {
    process.output_information_items.forEach((poi) => {
      const itemNodeId = `item-${poi.id}`
      if (!nodes.find((n) => n.id === itemNodeId)) {
        const item = INFORMATION_ITEMS.find((it) => it.id === poi.id)
        nodes.push({
          id: itemNodeId,
          type: 'itemNode',
          position: { x: 0, y: 0 },
          data: {
            label: poi.id,
            name: item ? t(item.name, lang) : poi.id,
            isOutput: true,
          },
        })
      }

      poi.outcome_refs.forEach((refId) => {
        const ocNodeId = `oc-${refId}`
        // Outcome ノードが存在しない場合（supports が OFF）は追加する
        if (!nodes.find((n) => n.id === ocNodeId)) {
          const oc = process.outcomes.find((o) => o.id === refId)
          nodes.push({
            id: ocNodeId,
            type: 'outcomeNode',
            position: { x: 0, y: 0 },
            data: { label: `${process.id}.${refId}`, description: oc ? t(oc.text, lang) : String(refId) },
          })
        }
        edges.push({
          id: `${ocNodeId}→${itemNodeId}`,
          source: ocNodeId,
          target: itemNodeId,
          type: 'default',
          style: { stroke: '#22c55e', strokeWidth: 1.5 },
          label: lang === 'en' ? 'produces' : '生成',
          labelStyle: { fill: '#4ade80', fontSize: 10 },
          labelBgStyle: { fill: '#0f172a' },
        })
      })
    })
  }

  const layoutNodes = applyDagreLayout(nodes, edges, { rankdir: 'LR', ranksep: 260, nodesep: 35 })

  return { nodes: layoutNodes, edges }
}

/**
 * 情報項目一覧グラフ。
 * 全プロセスが出力する情報項目ノードを一覧表示する（クリックで起点グラフへ遷移）。
 */
export function buildItemLevelGraph(
  processes: Process[],
  lang: Language
): { nodes: Node[]; edges: Edge[] } {
  const usedItemIds = new Set<string>()
  processes.forEach((p) => p.output_information_items.forEach((poi) => usedItemIds.add(poi.id)))

  const nodes: Node[] = []
  usedItemIds.forEach((id) => {
    const item = INFORMATION_ITEMS.find((i) => i.id === id)
    nodes.push({
      id: `item-${id}`,
      type: 'itemNode',
      position: { x: 0, y: 0 },
      data: { label: id, name: item ? t(item.name, lang) : id, isOutput: true, clickable: true },
    })
  })

  const layoutNodes = applyDagreLayout(nodes, [], { rankdir: 'LR', ranksep: 80, nodesep: 30 })
  return { nodes: layoutNodes, edges: [] }
}

/**
 * 情報項目起点グラフ。
 * 選択した情報項目を右端に置き、それを生成する Outcome と Process を左側に逆引き展開する。
 * 複数のプロセスが同じ情報項目を出力する場合はすべて表示される。
 */
export function buildItemFocusGraph(
  itemId: string,
  processes: Process[],
  lang: Language
): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = []
  const edges: Edge[] = []

  // 右端: 選択情報項目ノード
  const item = INFORMATION_ITEMS.find((i) => i.id === itemId)
  const itemNodeId = `item-${itemId}`
  nodes.push({
    id: itemNodeId,
    type: 'itemNode',
    position: { x: 0, y: 0 },
    data: { label: itemId, name: item ? t(item.name, lang) : itemId, isOutput: true },
  })

  // 全プロセスを逆引き: この情報項目を出力しているプロセスを収集
  processes.forEach((process) => {
    const poi = process.output_information_items.find((p) => p.id === itemId)
    if (!poi) return

    const { bg, border } = processNodeColor(process.group)

    // 左端: プロセスノード（重複なし）
    if (!nodes.find((n) => n.id === process.id)) {
      nodes.push({
        id: process.id,
        type: 'processNode',
        position: { x: 0, y: 0 },
        data: { label: process.id, name: t(process.name, lang), group: process.group, bg, border },
      })
    }

    // 中央: Outcome ノード＋エッジ
    poi.outcome_refs.forEach((refId) => {
      const ocNodeId = `oc-${process.id}-${refId}`
      const oc = process.outcomes.find((o) => o.id === refId)

      if (!nodes.find((n) => n.id === ocNodeId)) {
        nodes.push({
          id: ocNodeId,
          type: 'outcomeNode',
          position: { x: 0, y: 0 },
          data: { label: `${process.id}.${refId}`, description: oc ? t(oc.text, lang) : String(refId) },
        })
      }

      // Process → Outcome
      const procToOcId = `${process.id}→${ocNodeId}`
      if (!edges.find((e) => e.id === procToOcId)) {
        edges.push({
          id: procToOcId,
          source: process.id,
          target: ocNodeId,
          type: 'default',
          style: { stroke: '#6366f1', strokeWidth: 1.5 },
        })
      }

      // Outcome → 情報項目
      edges.push({
        id: `${ocNodeId}→${itemNodeId}`,
        source: ocNodeId,
        target: itemNodeId,
        type: 'default',
        style: { stroke: '#22c55e', strokeWidth: 1.5 },
        label: lang === 'en' ? 'produces' : '生成',
        labelStyle: { fill: '#4ade80', fontSize: 10 },
        labelBgStyle: { fill: '#0f172a' },
      })
    })
  })

  const layoutNodes = applyDagreLayout(nodes, edges, { rankdir: 'LR', ranksep: 260, nodesep: 35 })
  return { nodes: layoutNodes, edges }
}
