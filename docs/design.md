# ソフトウェア設計書

**プロジェクト名:** Automotive SPICE 4.0 Process Visualizer  
**バージョン:** 1.3  
**最終更新:** 2026-05-18  

---

## 1. システムアーキテクチャ

### 1.1 全体構成

```
ブラウザ (SPA)
├── App.tsx                   ← ルートコンポーネント（ビュー切替・言語切替）
├── views/
│   ├── ProcessMapView        ← プロセスマップビュー
│   └── RelationshipGraphView ← リレーションシップグラフビュー
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
│   └── components/
│       ├── common/
│       │   ├── GroupFilterBar.tsx        ← グループフィルター（ProcessMap/Graph共用）
│       │   └── EdgeTypeFilterBar.tsx     ← エッジ種別フィルター（Graph BP levelのみ）
│       ├── ProcessMap/
│       │   ├── ProcessMapView.tsx  ← プロセスマップ全体レイアウト
│       │   ├── ProcessCard.tsx     ← プロセスカード1件
│       │   └── DetailPanel.tsx     ← 右側詳細パネル
│       └── RelationshipGraph/
│           ├── RelationshipGraphView.tsx ← グラフビュー全体
│           ├── CustomNodes.tsx           ← React Flowカスタムノード
│           └── graphUtils.ts             ← ノード/エッジ生成ロジック
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
  view: 'map' | 'graph'  （初期値: 'map'）
  lang: Language          （useLang() フック経由）

レンダリング:
  <header>  ← ASPICE 4.0バッジ / ビュータブ / EN/JAトグル
  <main>
    view==='map'   → <ProcessMapView lang={lang} />
    view==='graph' → <RelationshipGraphView lang={lang} />
```

### 4.2 ProcessMapView

**責務:** プロセスグループ×プロセスのタイルグリッド表示と詳細パネル管理

```
状態:
  selected: Process | null
  activeGroups: Set<ProcessGroup>  （初期: 全8グループ）

レンダリング:
  <GroupFilterBar>（上部）
  左ペイン（flex-1）: activeGroupsでフィルタしたグループのみ表示
                       → ProcessCard × n
  右ペイン（w-420px）: selected !== null → <DetailPanel>

副作用:
  activeGroupsから除外されたグループに属するselectedプロセスはnullリセット
```

### 4.3 ProcessCard

**責務:** 1プロセスのカードUI（選択状態・グループ色反映）

```
Props: { process, groupMeta, isSelected, lang, onClick }
```

### 4.4 DetailPanel

**責務:** 選択プロセスの詳細表示（折りたたみセクション構成）

```
セクション構成:
  1. Purpose（プロセス目的）
  2. Outcomes（プロセス成果）  ← outcome.id + description
  3. Base Practices            ← bp.id + name + description
                                  + supportsOutcomes バッジ
                                  + inputs/outputs 情報項目ID
  4. Output Information Items  ← item.id + name + characteristics
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
  onNodeClick (level==='process')           → focusProcess=クリックプロセス, level='bp' に切替
  onNodeClick (level==='item', !focusItemId) → focusItemId=クリック情報項目ID に設定
  「戻る」ボタン（BP level）  → level='process', focusProcess=null
  「戻る」ボタン（item level） → focusItemId=null（情報項目一覧に戻る）
  onNodeMouseEnter (level==='bp' || level==='item') → 接続ノード・エッジを強調

レンダリング:
  <GroupFilterBar>    （level==='process' 時のみ、上部）
  ツールバー: レベルタブ（3タブ）/ フォーカスプロセスバッジ（level==='bp' 時）
             / フォーカス情報項目バッジ（level==='item' && focusItemId 時）
             / <EdgeTypeFilterBar>（level==='bp' 時のみ）
  <ReactFlow>
```

### 4.6 CustomNodes（React Flowカスタムノード）

| コンポーネント | ノード種別 | 用途 |
|---|---|---|
| `ProcessNode` | processNode | プロセスノード（グループ色） |
| `OutcomeNode` | outcomeNode | プロセス成果ノード（インジゴ） |
| `BPNode` | bpNode | 基本プラクティスノード（グループ色薄め） |
| `ItemNode` | itemNode | 情報項目ノード（出力=緑 / 入力=青） |

### 4.7 graphUtils.ts

**責務:** ReactFlow用ノード/エッジ配列の生成

```typescript
// Dagreレイアウト適用（内部ユーティリティ）
applyDagreLayout(nodes, edges, options: { rankdir, ranksep, nodesep })
  → Node[]  // position を Dagre 計算値で上書きして返す

// プロセスレベルグラフ生成
buildProcessLevelGraph(processes: Process[], lang: Language, activeGroups: Set<ProcessGroup>)
  → { nodes: Node[], edges: Edge[] }
  // activeGroupsでフィルタしたプロセスのみノード化
  // エッジなし（ASPICE 4.0 はプロセス間の明示的接続を持たない）
  // Dagre rankdir:LR で自動レイアウト

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

### 4.8 GroupFilterBar（共通コンポーネント）

**責務:** プロセスグループの表示絞り込みトグルUI

```typescript
Props: { selected: Set<ProcessGroup>; lang: Language; onChange: (next: Set<ProcessGroup>) => void }
// 「All」ボタン + グループごとのチップ
// 最低1グループ選択を強制（最後の1つは削除不可）
// ProcessMapView / RelationshipGraphView（process level）で共用
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
