import type { Node, Edge } from 'reactflow'
import { ALL_PROCESSES } from '../../data'
import { t } from '../../store/languageStore'
import type { Language } from '../../types/aspice'

const GROUP_COLOR: Record<string, string> = {
  SYS: '#1e3a5f',
  SWE: '#2d1b69',
  HWE: '#0e4f5c',
  VAL: '#1a3a1a',
}

const GROUP_BORDER: Record<string, string> = {
  SYS: '#2563eb',
  SWE: '#7c3aed',
  HWE: '#0891b2',
  VAL: '#65a30d',
}

// V字の左辺（仕様・設計フェーズ）: 上から下
const LEFT_SIDE = [
  'SYS.1', 'SYS.2', 'SYS.3',
  'SWE.1', 'SWE.2', 'SWE.3',
  'HWE.1', 'HWE.2',
] as const

// V字の右辺（統合・検証フェーズ）: 下から上（配列末尾が右辺の最上段）
const RIGHT_SIDE_BOTTOM_TO_TOP = [
  'HWE.3', 'HWE.4',
  'SWE.4', 'SWE.5', 'SWE.6',
  'SYS.4', 'SYS.5',
] as const

// 対応線（左辺 ↔ 右辺）
const CORRESPONDENCE_PAIRS: [string, string][] = [
  ['SYS.1', 'SYS.5'],
  ['SYS.2', 'SYS.4'],
  ['SYS.3', 'SYS.4'],
  ['SWE.1', 'SWE.6'],
  ['SWE.2', 'SWE.5'],
  ['SWE.3', 'SWE.4'],
  ['HWE.1', 'HWE.4'],
  ['HWE.2', 'HWE.3'],
]

const STEP_Y = 120
const LEFT_X = 60
const RIGHT_X = 700
const VAL_X = 920

// 右辺ノードの Y 座標: 配列先頭が最下部（大きいY）、末尾が最上部（y=0）
function getRightY(index: number): number {
  const total = RIGHT_SIDE_BOTTOM_TO_TOP.length
  const maxY = (LEFT_SIDE.length - 1) * STEP_Y
  const step = maxY / (total - 1)
  return (total - 1 - index) * step
}

export function buildVModelGraph(lang: Language): { nodes: Node[]; edges: Edge[] } {
  const processMap = new Map(ALL_PROCESSES.map((p) => [p.id, p]))
  const nodes: Node[] = []
  const edges: Edge[] = []

  LEFT_SIDE.forEach((pid, i) => {
    const p = processMap.get(pid)
    if (!p) return
    nodes.push({
      id: pid,
      type: 'processNode',
      position: { x: LEFT_X, y: i * STEP_Y },
      data: {
        label: p.id,
        name: t(p.name, lang),
        group: p.group,
        bg: GROUP_COLOR[p.group] ?? '#1f2937',
        border: GROUP_BORDER[p.group] ?? '#4b5563',
      },
    })
  })

  RIGHT_SIDE_BOTTOM_TO_TOP.forEach((pid, i) => {
    const p = processMap.get(pid)
    if (!p) return
    nodes.push({
      id: pid,
      type: 'processNode',
      position: { x: RIGHT_X, y: getRightY(i) },
      data: {
        label: p.id,
        name: t(p.name, lang),
        group: p.group,
        bg: GROUP_COLOR[p.group] ?? '#1f2937',
        border: GROUP_BORDER[p.group] ?? '#4b5563',
      },
    })
  })

  // VAL.1 を右上（SYS.5 と同じ高さ）に配置
  const val1 = processMap.get('VAL.1')
  if (val1) {
    nodes.push({
      id: 'VAL.1',
      type: 'processNode',
      position: { x: VAL_X, y: 0 },
      data: {
        label: val1.id,
        name: t(val1.name, lang),
        group: val1.group,
        bg: GROUP_COLOR['VAL'],
        border: GROUP_BORDER['VAL'],
      },
    })
  }

  // 対応線（灰色点線、直線）
  CORRESPONDENCE_PAIRS.forEach(([left, right]) => {
    edges.push({
      id: `corr-${left}-${right}`,
      source: left,
      target: right,
      type: 'straight',
      style: {
        stroke: '#6b7280',
        strokeDasharray: '4 4',
        strokeWidth: 1.5,
      },
    })
  })

  return { nodes, edges }
}

export const VMODEL_PROCESS_IDS = new Set<string>([
  ...LEFT_SIDE,
  ...RIGHT_SIDE_BOTTOM_TO_TOP,
  'VAL.1',
])
