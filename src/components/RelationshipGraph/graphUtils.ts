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

// 可変ノード（outcome / bp / item）の min/max 幅（CustomNodes.tsx の Tailwind クラスと一致）
const VAR_NODE_W: Record<'outcomeNode' | 'bpNode' | 'itemNode', { min: number; max: number }> = {
  outcomeNode: { min: 200, max: 280 },
  bpNode:      { min: 160, max: 240 },
  itemNode:    { min: 120, max: 200 },
}

// 共通パディング / 行高定数（px-3 py-2 = 横24px/縦16px、text-xs leading-tight ≈ 15px/行、mb-0.5 = 2px）
const PAD_X   = 24
const PAD_Y   = 16
const LINE_H  = 15
const LABEL_GAP = 2

function processNodeColor(group: string) {
  return { bg: GROUP_COLOR[group] ?? '#1f2937', border: GROUP_BORDER[group] ?? '#4b5563' }
}

function firstSentence(text: string): string {
  const m = text.match(/^[^。.!?！？]+[。.!?！？]/)
  const s = m ? m[0].trim() : text
  return s.length > 150 ? s.slice(0, 150) + '…' : s
}

function nodeSizeForLayout(node: Node): { width: number; height: number } {
  const est = (node.data as { _size?: { width: number; height: number } })._size
  return est ?? NODE_SIZE[node.type ?? 'processNode'] ?? { width: 160, height: 60 }
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
    const size = nodeSizeForLayout(node)
    g.setNode(node.id, { width: size.width, height: size.height })
  }

  for (const edge of edges) {
    g.setEdge(edge.source, edge.target)
  }

  dagre.layout(g)

  return nodes.map((node) => {
    const pos = g.node(node.id)
    const size = nodeSizeForLayout(node)
    return {
      ...node,
      position: {
        x: pos.x - size.width / 2,
        y: pos.y - size.height / 2,
      },
    }
  })
}

// ---- グループコンテナの y 座標・高さ（固定） ----
// x 座標・幅はノードのテキスト幅を計測して動的に決定する
// 高さ = LABEL_H(30) + rows×NODE_H(65) + (rows-1)×ROW_GAP(10) + INNER_PAD(15)
const GROUP_FIXED: Record<string, { y: number; height: number }> = {
  SUP: { y: 0,   height: 410 },  // 5行
  SYS: { y: 0,   height: 260 },  // 3行
  VAL: { y: 0,   height: 110 },  // 1行
  MAN: { y: 0,   height: 335 },  // 4行
  SWE: { y: 280, height: 260 },  // 3行（HWEと高さ揃え）
  HWE: { y: 280, height: 260 },  // SWEに揃えて 185→260
  ACQ: { y: 430, height: 185 },  // 2行
  SEC: { y: 560, height: 185 },  // 2行（MLEと高さ・y揃え）
  MLE: { y: 560, height: 185 },  // SECに合わせ y: 485→560
  PIM: { y: 355, height: 110 },  // 1行
  REU: { y: 485, height: 110 },  // 1行
  SPL: { y: 615, height: 110 },  // 1行
}

// 各プロセスのグループ内の行・列インデックス（col 0=左列 / 1=右列）
const PROCESS_LAYOUT: Record<string, { row: number; col: 0 | 1 }> = {
  'SUP.1':  {row:0,col:0}, 'SUP.8':  {row:1,col:0}, 'SUP.9':  {row:2,col:0},
  'SUP.10': {row:3,col:0}, 'SUP.11': {row:4,col:0},
  'SYS.1':  {row:0,col:0}, 'SYS.5':  {row:0,col:1},
  'SYS.2':  {row:1,col:0},
  'SYS.3':  {row:2,col:0}, 'SYS.4':  {row:2,col:1},
  'VAL.1':  {row:0,col:0},
  'MAN.3':  {row:0,col:0}, 'MAN.5':  {row:1,col:0}, 'MAN.6':  {row:2,col:0}, 'MAN.7':  {row:3,col:0},
  'SWE.1':  {row:0,col:0}, 'SWE.6':  {row:0,col:1},
  'SWE.2':  {row:1,col:0}, 'SWE.5':  {row:1,col:1},
  'SWE.3':  {row:2,col:0}, 'SWE.4':  {row:2,col:1},
  'HWE.1':  {row:0,col:0}, 'HWE.4':  {row:0,col:1},
  'HWE.2':  {row:1,col:0}, 'HWE.3':  {row:1,col:1},
  'ACQ.2':  {row:0,col:0}, 'ACQ.4':  {row:1,col:0},
  'SEC.1':  {row:0,col:0}, 'SEC.4':  {row:0,col:1},
  'SEC.2':  {row:1,col:0}, 'SEC.3':  {row:1,col:1},
  'MLE.1':  {row:0,col:0}, 'MLE.4':  {row:0,col:1},
  'MLE.2':  {row:1,col:0}, 'MLE.3':  {row:1,col:1},
  'PIM.3':  {row:0,col:0}, 'REU.2':  {row:0,col:0}, 'SPL.2':  {row:0,col:0},
}

// グローバル列構成（同一列の最大コンテナ幅でグループ x 座標を決定）
const GLOBAL_COLUMNS: ProcessGroup[][] = [
  ['SUP', 'ACQ'],
  ['SYS', 'SWE', 'SEC'],
  ['VAL', 'HWE', 'MLE'],
  ['MAN', 'PIM', 'REU', 'SPL'],
]

// ---- レイアウト定数 ----
const LABEL_H       = 30   // グループラベル領域の高さ
const NODE_H        = 65   // ノード高さ（固定）
const ROW_GAP       = 10   // 行間ギャップ
const INNER_PAD     = 15   // グループ内パディング（左右・下）
const COL_GAP_INNER = 15   // グループ内の列間ギャップ
const COL_GAP_OUTER = 20   // グループ列間ギャップ

// ---- テキスト幅計測（Canvas API） ----
let _canvas: HTMLCanvasElement | null = null

function measurePx(text: string, font: string): number {
  if (typeof document === 'undefined') {
    // ブラウザ外フォールバック（CJK ≈ 12px, ASCII ≈ 7px）
    let w = 0
    for (const ch of text) w += ch.charCodeAt(0) > 127 ? 12 : 7
    return w
  }
  if (!_canvas) _canvas = document.createElement('canvas')
  const ctx = _canvas.getContext('2d')!
  ctx.font = font
  return ctx.measureText(text).width
}

const FONT_NAME = '12px ui-sans-serif,system-ui,sans-serif'
const FONT_ID   = 'bold 12px ui-monospace,monospace'

/**
 * CustomNodes.tsx の実 CSS に基づいてノードの描画サイズを推定する。
 * label 行 + labelGap + body 行 × 折返し行数 で高さを算出し、
 * clamp(max(labelW, bodyNaturalW), minW, maxW) で幅を決定する。
 */
function estimateNodeSize(
  type: 'outcomeNode' | 'bpNode' | 'itemNode',
  labelText: string,
  bodyText: string,
): { width: number; height: number } {
  const { min: minW, max: maxW } = VAR_NODE_W[type]
  const labelW       = measurePx(labelText, FONT_ID)   + PAD_X
  const bodyNaturalW = measurePx(bodyText,  FONT_NAME) + PAD_X
  const contentW     = Math.min(maxW, Math.max(minW, labelW, bodyNaturalW))
  const bodyLines    = Math.max(1, Math.ceil(measurePx(bodyText, FONT_NAME) / (contentW - PAD_X)))
  const height       = Math.ceil(PAD_Y + LINE_H + LABEL_GAP + bodyLines * LINE_H)
  return { width: Math.ceil(contentW), height }
}

// EN・JA 両言語のうち長い方のテキスト幅 + 水平パディング (px-3 = 24px)
function calcNodeWidth(process: Process): number {
  const pad = 24
  return Math.max(
    140,
    Math.ceil(measurePx(process.id,      FONT_ID)   + pad),
    Math.ceil(measurePx(process.name.en, FONT_NAME) + pad),
    Math.ceil(measurePx(process.name.ja, FONT_NAME) + pad),
  )
}

/**
 * プロセスレベルグラフ。
 * ASPICE 4.0 プロセスアーキテクチャ図に準拠した固定レイアウトで表示する。
 * 各プロセスノードの幅は EN/JA 両テキストをCanvas計測した最大値で決定し、
 * グループコンテナ幅はその列最大幅から動的に算出する。エッジなし。
 */
export function buildProcessLevelGraph(
  processes: Process[],
  lang: Language,
  activeGroups: Set<ProcessGroup>
): { nodes: Node[]; edges: Edge[] } {
  // 1. グループごとに左列・右列の最大ノード幅を算出
  const colWidths: Partial<Record<ProcessGroup, { col0: number; col1: number }>> = {}
  for (const gid of activeGroups) {
    let col0 = 0, col1 = 0
    for (const p of processes.filter((p) => p.group === gid)) {
      const w = calcNodeWidth(p)
      if ((PROCESS_LAYOUT[p.id]?.col ?? 0) === 0) col0 = Math.max(col0, w)
      else col1 = Math.max(col1, w)
    }
    colWidths[gid] = { col0, col1 }
  }

  // 2. グループコンテナ幅を算出（個別）
  const containerW: Partial<Record<ProcessGroup, number>> = {}
  for (const gid of activeGroups) {
    const { col0, col1 } = colWidths[gid]!
    containerW[gid] = INNER_PAD + col0 + (col1 > 0 ? COL_GAP_INNER + col1 : 0) + INNER_PAD
  }

  // 2b. 同一グローバル列内でコンテナ幅を統一（最大値に揃える）
  for (const colGroups of GLOBAL_COLUMNS) {
    const active = colGroups.filter((g) => activeGroups.has(g))
    if (active.length === 0) continue
    const maxW = Math.max(...active.map((g) => containerW[g] ?? 0))
    for (const g of active) containerW[g] = maxW
  }

  // 3. グローバル列のx座標を算出（同列は幅が揃っているので最初のグループの幅を使用）
  const groupX: Partial<Record<ProcessGroup, number>> = {}
  let x = 0
  for (const colGroups of GLOBAL_COLUMNS) {
    const active = colGroups.filter((g) => activeGroups.has(g))
    if (active.length === 0) continue
    const colWidth = containerW[active[0]] ?? 0
    for (const g of active) groupX[g] = x
    x += colWidth + COL_GAP_OUTER
  }

  // 4. ノード生成
  const nodes: Node[] = []
  for (const gid of activeGroups) {
    const fixed = GROUP_FIXED[gid]
    if (!fixed) continue

    const { bg, border } = processNodeColor(gid)
    const groupMeta = PROCESS_GROUPS.find((g) => g.id === gid)
    const groupName = groupMeta ? t(groupMeta.name, lang) : gid
    const { col0, col1 } = colWidths[gid]!
    const cw = containerW[gid]!
    const gx = groupX[gid] ?? 0
    const col1X = INNER_PAD + col0 + COL_GAP_INNER

    const groupNodeId = `group-${gid}`
    nodes.push({
      id: groupNodeId,
      type: 'groupNode',
      position: { x: gx, y: fixed.y },
      style: { width: cw, height: fixed.height },
      selectable: false,
      draggable: false,
      data: { label: gid, name: groupName, color: bg, borderColor: border },
    })

    for (const p of processes.filter((p) => p.group === gid)) {
      const pl = PROCESS_LAYOUT[p.id] ?? { row: 0, col: 0 }
      const isCol1 = pl.col === 1
      nodes.push({
        id: p.id,
        type: 'processNode',
        position: {
          x: isCol1 ? col1X : INNER_PAD,
          y: LABEL_H + pl.row * (NODE_H + ROW_GAP),
        },
        parentNode: groupNodeId,
        extent: 'parent' as const,
        style: { width: isCol1 ? col1 : col0 },
        data: {
          label: p.id,
          name: t(p.name, lang),
          group: p.group,
          bg,
          border,
          showHandles: false,
          purpose: firstSentence(t(p.purpose, lang)),
          outcomeCount: p.outcomes.length,
          bpCount: p.base_practices.length,
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
      const ocLabel = `${process.id}.${oc.id}`
      const ocDesc  = t(oc.text, lang)
      const ocEst   = estimateNodeSize('outcomeNode', ocLabel, ocDesc)
      nodes.push({
        id: ocNodeId,
        type: 'outcomeNode',
        position: { x: 0, y: 0 },
        style: { width: ocEst.width },
        data: { label: ocLabel, description: ocDesc, _size: ocEst },
      })
    })
  }

  // BP ノード + supports エッジ（BP → Outcome）
  if (showSupports) {
    process.base_practices.forEach((bp) => {
      const bpName = t(bp.name, lang)
      const bpEst  = estimateNodeSize('bpNode', bp.id, bpName)
      nodes.push({
        id: bp.id,
        type: 'bpNode',
        position: { x: 0, y: 0 },
        style: { width: bpEst.width },
        data: { label: bp.id, name: bpName, bg, border, _size: bpEst },
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
        const item     = INFORMATION_ITEMS.find((it) => it.id === poi.id)
        const itemName = item ? t(item.name, lang) : poi.id
        const itemEst  = estimateNodeSize('itemNode', poi.id, itemName)
        nodes.push({
          id: itemNodeId,
          type: 'itemNode',
          position: { x: 0, y: 0 },
          style: { width: itemEst.width },
          data: {
            label: poi.id,
            name: itemName,
            isOutput: true,
            _size: itemEst,
          },
        })
      }

      poi.outcome_refs.forEach((refId) => {
        const ocNodeId = `oc-${refId}`
        // Outcome ノードが存在しない場合（supports が OFF）は追加する
        if (!nodes.find((n) => n.id === ocNodeId)) {
          const oc      = process.outcomes.find((o) => o.id === refId)
          const fallbackLabel = `${process.id}.${refId}`
          const fallbackDesc  = oc ? t(oc.text, lang) : String(refId)
          const fallbackEst   = estimateNodeSize('outcomeNode', fallbackLabel, fallbackDesc)
          nodes.push({
            id: ocNodeId,
            type: 'outcomeNode',
            position: { x: 0, y: 0 },
            style: { width: fallbackEst.width },
            data: { label: fallbackLabel, description: fallbackDesc, _size: fallbackEst },
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
 * XX-YY 形式のIDを XX でグループ化し列に配置、YY の昇順で行方向に並べる。
 */
export function buildItemLevelGraph(
  processes: Process[],
  lang: Language
): { nodes: Node[]; edges: Edge[] } {
  const usedItemIds = new Set<string>()
  processes.forEach((p) => p.output_information_items.forEach((poi) => usedItemIds.add(poi.id)))

  // XX-YY 形式の ID を XX でグループ化
  const groups = new Map<string, string[]>()
  const ungrouped: string[] = []
  for (const id of usedItemIds) {
    const match = id.match(/^(\d+)-(\d+)$/)
    if (match) {
      const xx = match[1]
      if (!groups.has(xx)) groups.set(xx, [])
      groups.get(xx)!.push(id)
    } else {
      ungrouped.push(id)
    }
  }

  // XX を数値順にソート、各グループ内は YY の昇順にソート
  const sortedXXs = Array.from(groups.keys()).sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
  for (const xx of sortedXXs) {
    groups.get(xx)!.sort((a, b) => parseInt(a.split('-')[1], 10) - parseInt(b.split('-')[1], 10))
  }

  const COL_GAP = 20
  const ROW_GAP = 15

  const nodes: Node[] = []
  let colX = 0

  for (const xx of sortedXXs) {
    const items = groups.get(xx)!
    // 列内の各アイテムのサイズを先に計算
    const colSizes = items.map((id) => {
      const item     = INFORMATION_ITEMS.find((i) => i.id === id)
      const itemName = item ? t(item.name, lang) : id
      return { id, itemName, est: estimateNodeSize('itemNode', id, itemName) }
    })
    // 列幅 = 列内最大 est.width
    const colW = Math.max(...colSizes.map((e) => e.est.width))
    let y = 0
    for (const { id, itemName, est } of colSizes) {
      nodes.push({
        id: `item-${id}`,
        type: 'itemNode',
        position: { x: colX, y },
        style: { width: est.width },
        data: { label: id, name: itemName, isOutput: true, clickable: true, _size: est },
      })
      y += est.height + ROW_GAP
    }
    colX += colW + COL_GAP
  }

  // XX-YY 形式でないIDは末尾列に追加
  const ungroupedSorted = ungrouped.sort()
  const ungroupedSizes = ungroupedSorted.map((id) => {
    const item     = INFORMATION_ITEMS.find((i) => i.id === id)
    const itemName = item ? t(item.name, lang) : id
    return { id, itemName, est: estimateNodeSize('itemNode', id, itemName) }
  })
  let y = 0
  for (const { id, itemName, est } of ungroupedSizes) {
    nodes.push({
      id: `item-${id}`,
      type: 'itemNode',
      position: { x: colX, y },
      style: { width: est.width },
      data: { label: id, name: itemName, isOutput: true, clickable: true, _size: est },
    })
    y += est.height + ROW_GAP
  }

  return { nodes, edges: [] }
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
  const item        = INFORMATION_ITEMS.find((i) => i.id === itemId)
  const itemNodeId  = `item-${itemId}`
  const focusName   = item ? t(item.name, lang) : itemId
  const focusEst    = estimateNodeSize('itemNode', itemId, focusName)
  nodes.push({
    id: itemNodeId,
    type: 'itemNode',
    position: { x: 0, y: 0 },
    style: { width: focusEst.width },
    data: { label: itemId, name: focusName, isOutput: true, _size: focusEst },
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
        const focusOcLabel = `${process.id}.${refId}`
        const focusOcDesc  = oc ? t(oc.text, lang) : String(refId)
        const focusOcEst   = estimateNodeSize('outcomeNode', focusOcLabel, focusOcDesc)
        nodes.push({
          id: ocNodeId,
          type: 'outcomeNode',
          position: { x: 0, y: 0 },
          style: { width: focusOcEst.width },
          data: { label: focusOcLabel, description: focusOcDesc, _size: focusOcEst },
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
