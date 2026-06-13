import type { SankeyNode, SankeyLink } from './sankeyData'

export interface LayoutNode {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
  color: string
  side: 'left' | 'right'
  value: number
}

export interface LayoutLink {
  id: string
  sourceId: string
  targetId: string
  // ソース側の帯の y 開始/終了
  sy0: number
  sy1: number
  // ターゲット側の帯の y 開始/終了
  ty0: number
  ty1: number
  color: string
  itemIds: string[]
  value: number
}

const NODE_WIDTH = 180
const GAP = 6
const MIN_NODE_HEIGHT = 4

// ノードの外側に描画するラベル用の左右余白
export const LEFT_LABEL_MARGIN = 200
export const RIGHT_LABEL_MARGIN = 200

export function computeSankeyLayout(
  nodes: SankeyNode[],
  links: SankeyLink[],
  canvasWidth: number,
  canvasHeight: number,
): { layoutNodes: LayoutNode[]; layoutLinks: LayoutLink[] } {
  const leftNodes = nodes.filter((n) => n.side === 'left')
  const rightNodes = nodes.filter((n) => n.side === 'right')

  // 各ノードのトータル値（left = 出力合計, right = 入力合計）
  const totalValue = links.reduce((s, l) => s + l.value, 0)
  if (totalValue === 0) return { layoutNodes: [], layoutLinks: [] }

  // ノードの高さを比例配分（最小 MIN_NODE_HEIGHT を保証）
  function distributeHeights(nodeList: SankeyNode[]): Map<string, number> {
    const heights = new Map<string, number>()
    const available = canvasHeight - (nodeList.length - 1) * GAP
    for (const n of nodeList) {
      heights.set(n.id, Math.max(MIN_NODE_HEIGHT, (n.value / totalValue) * available))
    }
    return heights
  }

  const leftHeights = distributeHeights(leftNodes)
  const rightHeights = distributeHeights(rightNodes)

  // 右ノードを dominant source 順に並べ替え
  // （最も多くのリンクを送り込むソースの順序に合わせる）
  const rightOrder = sortRightNodes(rightNodes, leftNodes, links)

  // ノードの y 開始位置を計算
  function calcYStarts(nodeList: SankeyNode[], heights: Map<string, number>): Map<string, number> {
    const yStarts = new Map<string, number>()
    let y = 0
    for (const n of nodeList) {
      yStarts.set(n.id, y)
      y += (heights.get(n.id) ?? 0) + GAP
    }
    return yStarts
  }

  const leftYStarts = calcYStarts(leftNodes, leftHeights)
  const rightYStarts = calcYStarts(rightOrder, rightHeights)

  // LayoutNode を生成（ラベルがはみ出さないよう左右に余白を確保）
  const leftX = LEFT_LABEL_MARGIN
  const rightX = Math.max(
    leftX + NODE_WIDTH + 40,
    canvasWidth - NODE_WIDTH - RIGHT_LABEL_MARGIN,
  )

  const layoutNodeMap = new Map<string, LayoutNode>()
  for (const n of leftNodes) {
    const h = leftHeights.get(n.id) ?? MIN_NODE_HEIGHT
    layoutNodeMap.set(n.id, {
      id: n.id,
      label: n.label,
      x: leftX,
      y: leftYStarts.get(n.id) ?? 0,
      width: NODE_WIDTH,
      height: h,
      color: n.color,
      side: 'left',
      value: n.value,
    })
  }
  for (const n of rightOrder) {
    const h = rightHeights.get(n.id) ?? MIN_NODE_HEIGHT
    layoutNodeMap.set(n.id, {
      id: n.id,
      label: n.label,
      x: rightX,
      y: rightYStarts.get(n.id) ?? 0,
      width: NODE_WIDTH,
      height: h,
      color: n.color,
      side: 'right',
      value: n.value,
    })
  }

  // リンクのバンド位置を計算
  // 各ノード内での累積オフセット
  const sourceOffset = new Map<string, number>()
  const targetOffset = new Map<string, number>()
  for (const n of [...leftNodes, ...rightOrder]) {
    sourceOffset.set(n.id, 0)
    targetOffset.set(n.id, 0)
  }

  // リンクをソースの y 開始順にソートして帯を自然に並べる
  const sortedLinks = [...links].sort((a, b) => {
    const ay = layoutNodeMap.get(a.sourceId)?.y ?? 0
    const by = layoutNodeMap.get(b.sourceId)?.y ?? 0
    if (ay !== by) return ay - by
    const aty = layoutNodeMap.get(a.targetId)?.y ?? 0
    const bty = layoutNodeMap.get(b.targetId)?.y ?? 0
    return aty - bty
  })

  const layoutLinks: LayoutLink[] = sortedLinks.map((l) => {
    const srcNode = layoutNodeMap.get(l.sourceId)!
    const tgtNode = layoutNodeMap.get(l.targetId)!
    const srcHeight = srcNode.height
    const tgtHeight = tgtNode.height

    // ソース側の帯の高さ: リンクの値に比例
    const srcTotal = links
      .filter((lk) => lk.sourceId === l.sourceId)
      .reduce((s, lk) => s + lk.value, 0)
    const tgtTotal = links
      .filter((lk) => lk.targetId === l.targetId)
      .reduce((s, lk) => s + lk.value, 0)

    const bandSrcH = (l.value / srcTotal) * srcHeight
    const bandTgtH = (l.value / tgtTotal) * tgtHeight

    const srcOff = sourceOffset.get(l.sourceId) ?? 0
    const tgtOff = targetOffset.get(l.targetId) ?? 0

    const sy0 = srcNode.y + srcOff
    const sy1 = sy0 + bandSrcH
    const ty0 = tgtNode.y + tgtOff
    const ty1 = ty0 + bandTgtH

    sourceOffset.set(l.sourceId, srcOff + bandSrcH)
    targetOffset.set(l.targetId, tgtOff + bandTgtH)

    return {
      id: `${l.sourceId}->${l.targetId}`,
      sourceId: l.sourceId,
      targetId: l.targetId,
      sy0,
      sy1,
      ty0,
      ty1,
      color: srcNode.color,
      itemIds: l.itemIds,
      value: l.value,
    }
  })

  return { layoutNodes: [...layoutNodeMap.values()], layoutLinks }
}

// 右ノードを dominant source 順に並べ替える
// 最も多くのリンク値を送り込むソースの左ノード y 位置でソート
function sortRightNodes(
  rightNodes: SankeyNode[],
  leftNodes: SankeyNode[],
  links: SankeyLink[],
): SankeyNode[] {
  // 各右ノードの dominant source を特定（リンク値が最大のソース）
  const dominantSourceIndex = new Map<string, number>()
  for (const rn of rightNodes) {
    const incoming = links.filter((l) => l.targetId === rn.id)
    if (incoming.length === 0) {
      dominantSourceIndex.set(rn.id, Infinity)
      continue
    }
    const dom = incoming.reduce((best, l) => (l.value > best.value ? l : best))
    const idx = leftNodes.findIndex((ln) => ln.id === dom.sourceId)
    dominantSourceIndex.set(rn.id, idx === -1 ? Infinity : idx)
  }

  return [...rightNodes].sort((a, b) => {
    const ai = dominantSourceIndex.get(a.id) ?? Infinity
    const bi = dominantSourceIndex.get(b.id) ?? Infinity
    if (ai !== bi) return ai - bi
    return a.id.localeCompare(b.id)
  })
}

// SVG cubic bezier パスを生成（帯の上辺と下辺）
export function bandPath(
  x0: number,
  sy0: number,
  sy1: number,
  x1: number,
  ty0: number,
  ty1: number,
): string {
  const cx = (x0 + x1) / 2
  return [
    `M ${x0} ${sy0}`,
    `C ${cx} ${sy0}, ${cx} ${ty0}, ${x1} ${ty0}`,
    `L ${x1} ${ty1}`,
    `C ${cx} ${ty1}, ${cx} ${sy1}, ${x0} ${sy1}`,
    'Z',
  ].join(' ')
}
