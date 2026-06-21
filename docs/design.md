# ソフトウェア設計書

**プロジェクト名:** Automotive SPICE 4.0 / CS 2.0 Process Visualizer  
**バージョン:** 3.0  
**最終更新:** 2026-06-14  

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
ブラウザ (SPA)
├── App.tsx                   ← ルートコンポーネント（ビュー切替・言語切替・URL状態管理）
├── hooks/
│   └── useAppUrlState        ← URLクエリ ↔ React state の双方向同期（NFR-6）
├── views/
│   ├── ProcessMapView        ← プロセスマップビュー
│   ├── RelationshipGraphView ← リレーションシップグラフビュー
│   ├── VModelView            ← Vモデルビュー（SYS/SWE/HWE V字配置）
│   └── MatrixView            ← クロスリファレンスマトリクスビュー
├── data/                     ← 静的プロセスデータ（TypeScript）
├── types/                    ← 型定義
├── utils/
│   └── persistence           ← localStorage 薄いラッパー（NFR-8）
└── store/                    ← グローバル状態（言語・テーマ）
    ├── languageStore         ← 言語切替（localStorage 永続化）
    └── themeStore            ← テーマ切替（dark/light、localStorage 永続化）
```

### 1.2 技術スタック

| 役割 | 採用技術 | バージョン |
|---|---|---|
| UIフレームワーク | React | 19.x |
| 言語 | TypeScript | 5.7.x |
| ビルドツール | Vite | 6.x |
| グラフ描画 | React Flow (reactflow) | 11.x |
| グラフレイアウト | @dagrejs/dagre | 1.x |
| PNG エクスポート | html-to-image | 1.x |
| スタイル | Tailwind CSS | 3.x |
| アイコン | lucide-react | 0.469.x |
| データ | aspice_models.json（静的JSON） | — |

### 1.3 データフロー

```
src/data/aspice_models.json  ← 唯一のデータソース（差し替えで更新）
    ↓ import (via aspiceLoader.ts)
src/data/index.ts (ALL_PROCESSES, INFORMATION_ITEMS, PROCESS_GROUPS)
    ↓ props / direct import
Components (ProcessMapView, RelationshipGraphView)
    ↓ t(text, lang)
UI表示 (EN / JA)
```

言語状態は `src/store/languageStore.ts` のモジュールレベルシングルトンで管理し、`useLang()` フックで各コンポーネントが購読する。言語選択は `localStorage`（キー: `aspice-lang`）に永続化され、リロード後も復元される。

テーマ状態は `src/store/themeStore.ts` のモジュールレベルシングルトンで管理し、`useTheme()` フックで購読する。初期値は `localStorage`（キー: `aspice-theme`）→ `prefers-color-scheme` → `dark` の優先順位で決定する。テーマは `<html>` の `.light` クラスで反映する。

### 1.4 URL状態管理（NFR-6）

`src/hooks/useAppUrlState.ts` が URLクエリパラメータと React state を双方向同期する。

| URLパラメータ | 型 | 対応状態 | デフォルト時は省略 |
|---|---|---|---|
| `view` | `map\|graph\|vmodel\|matrix\|flow` | 表示ビュー | `map` の場合省略 |
| `process` | string | ProcessMapView の選択プロセスID | 未選択時省略 |
| `level` | `process\|bp\|item` | グラフビューのレベル | `process` の場合省略 |
| `focus` | string | グラフの BP レベルフォーカスプロセスID / item レベルフォーカス情報項目ID | 未選択時省略 |
| `flowgroup` | string | 成果物フロービューのプロセスレベル選択グループID（例: `SWE`） | グループレベル表示時は省略 |

- **ビュー切替**: `history.pushState` → ブラウザ戻る/進むが機能する
- **その他の変化**: `history.replaceState` → 細かい操作で履歴エントリを増やさない
- **初期化**: マウント時に `URLSearchParams` を解析して初期値を設定
- **popstate 対応**: `popstate` イベントで URL から状態を再読み込みする
- **lastView フォールバック**: URL に `view` パラメータが無い場合のみ `localStorage`（キー: `aspice-last-view`）の前回ビューを初期値に採用する（URL指定があれば常にURL優先）。ビュー切替時に `lastView` を保存する

---

## 2. ファイル構成

```
AutomotiveSpiceVisualizer/
├── docs/
│   ├── data_reference.md     ← aspice_models.json スキーマ説明書
│   ├── requirements.md       ← 要求仕様書（本ドキュメントと対）
│   └── design.md             ← 本ドキュメント
├── src/
│   ├── main.tsx              ← エントリポイント
│   ├── App.tsx               ← ルートコンポーネント
│   ├── index.css             ← グローバルCSS (Tailwind + React Flow)
│   ├── types/
│   │   ├── aspice.ts         ← アプリ内部型定義（コンポーネントが参照）
│   │   └── aspiceRaw.ts      ← JSON Raw型定義（aspice_models.json スキーマに忠実）
│   ├── store/
│   │   ├── languageStore.ts  ← 言語切替グローバル状態（localStorage 永続化）
│   │   └── themeStore.ts     ← テーマ切替グローバル状態（dark/light、localStorage 永続化）
│   ├── data/
│   │   ├── aspice_models.json← 唯一のデータソース（差し替えで更新）
│   │   ├── aspiceLoader.ts   ← JSON → 内部型への変換（JSON更新時の単一修正点）
│   │   ├── index.ts          ← ALL_PROCESSES / INFORMATION_ITEMS / PROCESS_GROUPS を re-export
│   │   └── processGroups.ts  ← プロセスグループUIメタ情報（12グループ）
│   ├── hooks/
│   │   └── useAppUrlState.ts ← URLクエリパラメータ ↔ アプリ状態の双方向同期フック
│   ├── utils/
│   │   ├── searchUtils.ts    ← 全文横断検索ロジック。NavigateTarget型定義
│   │   └── persistence.ts    ← localStorage 薄いラッパー（loadSetting/saveSetting/STORAGE_KEYS）
│   └── components/
│       ├── common/
│       │   ├── GroupFilterBar.tsx        ← グループフィルター（ProcessMap/Graph共用）
│       │   ├── EdgeTypeFilterBar.tsx     ← エッジ種別フィルター（Graph BP levelのみ）
│       │   └── GlobalSearch.tsx          ← グローバル検索ボックス（ヘッダー常設）
│       ├── ProcessMap/
│       │   ├── ProcessMapView.tsx  ← プロセスマップ全体レイアウト
│       │   ├── ProcessCard.tsx     ← プロセスカード1件
│       │   └── DetailPanel.tsx     ← 右側詳細パネル
│       ├── RelationshipGraph/
│       │   ├── RelationshipGraphView.tsx ← グラフビュー全体
│       │   ├── CustomNodes.tsx           ← React Flowカスタムノード（VModelViewでも再利用）
│       │   ├── graphUtils.ts             ← ノード/エッジ生成ロジック
│       │   ├── GraphExportButton.tsx     ← PNGエクスポートボタン（html-to-image使用）
│       │   ├── ProcessHoverTooltip.tsx   ← プロセスノードホバー時ツールチップ
│       │   ├── ItemDetailPanel.tsx       ← 情報項目詳細サイドパネル（情報項目起点レベル）
│       │   └── BPLevelDetailPanel.tsx    ← BP/Outcome/情報項目詳細サイドパネル（BP/情報項目レベル）
│       ├── VModelView/
│       │   ├── VModelView.tsx            ← VモデルビューReact Flowキャンバス＋詳細パネル
│       │   └── vmodelLayout.ts           ← V字固定座標・対応エッジ定義・buildVModelGraph()
│       ├── MatrixView/
│       │   ├── MatrixView.tsx            ← マトリクスビュー全体（テーブル＋フィルター）
│       │   ├── MatrixCell.tsx            ← 塗りつぶしセル（クリックでポップアップ）
│       │   └── CellDetailPopup.tsx       ← セルクリック時のポップアップ
│       └── ArtifactFlowView/
│           ├── ArtifactFlowView.tsx      ← 成果物フロービュー全体（ツールバー＋キャンバス＋詳細パネル）
│           ├── SankeyCanvas.tsx          ← カスタムSVGサンキーレンダラー（ResizeObserver対応）
│           ├── sankeyLayout.ts           ← 2カラムサンキーのノード位置・リンクパス座標計算
│           ├── sankeyData.ts             ← ALL_PROCESSES → SankeyNode/SankeyLink 変換
│           └── FlowDetailPanel.tsx       ← リンク/ノードクリック時の右側詳細パネル
├── index.html
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
└── package.json
```

### JSONデータ更新フロー

```
1. src/data/aspice_models.json を新ファイルで上書き
2. npm run type-check でエラー確認
3. スキーマ変更があれば src/types/aspiceRaw.ts と src/data/aspiceLoader.ts のみ修正
4. コンポーネント・他ファイルは変更不要
```

---

## 3. データモデル

### 3.1 型定義 (`src/types/aspice.ts`)

アプリ内部で使用する安定した型定義。JSON スキーマの変更があっても、aspiceLoader.ts を介して隔離される。

```typescript
type Language = 'en' | 'ja'
interface BilingualText { en: string; ja: string }
type ProcessGroup = 'SYS' | 'SWE' | 'HWE' | 'VAL' | 'MLE' | 'MAN' | 'SUP' | 'PIM' | 'ACQ' | 'SPL' | 'REU' | 'SEC'

interface Note { id: number; text: BilingualText }
interface Outcome { id: number; text: BilingualText }
interface BasePractice {
  id: string; name: BilingualText; description: BilingualText
  notes: Note[]; outcome_refs: number[]
}
interface ProcessOutputItem { id: string; outcome_refs: number[] }
interface Characteristic { type: 'bullet' | 'category' | 'note'; en: string; ja?: string }
interface InformationItem { id: string; name: BilingualText; description?: BilingualText; characteristics: Characteristic[] }

interface Process {
  id: string; name: BilingualText; group: ProcessGroup; purpose: BilingualText
  outcomes: Outcome[]; base_practices: BasePractice[]
  output_information_items: ProcessOutputItem[]
}
interface ProcessGroup_Meta { id: ProcessGroup; name: BilingualText; color: string; textColor: string; borderColor: string }

// 能力次元（型定義のみ — UI未実装、将来の拡張候補）
interface CapabilityLevel { level: number; name?: BilingualText; process_attributes: ProcessAttribute[] }
```

### 3.2 情報項目IDの命名規則

| パターン | 意味 | 例 |
|---|---|---|
| `NN-NN`（数字-数字） | ASPICE標準情報項目ID（Annex B） | `17-08`, `04-06` |

### 3.3 Characteristic の種別

| type | 意味 | 表示 |
|---|---|---|
| `bullet` | 箇条書き項目（`\n-` でサブ項目を含む場合あり） | `•` 表示、サブ項目はインデント |
| `category` | セクション見出し（後続のbulletを分類） | bold 小見出し |
| `note` | 備考（NOTE: で始まる補足説明） | italic / 灰色 |

---

## 4. コンポーネント設計

### 4.1 App.tsx

**責務:** ビュー切替・言語切替のルートコントローラー

```
状態:
  view: 'map' | 'graph' | 'vmodel' | 'matrix' （初期値: 'map'）
  lang: Language                    （useLang() フック経由）
  pendingNav: NavigateTarget | null  （グローバル検索からのジャンプ先、消費後null）

レンダリング:
  <header>  ← ASPICE 4.0バッジ / ビュータブ（4タブ）/ GlobalSearch / EN/JAトグル
  <main>
    view==='map'    → <ProcessMapView lang navigateTo={pendingNav} onNavConsumed />
    view==='graph'  → <RelationshipGraphView lang navigateTo={pendingNav} onNavConsumed />
    view==='vmodel' → <VModelView lang navigateTo={pendingNav} onNavConsumed />
    view==='matrix' → <MatrixView lang onNavigate={handleNavigate} />

handleNavigate(target):
  target.type==='process' → setView('map'), setPendingNav(target)
  target.type==='bp'|'item' → setView('graph'), setPendingNav(target)
```

### 4.2 ProcessMapView

**責務:** プロセスグループ×プロセスのタイルグリッド表示と詳細パネル管理

```
状態:
  selected: Process | null
  activeGroups: Set<ProcessGroup>  （初期: 全8グループ）
  highlightProcessId: string | null （検索ジャンプ時の一時ハイライト対象。2秒後自動null）

レンダリング:
  <GroupFilterBar>（上部）
  左ペイン（flex-1）: activeGroupsでフィルタしたグループのみ表示
                       → ProcessCard × n（highlightProcessId === p.id の場合 isHighlighted=true）
  右ペイン（w-420px）: selected !== null → <DetailPanel onSelectProcess>

副作用:
  activeGroupsから除外されたグループに属するselectedプロセスはnullリセット
  navigateTo（FR-5ジャンプ）受信時: 対象プロセスをselected+highlightに設定し2秒後ハイライト解除
```

### 4.3 ProcessCard

**責務:** 1プロセスのカードUI（選択状態・ハイライト状態・グループ色反映）

```
Props: { process, groupMeta, isSelected, isHighlighted?, lang, onClick }
// isHighlighted: true のとき黄色リング（ring-2 ring-yellow-400）を表示
```

### 4.4 DetailPanel

**責務:** 選択プロセスの詳細表示（折りたたみセクション構成）

```
Props: { process, groupMeta, lang, onClose, onSelectProcess? }

セクション構成:
  1. Purpose（プロセス目的）
  2. Outcomes（プロセス成果）  ← outcome.id + description
  3. Base Practices            ← bp.id + name + description
                                  + supportsOutcomes バッジ
                                  + inputs/outputs 情報項目ID
  4. Output Information Items  ← item.id + name + characteristics
  5. Related Processes（関連プロセス） ← 共通情報項目IDを持つ他プロセス一覧
     - 共通情報項目IDバッジを折りたたみ表示
     - 項目クリック → onSelectProcess(p) で該当プロセスの詳細パネルに遷移
     - デフォルト閉じた状態（defaultOpen=false）
     - 関連プロセスが0件の場合は非表示
```

### 4.5 RelationshipGraphView

**責務:** グラフレベル切替UIとReact Flowキャンバス管理

```
状態:
  level: 'process' | 'bp' | 'item'
  focusProcess: Process | null
  focusItemId: string | null
  activeGroups: Set<ProcessGroup>   （初期: 全12グループ）
  activeEdgeTypes: Set<EdgeType>    （初期: supports / produces）

ロジック:
  level==='process'              → buildProcessLevelGraph(ALL_PROCESSES, lang, activeGroups)
  level==='bp' && focusProcess   → buildDetailLevelGraph(focusProcess, lang, activeEdgeTypes)
  level==='item' && focusItemId  → buildItemFocusGraph(focusItemId, ALL_PROCESSES, lang)
  level==='item' && !focusItemId → buildItemLevelGraph(ALL_PROCESSES, lang)
  nodes/edgesはuseMemoで導出し、ReactFlowのcontrolled propsとして渡す
  （useNodesState/useEdgesStateは使用しない）

イベント:
  onNodeClick (level==='process')            → focusProcess=クリックプロセス, level='bp' に切替
  onNodeClick (level==='bp', bpNode)         → selectedBPNode={ type:'bp', bp, process }
  onNodeClick (level==='bp', outcomeNode)    → selectedBPNode={ type:'outcome', outcome, process }
  onNodeClick (level==='bp', itemNode)       → selectedBPNode={ type:'item', item }
  onNodeClick (level==='item', !focusItemId) → focusItemId=クリック情報項目ID に設定
  「戻る」ボタン（BP level）  → level='process', focusProcess=null, selectedBPNode=null
  「戻る」ボタン（item level） → focusItemId=null（情報項目一覧に戻る）
  onNodeMouseEnter (level==='bp' || level==='item')        → 接続ノード・エッジを強調（hoveredNodeId）
  onNodeMouseEnter (level==='process', processNode) → <ProcessHoverTooltip> 表示
    ツールチップデータ: node.data.purpose（先頭1文）/ node.data.outcomeCount / node.data.bpCount

レンダリング:
  <GroupFilterBar>    （level==='process' 時のみ、上部）
  ツールバー: レベルタブ（3タブ）/ <GraphExportButton>（常時）
             / フォーカスプロセスバッジ（level==='bp' 時）
             / フォーカス情報項目バッジ（level==='item' && focusItemId 時）
             / <EdgeTypeFilterBar>（level==='bp' 時のみ）
  <div ref=graphContainerRef>
    <ReactFlow>
  </div>
  <BPLevelDetailPanel> （level==='bp' && selectedBPNode !== null 時、グラフ右側）
  <ItemDetailPanel>    （level==='item' && focusItem !== null 時、グラフ右側）
  <ProcessHoverTooltip> （tooltipInfo !== null 時、position: fixed、マウス座標+16px）
```

### 4.6 CustomNodes（React Flowカスタムノード）

| コンポーネント | ノード種別 | 用途 |
|---|---|---|
| `GroupNode` | groupNode | プロセス群コンテナ（枠＋ラベル）。プロセスレベルのみ使用 |
| `ProcessNode` | processNode | プロセスノード（グループ色）。プロセスレベルでは `parentId` を持ち GroupNode の子として配置。`data.purpose`（目的先頭1文）/ `data.outcomeCount` / `data.bpCount` をホバーツールチップ用に保持 |
| `OutcomeNode` | outcomeNode | プロセス成果ノード（インジゴ） |
| `BPNode` | bpNode | 基本プラクティスノード（グループ色薄め） |
| `ItemNode` | itemNode | 情報項目ノード（出力=緑 / 入力=青） |

#### GroupNode の仕様

```
Props（data）: { label: string; color: string; borderColor: string }
// label  : グループ名（例 "SYS システムエンジニアリング"）
// color  : グループ背景色（半透明）
// borderColor: グループ枠線色

React Flow Node プロパティ:
  type: 'groupNode'
  style.width / style.height : コンテナサイズ（コンテンツに合わせて固定値）
  // 子ノードは position を GroupNode 内ローカル座標で指定
  // extent: 'parent' を子ノードに設定してコンテナ外にドラッグ不可とする
```

### 4.7 graphUtils.ts

**責務:** ReactFlow用ノード/エッジ配列の生成

```typescript
// 可変ノード（outcomeNode / bpNode / itemNode）の描画サイズ推定（内部純関数）
estimateNodeSize(type, labelText, bodyText) → { width, height }
  // CustomNodes.tsx の実 CSS（min-w / max-w / px-3 py-2 / text-xs / leading-tight / 2段組）に基づき、
  // measurePx（Canvas計測）で label 幅・body 幅を算出し、折返し行数から高さを決定する。
  // 結果は各ノードの data._size および style.width として付与され、
  // nodeSizeForLayout ヘルパー経由で applyDagreLayout に渡される。

// Dagreレイアウト適用（内部ユーティリティ）
applyDagreLayout(nodes, edges, options: { rankdir, ranksep, nodesep })
  → Node[]  // position を Dagre 計算値で上書きして返す
  // 各ノードの data._size（estimateNodeSize の推定値）を nodeSizeForLayout ヘルパー経由で優先参照する。
  // processNode 等 _size を持たないノードのみ固定テーブル NODE_SIZE にフォールバックする。

// プロセスレベルグラフ生成
buildProcessLevelGraph(processes: Process[], lang: Language, activeGroups: Set<ProcessGroup>)
  → { nodes: Node[], edges: Edge[] }
  // activeGroupsでフィルタしたグループのみ GroupNode（コンテナ）を生成
  // 各プロセスノードは対応する GroupNode の子（parentId 設定、extent: 'parent'）
  // エッジなし（ASPICE 4.0 はプロセス間の明示的接続を持たない）
  // レイアウト: Dagre 自動配置ではなく、ASPICE 4.0 プロセスアーキテクチャ図に
  //   準拠した固定座標（GROUP_LAYOUT_CONFIG）で GroupNode を配置し、
  //   各プロセスは GroupNode 内ローカル座標（PROCESS_POSITIONS）で配置
  //
  // GROUP_LAYOUT_CONFIG（グループコンテナの絶対座標・サイズ）:
  //   各グループに x, y, width, height を固定値で定義
  //   画像の空間配置に対応:
  //     SUP  : 左列
  //     SYS  : 上段中央
  //     VAL  : 上段右寄り（SYSの右隣）
  //     MAN  : 右列
  //     SWE  : 中段左寄り
  //     HWE  : 中段右寄り
  //     ACQ  : 下段左
  //     SEC  : 下段中央左
  //     MLE  : 下段中央右
  //     PIM  : 下段右
  //     REU  : 下段右（PIMの下）
  //     SPL  : 下段右（REUの下）
  //
  // PROCESS_POSITIONS（各プロセスのコンテナ内相対座標）:
  //   プロセスIDをキーに { x, y } を固定値で定義
  //   各グループ内でのプロセス配置も画像の並びに準拠

// BP/情報項目レベルグラフ生成（単一プロセス）
buildDetailLevelGraph(process: Process, lang: Language, activeEdgeTypes: Set<EdgeType>)
  → { nodes: Node[], edges: Edge[] }
  // ノード: Process(root) / Outcome×n / BP×n（supports ON時）/ Item×n（produces ON時）
  // エッジ: BP→Outcome(supports, bp.outcome_refs) / Outcome→Item(produces, output_information_items[].outcome_refs)
  // outcome / bp / item 各ノードに estimateNodeSize 推定値を style.width と data._size として付与
  // Dagre rankdir:LR で自動レイアウト（ノード間隔は推定サイズに基づき確保）

// 情報項目一覧グラフ生成（情報項目起点レベルの初期画面）
buildItemLevelGraph(processes: Process[], lang: Language)
  → { nodes: Node[], edges: Edge[] }
  // 全プロセスの output_information_items から情報項目IDを収集（重複排除）
  // 各情報項目を itemNode としてエッジなしで配置
  // クリックで buildItemFocusGraph へ遷移
  // レイアウト: XX-YY 形式の ID を XX プレフィックスでグループ化して列配置（固定列グリッド）。
  //   各ノードの高さは estimateNodeSize（measurePx Canvas計測）で推定し、列内 y を累積して行方向に積む。
  //   列幅は列内ノードの最大推定幅に合わせる可変方式。Dagre は使用しない。

// 情報項目起点グラフ生成（選択した情報項目の生成元を逆引き）
buildItemFocusGraph(itemId: string, processes: Process[], lang: Language)
  → { nodes: Node[], edges: Edge[] }
  // 右端: 選択情報項目ノード（itemNode）
  // 中央: その情報項目を生成するOutcomeノード（`oc-${process.id}-${oc.id}` でグローバル一意）
  // 左端: Outcomeを持つプロセスノード（プロセスグループ色）
  // エッジ: Process → Outcome（無色実線）/ Outcome → 情報項目（produces、緑実線）
  // 複数プロセスが同じ情報項目を出力する場合はすべて展開
  // outcome ノードに estimateNodeSize 推定値を style.width と data._size として付与
  // Dagre rankdir:LR で自動レイアウト（ノード間隔は推定サイズに基づき確保）
```

### 4.7b BPLevelDetailPanel

**責務:** BP/情報項目レベルでノードをクリックした際に表示する右側詳細パネル

```typescript
export type SelectedBPNode =
  | { type: 'bp'; bp: BasePractice; process: Process }
  | { type: 'outcome'; outcome: Outcome; process: Process }
  | { type: 'item'; item: InformationItem }

Props: { selected: SelectedBPNode; groupMeta: ProcessGroup_Meta; lang: Language; onClose: () => void }
```

表示内容:
- `type === 'bp'`    : BP ID（グループ色）/ 名称 / 説明 / 達成する成果 / ノート
- `type === 'outcome'`: 成果ID（インジゴ）/ テキスト / 達成するBP一覧 / 生成する情報項目一覧
- `type === 'item'`  : 情報項目ID（エメラルド）/ 名称 / 説明 / 特性リスト

### 4.8 VModelView（FR-6）

**責務:** SYS/SWE/HWEのプロセスをV字に固定配置し、対応関係を点線で示すReact Flowビュー

```
状態:
  selectedProcess: Process | null   （クリックで選択されたプロセス）

ロジック:
  nodes/edges は buildVModelGraph(lang) で生成（useMemo）
  nodesDraggable=false / nodesConnectable=false でインタラクションを読み取り専用に固定

レンダリング:
  左ペイン（flex-1）:
    <ReactFlow fitView>
      <Background> / <Controls> / <MiniMap>
      <Panel position="top-left">   ← "← 仕様・設計フェーズ" ラベル
      <Panel position="top-center"> ← "Vモデル（SYS / SWE / HWE）" タイトル
      <Panel position="top-right">  ← "統合・検証フェーズ →" ラベル
  右ペイン（w-80, selectedProcess !== null 時）:
    <DetailPanel onSelectProcess={p => VMODEL_PROCESS_IDS.has(p.id) ? setSelected(p) : no-op}>
    ※ Vモデルに含まれないプロセスへのナビゲーションは無視する

副作用:
  navigateTo（FR-5ジャンプ）受信時:
    processId が VMODEL_PROCESS_IDS に含まれる場合のみ selectedProcess を更新
    onNavConsumed() を呼び出す
```

#### vmodelLayout.ts の設計

```typescript
// V字左辺（上→下）: SYS.1, SYS.2, SYS.3, SWE.1, SWE.2, SWE.3, HWE.1, HWE.2
// V字右辺（下→上）: HWE.3, HWE.4, SWE.4, SWE.5, SWE.6, SYS.4, SYS.5
// VAL.1: x=920, y=0（SYS.5 と同じ高さ）

// 固定座標
LEFT_X = 60  // 左辺ノードの x
RIGHT_X = 700 // 右辺ノードの x
STEP_Y = 120  // ノード間隔（左辺は 0, 120, 240, … で均等配置）

// 右辺 Y = maxY × (total - 1 - index) / (total - 1)
// → 配列先頭(HWE.3)が最下部(y=840)、末尾(SYS.5)が最上部(y=0)

// 対応線: type:'straight', stroke:'#6b7280', strokeDasharray:'4 4'
// ProcessNode を再利用（RelationshipGraph/CustomNodes.tsx）
export const VMODEL_PROCESS_IDS: Set<string>  // ナビゲーション可否判定に使用
```

### 4.9 GroupFilterBar（共通コンポーネント）

**責務:** プロセスグループの表示絞り込みトグルUI

```typescript
Props: { selected: Set<ProcessGroup>; lang: Language; onChange: (next: Set<ProcessGroup>) => void }
// 「All」ボタン + グループごとのチップ
// 最低1グループ選択を強制（最後の1つは削除不可）
// ProcessMapView / RelationshipGraphView（process level）で共用
```

### 4.12 GlobalSearch（共通コンポーネント）

**責務:** ヘッダー常設の横断検索ボックスと結果ドロップダウン

```typescript
Props: { lang: Language; onNavigate: (target: NavigateTarget) => void }

状態:
  query: string          // 入力テキスト
  results: SearchResult[]// デバウンス200ms後の検索結果
  open: boolean          // ドロップダウン表示フラグ

挙動:
  - 結果をカテゴリ別（process / bp / item）にグルーピング表示
  - 結果クリック → onNavigate(target) を呼び、query/open をリセット
  - ESC / 外部クリックでドロップダウンを閉じる
  - 結果20件上限に達した場合は注記を表示
```

### 4.13 searchUtils.ts（ユーティリティ）

**責務:** 全データを横断する検索ロジックと NavigateTarget 型定義

```typescript
// 検索結果の型
type SearchResultType = 'process' | 'bp' | 'item'

interface SearchResult {
  type: SearchResultType
  id: string           // プロセスID / BP ID / 情報項目ID
  label: string        // 表示名（"{id} {name}"形式）
  sublabel: string     // 所属情報（グループ名 / 親プロセスID）
  processId?: string   // type='bp' の場合の親プロセスID
}

// ナビゲーション先の型（App.tsx と各ビューが共用）
type NavigateTarget =
  | { type: 'process'; processId: string }
  | { type: 'bp'; processId: string; bpId: string }
  | { type: 'item'; itemId: string }

// 検索実行（EN+JA両方の全フィールドにマッチ、最大20件）
function search(query: string, lang: Language): SearchResult[]
```

### 4.9 MatrixView（FR-7）

**責務:** プロセス（行）×情報項目（列）のクロスリファレンスマトリクス表示

```
状態:
  selectedGroups: Set<ProcessGroup>  （初期: 全12グループ）
  popup: { process, item } | null    （セルクリック時のポップアップ対象）
  isDragging: boolean                （マウスドラッグによるスクロール中フラグ。カーソル表示切替用）

ref:
  scrollRef  : スクロールコンテナ <div> への参照
  dragState  : { active, moved, startX/Y, startLeft/Top } ドラッグ開始位置とスクロール量を保持

データ計算（useMemo）:
  allItemIds    : ALL_PROCESSES から収集した全情報項目ID（昇順・重複排除）
  itemMap       : 情報項目IDをキーとした InformationItem マップ
  columnGroups  : 情報項目IDの先頭部分（XX）でグループ化した列グループ配列
  filteredGroupedProcesses : selectedGroups でフィルタし PROCESS_GROUPS 順に並べたグループ+プロセス配列
  outputSets    : processId → Set<itemId> のマップ（セル塗りつぶし判定を O(1) に最適化）

テーブル構造:
  <div overflow-auto cursor-grab/grabbing> (スクロールコンテナ。マウスドラッグでスクロール可能)
    <table>
      <thead>
        <tr>  ← 列グループ見出し行 (sticky top-0 z-20)
          <th rowSpan={2} sticky left-0 top-0 z-30>プロセス</th>
          <th colSpan={n}>XX</th> × グループ数
        <tr>  ← 情報項目ID行 (sticky top-6 z-20)
          <th sticky top>17-01 (縦書き)</th> × 情報項目数
      <tbody>
        <tr>  ← グループヘッダー行（グループ色で着色）
          <td colSpan={全列数}>SYS — System Engineering</td>
        <tr>  ← プロセス行
          <td sticky left-0 z-10>SYS.1 プロセス名</td>  ← 行ヘッダー（グループ色）
          <MatrixCell filled={outputSets[p.id].has(id)}>  × 情報項目数

イベント:
  列ヘッダー（情報項目ID）クリック → onNavigate({ type:'item', itemId }) → グラフビューに遷移
  塗りつぶしセルクリック          → popup を設定（CellDetailPopup を表示）
  スクロールコンテナ上でマウスドラッグ → scrollLeft/scrollTop を更新（パン操作）
    閾値（4px）を超えて動いた場合は onClickCapture で直後のクリックを抑制し、
    意図しないセル選択・列遷移を防止する
```

### 4.9a MatrixCell

**責務:** マトリクスの1セルUI

```typescript
Props: { process: Process; item: InformationItem; filled: boolean; onClick: (p, i) => void }
// filled=true: 青色の塗りつぶし（bg-blue-600 + 内部ドット）、クリック可能
// filled=false: 空のセル（border のみ）
```

### 4.9b CellDetailPopup

**責務:** マトリクスセルクリック時に表示するモーダルポップアップ

```typescript
Props: { process: Process; item: InformationItem; lang: Language; onClose: () => void }

表示内容:
  ヘッダー: グループバッジ / プロセスID / プロセス名 / Xボタン
  プロセス目的
  アウトプット情報項目: 情報項目ID / 名称 / 説明 / 特性リスト
  関連プロセス成果: output_information_items から outcome_refs を逆引きして表示
```

### 4.11 EdgeTypeFilterBar（共通コンポーネント）

**責務:** エッジ種別の表示絞り込みトグルUI

```typescript
export type EdgeType = 'supports' | 'produces'
Props: { selected: Set<EdgeType>; lang: Language; onChange: (next: Set<EdgeType>) => void }
// supports（indigo）/ produces（green）の2種チップ
// 最低1種別選択を強制
// RelationshipGraphView の level==='bp' 時のみ使用
```

---

## 5. グローバル状態・永続化設計

### 5.1 言語切替 (`src/store/languageStore.ts`)

- モジュールスコープの `currentLang` 変数と `listeners` セットによるシンプルなパブサブ実装
- `useLang()`: `[lang, toggleFn]` を返す React フック。トグル時に全リスナーを呼び出し全コンポーネントを再レンダリング
- `t(text: BilingualText, lang: Language)`: 言語に応じたテキストを返すユーティリティ関数
- 初期値は `localStorage`（キー: `aspice-lang`）から復元。トグル時に保存

### 5.2 テーマ切替 (`src/store/themeStore.ts`)

- `languageStore.ts` と同型のモジュールスコープシングルトン＋パブサブ実装
- `useTheme()`: `[theme, toggleFn]` を返す React フック（`theme: 'dark' | 'light'`）
- 初期値の決定順: `localStorage`（キー: `aspice-theme`）→ `matchMedia('(prefers-color-scheme: light)')` → `'dark'`
- テーマ適用: `document.documentElement.classList.toggle('light', theme === 'light')`（ライト時のみ `.light` を付与）
- Phase 2（テーマトークン化）で `.light` クラスに対する CSS 変数が定義される予定。Phase 1 時点では DOM クラスの付け外しのみで見た目は変化しない

### 5.3 localStorage ラッパー (`src/utils/persistence.ts`)

```typescript
export const STORAGE_KEYS = {
  lang: 'aspice-lang',
  theme: 'aspice-theme',
  lastView: 'aspice-last-view',
}
// loadSetting<T>(key, fallback): try/catch で localStorage 不可環境を握りつぶす
// saveSetting(key, value): JSON.stringify してセット
```

---

## 6. スタイル設計

### 6.1 テーマシステム（v3.0 Phase 2）

v3.0 Phase 2 からすべての色は **CSS カスタムプロパティ（CSS 変数）** を経由したセマンティックトークンで管理する。Tailwind CSS の `theme.extend.colors` に `rgb(var(--token) / <alpha-value>)` 形式で登録し、`bg-bg` / `text-content` 等のユーティリティクラスとして利用する。

#### セマンティックトークン一覧

| トークン | Tailwind クラス例 | ダーク値 (RGB) | ライト値 (RGB) |
|---|---|---|---|
| `--color-bg` | `bg-bg` | 3 7 18 | 255 255 255 |
| `--color-surface` | `bg-surface` | 17 24 39 | 249 250 251 |
| `--color-surface-2` | `bg-surface-2` | 31 41 55 | 243 244 246 |
| `--color-line` | `border-line` | 55 65 81 | 209 213 219 |
| `--color-line-subtle` | `border-line-subtle` | 31 41 55 | 229 231 235 |
| `--color-content` | `text-content` | 243 244 246 | 17 24 39 |
| `--color-content-2` | `text-content-2` | 209 213 219 | 55 65 81 |
| `--color-content-muted` | `text-content-muted` | 107 114 128 | 107 114 128 |
| `--color-accent` | `text-accent` | 96 165 250 | 37 99 235 |
| `--color-accent-bg` | `bg-accent-bg` | 23 37 84 | 219 234 254 |
| `--color-outcome` | `text-outcome` | 129 140 248 | 79 70 229 |
| `--color-outcome-bg` | `bg-outcome-bg` | 30 27 75 | 224 231 255 |
| `--color-item` | `text-item` | 52 211 153 | 5 150 105 |
| `--color-item-bg` | `bg-item-bg` | 6 78 59 | 209 250 229 |
| `--color-bp` | `text-bp` | 167 139 250 | 124 58 237 |

`--color-outcome` / `--color-item` / `--color-bp` は「プロセス成果（indigo）・情報項目（emerald）・基本プラクティス（violet）」を表すエンティティアクセントトークン。入力系の情報項目には青系の `--color-accent` / `--color-accent-bg` を流用する。これらは詳細パネルのヘッダー、グラフのノード/エッジラベル、検索カテゴリ見出し、エッジ種別フィルター等で使用し、indigo/emerald 等の固定 Tailwind クラスのハードコードは廃止した。

テーマの切替は `src/store/themeStore.ts` が `<html>` 要素に `.light` クラスを付与/除去することで実現する。CSS は `:root { ... }` をダーク既定、`:root.light { ... }` でライト上書き値を定義する。

#### インラインスタイル用ヘルパー（React Flow など）

React Flow のノード/エッジは Tailwind クラスが使えないため、`src/utils/themeColors.ts` のヘルパーで実行時に CSS 変数を読み取る。

```typescript
// CSS 変数値を rgb() 文字列で返す
cssVar('--color-bg')          // → 'rgb(3 7 18)' (dark) or 'rgb(255 255 255)' (light)

// グループトークン（surface / line / text）を読み取る
groupColorHex('SYS', 'surface')  // → 'rgb(30 58 138)' (dark)
```

テーマ切替時にグラフ/サンキー図が更新されるよう、`RelationshipGraphView`・`VModelView`・`ArtifactFlowView` の `useMemo` 依存配列に `theme`（`useTheme()` 第1要素）を含める。

### 6.2 グループカラートークン

各グループの色は CSS 変数 `--grp-<id>-surface / line / text` の 3 種×12 グループで管理し、ダーク/ライト両値を定義する。グループ色は React Flow のノードに加え、React コンポーネント（`ProcessCard`・`DetailPanel`・`BPLevelDetailPanel`・`GroupFilterBar`・`MatrixView`・`ProcessMapView` 等）でも `groupColorHex(group, role)` ヘルパーによるインライン `style` で適用する（Tailwind の動的クラス連結 `hover:${...}` は JIT に解決されないため使用しない）。ライトモードでは淡色 surface + 濃色 text となり、ダーク前提の固定 Tailwind クラス（`bg-blue-900` / `text-blue-200` 等）のハードコードは廃止した。

| グループ | ダーク surface → line → text | ライト surface → line → text |
|---|---|---|
| SYS | blue-950→blue-700→blue-300 | blue-100→blue-500→blue-800 |
| SWE | violet-950→violet-700→violet-300 | violet-100→violet-500→violet-800 |
| HWE | cyan-950→cyan-700→cyan-300 | cyan-100→cyan-500→cyan-800 |
| VAL | lime-950→lime-700→lime-300 | lime-100→lime-600→lime-800 |
| MLE | purple-950→purple-700→purple-300 | purple-100→purple-500→purple-800 |
| MAN | amber-950→amber-700→amber-300 | amber-100→amber-600→amber-800 |
| SUP | green-950→green-700→green-300 | green-100→green-600→green-800 |
| PIM | yellow-950→yellow-700→yellow-300 | yellow-100→yellow-600→yellow-800 |
| ACQ | orange-950→orange-700→orange-300 | orange-100→orange-600→orange-800 |
| SPL | rose-950→rose-700→rose-300 | rose-100→rose-500→rose-800 |
| REU | teal-950→teal-700→teal-300 | teal-100→teal-600→teal-800 |
| SEC | red-950→red-700→red-300 | red-100→red-500→red-800 |

### 6.3 グラフノードカラー（React Flow）

グループカラーはすべて `groupColorHex(group, role)` ヘルパー経由で取得し、ハードコードは廃止した。

| ノード種別 | 背景 | ボーダー |
|---|---|---|
| GroupNode | `groupColorHex(group, 'surface')` + 透過 | `groupColorHex(group, 'line')` |
| ProcessNode | `groupColorHex(group, 'surface')` | `groupColorHex(group, 'line')` |
| OutcomeNode | `bg-outcome-bg` / `cssVar('--color-outcome')` | `cssVar('--color-outcome')` |
| BPNode | `groupColorHex(group, 'surface')` | `groupColorHex(group, 'line')` |
| ItemNode（出力） | `cssVar('--color-item-bg')` | `cssVar('--color-item')` |
| ItemNode（入力） | `cssVar('--color-accent-bg')` | `cssVar('--color-accent')` |

### 6.4 グラフエッジ・背景カラー

| 要素 | 色 |
|---|---|
| BP → Outcome エッジ線 | #6366f1 (indigo-500)（固定・両モードで可視） |
| Outcome → Item エッジ線 | #22c55e (green-500)（固定・両モードで可視） |
| supports ラベル文字 | `cssVar('--color-outcome')` |
| produces ラベル文字 | `cssVar('--color-item')` |
| エッジラベル背景 | `cssVar('--color-bg')` |
| ReactFlow Background | `cssVar('--color-line')` |
| ReactFlow MiniMap 背景 | `cssVar('--color-bg')` |
| Vモデル対応線 | `cssVar('--color-line')` |

### 4.10 ArtifactFlowView（FR-8）

**責務:** プロセスグループが出力する情報項目の全体分布をサンキー図で可視化

```
状態:
  selectedGroup: ProcessGroup | null  （null = グループレベル、非null = プロセスレベル）
  selection: FlowSelection | null     （クリックされたリンク or ノードの詳細表示対象）

データ計算（useMemo）:
  selectedGroup === null  → buildGroupSankeyData(ALL_PROCESSES, lang)
  selectedGroup !== null  → buildProcessSankeyData(ALL_PROCESSES, selectedGroup, lang)

ツールバー:
  グループレベル: "プロセスグループ → 情報項目カテゴリ" ラベル + 帯幅説明
  プロセスレベル: "← グループビューに戻る" ボタン + 選択グループバッジ

レンダリング:
  左ペイン（flex-1）:
    <SankeyCanvas nodes links onNodeClick onLinkClick>
  右ペイン（w-80、selection !== null 時）:
    <FlowDetailPanel selection onClose onNavigate>

URL同期:
  onFlowStateChange(group) → App.tsx の setFlowState(group) → replaceState で ?flowgroup=XX に反映
  初期値は initialFlowGroup prop（App.tsx が url.flowGroup を渡す）
```

#### sankeyData.ts

```typescript
interface SankeyNode { id: string; label: string; value: number; color: string; side: 'left'|'right' }
interface SankeyLink { sourceId: string; targetId: string; value: number; itemIds: string[] }

buildGroupSankeyData(processes, lang)
// 左: PROCESS_GROUPS（出力0件は除外）、右: 情報項目 ID プレフィックス（01〜19）
// リンク: group × prefix ペアで情報項目数を集計

buildProcessSankeyData(processes, group, lang)
// 左: 選択グループの個別プロセス、右: 個別情報項目 ID
// リンク: process → item, value = 1
```

#### sankeyLayout.ts

```typescript
computeSankeyLayout(nodes, links, canvasWidth, canvasHeight)
// → { layoutNodes: LayoutNode[], layoutLinks: LayoutLink[] }
// 各ノード高さ = (value / 総値) × 有効高さ（最小 4px）
// 右ノードは dominant source 順にソート
// リンクの帯: ノード内の累積オフセットで位置を決定
// 左右ノードは LEFT_LABEL_MARGIN / RIGHT_LABEL_MARGIN（各200px）分内側に配置し、
// ノード外側に描画するラベルが画面端で切れないよう余白を確保

bandPath(x0, sy0, sy1, x1, ty0, ty1): string
// SVG cubic bezier パス文字列（帯の上辺と下辺）を返す
```

#### SankeyCanvas.tsx

- `ResizeObserver` でコンテナサイズを監視し、SVG を全幅全高に合わせる
- ホバー時: 関連ノード・リンクを強調、非関連要素は opacity 低下
- ノードラベルはノード外側（左ノード=左、右ノード=右）に配置。トランケート幅は `LEFT_LABEL_MARGIN` / `RIGHT_LABEL_MARGIN` に連動し、確保した余白内に収める

---

## 7. 今後の機能追加時の設計方針

### 7.1 新ビュー追加

1. `src/components/<ViewName>/` にコンポーネントを追加
2. `App.tsx` の `ViewId` 型と `VIEWS` 配列に追加
3. `<main>` の条件レンダリングに追加
4. `docs/requirements.md` § 2 に機能要件追加、`docs/design.md` § 4 にコンポーネント設計追加

### 7.2 プロセスデータ更新

1. `src/data/aspice_models.json` を新ファイルで上書き
2. `npm run type-check` を実行しエラーを確認
3. スキーマ変更がある場合のみ `src/types/aspiceRaw.ts` と `src/data/aspiceLoader.ts` を修正
4. `docs/requirements.md` § 4.1 の件数を更新

### 7.3 データモデル変更

1. `src/types/aspice.ts`（内部型）を変更
2. 影響するコンポーネントを更新
3. `docs/design.md` § 3 のデータモデルを更新
