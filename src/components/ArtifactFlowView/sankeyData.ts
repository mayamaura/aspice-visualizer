import type { Language, Process, ProcessGroup } from '../../types/aspice'
import { INFORMATION_ITEMS, PROCESS_GROUPS } from '../../data'

export interface SankeyNode {
  id: string
  label: string
  value: number
  color: string
  side: 'left' | 'right'
}

export interface SankeyLink {
  sourceId: string
  targetId: string
  value: number
  itemIds: string[]
}

// 情報項目 ID のプレフィックス（XX-YY の XX 部分）を返す
function itemPrefix(id: string): string {
  return id.split('-')[0]
}

// プレフィックスの表示ラベル（英語）
// INFORMATION_ITEMS からそのプレフィックスを持つ最初の item の名称先頭語を用いる
function prefixLabel(prefix: string, lang: Language): string {
  const sample = INFORMATION_ITEMS.find((item) => itemPrefix(item.id) === prefix)
  if (!sample) return `${prefix}-XX`
  const name = lang === 'en' ? sample.name.en : sample.name.ja
  // 名称が長い場合は短縮しない（SankeyCanvas 側でクリップ）
  return `${prefix}-XX`
}

// グループレベル: プロセスグループ → 情報項目カテゴリ (prefix)
export function buildGroupSankeyData(
  processes: Process[],
  lang: Language,
): { nodes: SankeyNode[]; links: SankeyLink[] } {
  // グループ × prefix の組み合わせで情報項目IDを集計
  const linkMap = new Map<string, Set<string>>()
  for (const proc of processes) {
    for (const oi of proc.output_information_items) {
      const prefix = itemPrefix(oi.id)
      const key = `${proc.group}::${prefix}`
      if (!linkMap.has(key)) linkMap.set(key, new Set())
      linkMap.get(key)!.add(oi.id)
    }
  }

  // 左ノード（プロセスグループ）
  const groupTotals = new Map<ProcessGroup, number>()
  for (const [key, ids] of linkMap) {
    const grp = key.split('::')[0] as ProcessGroup
    groupTotals.set(grp, (groupTotals.get(grp) ?? 0) + ids.size)
  }

  const leftNodes: SankeyNode[] = PROCESS_GROUPS.filter(
    (g) => groupTotals.has(g.id),
  ).map((g) => ({
    id: `group-${g.id}`,
    label: lang === 'en' ? `${g.id} ${g.name.en}` : `${g.id} ${g.name.ja}`,
    value: groupTotals.get(g.id) ?? 0,
    color: groupHexColor(g.id),
    side: 'left',
  }))

  // 右ノード（情報項目プレフィックス）
  const prefixTotals = new Map<string, number>()
  for (const [key, ids] of linkMap) {
    const prefix = key.split('::')[1]
    prefixTotals.set(prefix, (prefixTotals.get(prefix) ?? 0) + ids.size)
  }
  const sortedPrefixes = [...prefixTotals.keys()].sort()

  const rightNodes: SankeyNode[] = sortedPrefixes.map((prefix) => ({
    id: `prefix-${prefix}`,
    label: prefixLabel(prefix, lang),
    value: prefixTotals.get(prefix) ?? 0,
    color: '#374151',
    side: 'right',
  }))

  // リンク
  const links: SankeyLink[] = []
  for (const [key, ids] of linkMap) {
    const [grp, prefix] = key.split('::')
    links.push({
      sourceId: `group-${grp}`,
      targetId: `prefix-${prefix}`,
      value: ids.size,
      itemIds: [...ids].sort(),
    })
  }

  return { nodes: [...leftNodes, ...rightNodes], links }
}

// プロセスレベル: 選択グループの個別プロセス → 個別情報項目
export function buildProcessSankeyData(
  processes: Process[],
  group: ProcessGroup,
  lang: Language,
): { nodes: SankeyNode[]; links: SankeyLink[] } {
  const groupProcs = processes.filter((p) => p.group === group)
  const groupMeta = PROCESS_GROUPS.find((g) => g.id === group)!
  const baseColor = groupHexColor(group)

  // 左ノード（個別プロセス）
  const leftNodes: SankeyNode[] = groupProcs.map((p) => ({
    id: `proc-${p.id}`,
    label: lang === 'en' ? `${p.id}` : `${p.id}`,
    value: p.output_information_items.length,
    color: baseColor,
    side: 'left',
  }))

  // 出力情報項目の全ID（重複排除）
  const allItemIds = new Set<string>()
  for (const p of groupProcs) {
    for (const oi of p.output_information_items) allItemIds.add(oi.id)
  }

  // 右ノード（個別情報項目）
  const rightNodes: SankeyNode[] = [...allItemIds].sort().map((id) => {
    const item = INFORMATION_ITEMS.find((i) => i.id === id)
    return {
      id: `item-${id}`,
      label: item
        ? lang === 'en'
          ? `${id} ${item.name.en}`
          : `${id} ${item.name.ja}`
        : id,
      value: groupProcs.filter((p) => p.output_information_items.some((oi) => oi.id === id)).length,
      color: '#1e3a2a',
      side: 'right',
    }
  })

  // リンク（process → item, value = 1）
  const links: SankeyLink[] = []
  for (const p of groupProcs) {
    for (const oi of p.output_information_items) {
      links.push({
        sourceId: `proc-${p.id}`,
        targetId: `item-${oi.id}`,
        value: 1,
        itemIds: [oi.id],
      })
    }
  }

  return { nodes: [...leftNodes, ...rightNodes], links }
}

// プロセスグループIDから16進カラーコードへのマッピング（processGroups.ts の Tailwind 色に対応）
function groupHexColor(group: ProcessGroup): string {
  const map: Record<ProcessGroup, string> = {
    SYS: '#1e3a5f',
    SWE: '#2d1b69',
    HWE: '#0e3a40',
    VAL: '#1a2e05',
    MLE: '#2d1b69',
    MAN: '#451a03',
    SUP: '#052e16',
    PIM: '#422006',
    ACQ: '#431407',
    SPL: '#3b0a14',
    REU: '#0d2b2b',
    SEC: '#3b0a0a',
  }
  return map[group] ?? '#1f2937'
}

// グループカラー（明るめ、ノードボーダー用）
export function groupBorderColor(group: ProcessGroup): string {
  const map: Record<ProcessGroup, string> = {
    SYS: '#2563eb',
    SWE: '#7c3aed',
    HWE: '#0891b2',
    VAL: '#65a30d',
    MLE: '#9333ea',
    MAN: '#d97706',
    SUP: '#16a34a',
    PIM: '#ca8a04',
    ACQ: '#ea580c',
    SPL: '#e11d48',
    REU: '#0d9488',
    SEC: '#dc2626',
  }
  return map[group] ?? '#6b7280'
}
