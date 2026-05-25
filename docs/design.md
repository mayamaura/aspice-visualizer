# ソフトウェア設計書

**プロジェクト名:** Automotive SPICE 4.0 Process Visualizer  
**バージョン:** 2.0  
**最終更新:** 2026-05-26  

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
ブラウザ (SPA)
├── App.tsx                   ← ルートコンポーネント（ビュー切替・言語切替）
├── views/
│   ├── ProcessMapView        ← プロセスマップビュー
│   ├── RelationshipGraphView ← リレーションシップグラフビュー
│   └── VModelView            ← Vモデルビュー（SYS/SWE/HWE V字配置）
├── data/                     ← 静的プロセスデータ（TypeScript）
├── types/                    ← 型定義
└── store/                    ← グローバル状態（言語）
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

言語状態は `src/store/languageStore.ts` のモジュールレベルシングルトンで管理し、`useLang()` フックで各コンポーネントが購読する。

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
│   │   └── languageStore.ts  ← 言語切替グローバル状態
│   ├── data/
│   │   ├── aspice_models.json← 唯一のデータソース（差し替えで更新）
│   │   ├── aspiceLoader.ts   ← JSON → 内部型への変換（JSON更新時の単一修正点）
│   │   ├── index.ts          ← ALL_PROCESSES / INFORMATION_ITEMS / PROCESS_GROUPS を re-export
│   │   └── processGroups.ts  ← プロセスグループUIメタ情報（12グループ）
│   ├── utils/
│   │   └── searchUtils.ts    ← 全文横断検索ロジック。NavigateTarget型定義
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
│       └── VModelView/
│           ├── VModelView.tsx            ← VモデルビューReact Flowキャンバス＋詳細パネル
│           └── vmodelLayout.ts           ← V字固定座標・対応エッジ定義・buildVModelGraph()
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
  view: 'map' | 'graph' | 'vmodel' （初期値: 'map'）
  lang: Language                    （useLang() フック経由）
  pendingNav: NavigateTarget | null  （グローバル検索からのジャンプ先、消費後null）

レンダリング:
  <header>  ← ASPICE 4.0バッジ / ビュータブ（3タブ）/ GlobalSearch / EN/JAトグル
  <main>
    view==='map'    → <ProcessMapView lang navigateTo={pendingNav} onNavConsumed />
    view==='graph'  → <RelationshipGraphView lang navigateTo={pendingNav} onNavConsumed />
    view==='vmodel' → <VModelView lang navigateTo={pendingNav} onNavConsumed />

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
// Dagreレイアウト適用（内部ユーティリティ）
applyDagreLayout(nodes, edges, options: { rankdir, ranksep, nodesep })
  → Node[]  // position を Dagre 計算値で上書きして返す

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
  // Dagre rankdir:LR で自動レイアウト

// 情報項目一覧グラフ生成（情報項目起点レベルの初期画面）
buildItemLevelGraph(processes: Process[], lang: Language)
  → { nodes: Node[], edges: Edge[] }
  // 全プロセスの output_information_items から情報項目IDを収集（重複排除）
  // 各情報項目を itemNode としてエッジなしで配置
  // クリックで buildItemFocusGraph へ遷移
  // Dagre rankdir:LR で自動レイアウト

// 情報項目起点グラフ生成（選択した情報項目の生成元を逆引き）
buildItemFocusGraph(itemId: string, processes: Process[], lang: Language)
  → { nodes: Node[], edges: Edge[] }
  // 右端: 選択情報項目ノード（itemNode）
  // 中央: その情報項目を生成するOutcomeノード（`oc-${process.id}-${oc.id}` でグローバル一意）
  // 左端: Outcomeを持つプロセスノード（プロセスグループ色）
  // エッジ: Process → Outcome（無色実線）/ Outcome → 情報項目（produces、緑実線）
  // 複数プロセスが同じ情報項目を出力する場合はすべて展開
  // Dagre rankdir:LR で自動レイアウト
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

### 4.10 GlobalSearch（共通コンポーネント）  <!-- 旧4.10 -->

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

### 4.11 searchUtils.ts（ユーティリティ）

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

### 4.9 EdgeTypeFilterBar（共通コンポーネント）

**責務:** エッジ種別の表示絞り込みトグルUI

```typescript
export type EdgeType = 'supports' | 'produces'
Props: { selected: Set<EdgeType>; lang: Language; onChange: (next: Set<EdgeType>) => void }
// supports（indigo）/ produces（green）の2種チップ
// 最低1種別選択を強制
// RelationshipGraphView の level==='bp' 時のみ使用
// RelationshipGraphView（bp level）でのみ使用
```

---

## 5. 言語切替設計 (`src/store/languageStore.ts`)

- モジュールスコープの `currentLang` 変数と `listeners` セットによるシンプルなパブサブ実装
- `useLang()`: `[lang, toggleFn]` を返す React フック。トグル時に全リスナーを呼び出し全コンポーネントを再レンダリング
- `t(text: BilingualText, lang: Language)`: 言語に応じたテキストを返すユーティリティ関数

---

## 6. スタイル設計

### 6.1 グループカラーマッピング

| グループ | bg | border | text |
|---|---|---|---|
| SYS | blue-900 | blue-600 | blue-200 |
| SWE | violet-900 | violet-600 | violet-200 |
| HWE | cyan-900 | cyan-600 | cyan-200 |
| VAL | lime-900 | lime-600 | lime-200 |
| MLE | purple-900 | purple-600 | purple-200 |
| MAN | amber-900 | amber-600 | amber-200 |
| SUP | green-900 | green-600 | green-200 |
| PIM | yellow-900 | yellow-600 | yellow-200 |
| ACQ | orange-900 | orange-600 | orange-200 |
| SPL | rose-900 | rose-600 | rose-200 |
| REU | teal-900 | teal-600 | teal-200 |
| SEC | red-900 | red-600 | red-200 |

### 6.2 グラフノードカラー（React Flow）

| ノード種別 | 背景 | ボーダー |
|---|---|---|
| GroupNode | グループ色（hex, opacity 15%） | グループボーダー色（hex） |
| ProcessNode | グループ色（hex） | グループボーダー色（hex） |
| OutcomeNode | #1e1b4b (indigo-950) | #4f46e5 (indigo-600) |
| BPNode | グループ色（hex） | グループボーダー色（hex） |
| ItemNode（出力） | #052e16 (green-950) | #22c55e (green-500) |
| ItemNode（入力） | #1e3a5f (blue-950) | #3b82f6 (blue-500) |

### 6.3 グラフエッジカラー

| エッジ種別 | ストローク | スタイル |
|---|---|---|
| BP → Outcome (supports) | #6366f1 (indigo-500) | dashed |
| Outcome → Item (produces) | #22c55e (green-500) | solid |

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
