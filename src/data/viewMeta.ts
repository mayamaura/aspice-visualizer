import { Map, GitBranch, Network, Grid2x2, Workflow, type LucideIcon } from 'lucide-react'

export type ViewId = 'map' | 'graph' | 'vmodel' | 'matrix' | 'flow'

export interface ViewMeta {
  id: ViewId
  icon: LucideIcon
  labelEn: string
  labelJa: string
  descEn: string
  descJa: string
}

export const VIEWS: ViewMeta[] = [
  {
    id: 'map',
    icon: Map,
    labelEn: 'Process Map',
    labelJa: 'プロセスマップ',
    descEn: 'Browse all 33 processes across 8 groups as tiles; click any process to view its purpose, outcomes, BPs, and information items.',
    descJa: '8グループ33プロセスをタイル表示し、クリックで目的・成果・BP・情報項目の詳細を確認できます。',
  },
  {
    id: 'graph',
    icon: GitBranch,
    labelEn: 'Relationship Graph',
    labelJa: 'リレーションシップグラフ',
    descEn: 'Visualize information flows between processes as a graph; switch between process, BP, and information-item levels.',
    descJa: 'プロセス間の情報フローをグラフで表示し、プロセス・BP・情報項目の各レベルに切り替えられます。',
  },
  {
    id: 'vmodel',
    icon: Network,
    labelEn: 'V-Model',
    labelJa: 'Vモデル',
    descEn: 'Arranges SYS, SWE, and HWE processes in a V-shape to reveal the correspondence between specification and verification phases.',
    descJa: 'SYS・SWE・HWEをV字に配置し、仕様フェーズと検証フェーズの対応関係を直感的に把握できます。',
  },
  {
    id: 'matrix',
    icon: Grid2x2,
    labelEn: 'Matrix',
    labelJa: 'マトリクス',
    descEn: 'Cross-reference table of processes vs. information items to survey artifact coverage at a glance.',
    descJa: 'プロセス×情報項目のクロスリファレンス表で、成果物カバレッジを一覧できます。',
  },
  {
    id: 'flow',
    icon: Workflow,
    labelEn: 'Artifact Flow',
    labelJa: '成果物フロー',
    descEn: 'Sankey diagram showing the distribution of information items produced by each process group.',
    descJa: '各プロセスグループが出力する情報項目の分布をサンキー図で俯瞰できます。',
  },
]
