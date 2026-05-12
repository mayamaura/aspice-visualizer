# ソフトウェア設計書

**プロジェクト名:** Automotive SPICE 4.0 Process Visualizer  
**バージョン:** 1.1  
**最終更新:** 2026-05-12  

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
| スタイル | Tailwind CSS | 3.x |
| アイコン | lucide-react | 0.469.x |
| データ | 静的TypeScriptファイル | — |

### 1.3 データフロー

```
src/data/ (静的TSデータ)
    ↓ import
src/data/index.ts (ALL_PROCESSES, PROCESS_GROUPS)
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
│   ├── requirements.md       ← 要求仕様書（本ドキュメントと対）
│   └── design.md             ← 本ドキュメント
├── src/
│   ├── main.tsx              ← エントリポイント
│   ├── App.tsx               ← ルートコンポーネント
│   ├── index.css             ← グローバルCSS (Tailwind + React Flow)
│   ├── types/
│   │   └── aspice.ts         ← 全型定義
│   ├── store/
│   │   └── languageStore.ts  ← 言語切替グローバル状態
│   ├── data/
│   │   ├── index.ts          ← 全プロセス集約エクスポート
│   │   ├── processGroups.ts  ← プロセスグループメタ情報
│   │   └── processes/
│   │       ├── sys.ts        ← SYS.1〜5
│   │       ├── swe.ts        ← SWE.1〜6
│   │       ├── hwe.ts        ← HWE.1〜5
│   │       ├── man.ts        ← MAN.3, MAN.5, MAN.6
│   │       ├── sup.ts        ← SUP.1, SUP.2, SUP.4, SUP.7, SUP.8, SUP.9, SUP.10
│   │       └── acq_spl_reu.ts← ACQ.3/4/13/14, SPL.1/2, REU.2
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

---

## 3. データモデル

### 3.1 型定義 (`src/types/aspice.ts`)

```typescript
// 対応言語
type Language = 'en' | 'ja'

// 二言語テキスト（全データフィールドで使用）
interface BilingualText {
  en: string
  ja: string
}

// プロセスグループ識別子
type ProcessGroup = 'SYS' | 'SWE' | 'HWE' | 'MAN' | 'SUP' | 'ACQ' | 'SPL' | 'REU'

// アウトプット情報項目
interface InformationItem {
  id: string              // ASPICE標準ID (例: "17-08") またはプロジェクト固有ID
  name: BilingualText
  characteristics: BilingualText[]
}

// 情報項目参照（BP内の入出力参照）
interface InformationItemRef {
  itemId: string          // InformationItem.id への参照
  note?: BilingualText
}

// 基本プラクティス
interface BasePractice {
  id: string              // 例: "SWE.1.BP1"
  name: BilingualText
  description: BilingualText
  supportsOutcomes: string[]     // Outcome.id の配列
  outputs: InformationItemRef[]  // このBPが生成する情報項目
  inputs: InformationItemRef[]   // このBPが入力として使う情報項目
}

// プロセス成果
interface Outcome {
  id: string              // 例: "SWE.1.1"
  description: BilingualText
}

// プロセス（最上位エンティティ）
interface Process {
  id: string              // 例: "SWE.1"
  name: BilingualText
  group: ProcessGroup
  purpose: BilingualText
  outcomes: Outcome[]
  basePractices: BasePractice[]
  outputItems: InformationItem[]
}

// プロセスグループのUI表示メタ情報
interface ProcessGroup_Meta {
  id: ProcessGroup
  name: BilingualText
  color: string           // Tailwind bg color class
  textColor: string
  borderColor: string
}
```

### 3.2 情報項目IDの命名規則

| パターン | 意味 | 例 |
|---|---|---|
| `NN-NN`（数字-数字） | ASPICE標準情報項目ID | `17-08`, `04-06` |
| `GRP-NN-NN` | グループ固有拡張ID | `HWE-17-01`, `MAN-08-01` |

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
  level: 'process' | 'bp'
  focusProcess: Process | null
  activeGroups: Set<ProcessGroup>   （初期: 全8グループ）
  activeEdgeTypes: Set<EdgeType>    （初期: supports / produces / input すべて）

ロジック:
  level==='process'  → buildProcessLevelGraph(ALL_PROCESSES, lang, activeGroups)
  level==='bp'       → buildDetailLevelGraph(focusProcess, lang, activeEdgeTypes)
  nodes/edgesはuseMemoで導出し、ReactFlowのcontrolled propsとして渡す
  （useNodesState/useEdgesStateは使用しない）

イベント:
  onNodeClick (level==='process') → focusProcess=クリックプロセス, level='bp' に切替
  「戻る」ボタン → level='process', focusProcess=null

レンダリング:
  <GroupFilterBar>    （level==='process' 時のみ、上部）
  ツールバー: レベルタブ / フォーカスプロセスバッジ / <EdgeTypeFilterBar>（level==='bp' 時のみ）
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
// プロセスレベルグラフ生成
buildProcessLevelGraph(processes: Process[], lang: Language, activeGroups: Set<ProcessGroup>)
  → { nodes: Node[], edges: Edge[] }
  // activeGroupsでフィルタしたプロセスのみノード化
  // エッジ: BPのinputs/outputsを突合して producerProcess → consumerProcess
  // 両端点がactiveGroups内にあるエッジのみ描画

// BP/情報項目レベルグラフ生成
buildDetailLevelGraph(process: Process, lang: Language, activeEdgeTypes: Set<EdgeType>)
  → { nodes: Node[], edges: Edge[] }
  // ノード: Process(root) / Outcome×n（supportsがONの場合のみ） / BP×n / Item×n（対応エッジがONの場合のみ）
  // エッジ: BP→Outcome(supports) / BP→Item(produces) / Item→BP(input) — activeEdgeTypesで個別ON/OFF
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
export type EdgeType = 'supports' | 'produces' | 'input'
Props: { selected: Set<EdgeType>; lang: Language; onChange: (next: Set<EdgeType>) => void }
// supports（indigo）/ produces（green）/ input（blue）の3種チップ
// 最低1種別選択を強制
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
| MAN | amber-900 | amber-600 | amber-200 |
| SUP | green-900 | green-600 | green-200 |
| ACQ | orange-900 | orange-600 | orange-200 |
| SPL | rose-900 | rose-600 | rose-200 |
| REU | teal-900 | teal-600 | teal-200 |

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
| プロセス間フロー | #4b5563 (gray-600) | solid |
| BP → Outcome (supports) | #6366f1 (indigo-500) | dashed |
| BP → Item (produces) | #22c55e (green-500) | solid |
| Item → BP (input) | #3b82f6 (blue-500) | solid |

---

## 7. 今後の機能追加時の設計方針

### 7.1 新ビュー追加

1. `src/components/<ViewName>/` にコンポーネントを追加
2. `App.tsx` の `ViewId` 型と `VIEWS` 配列に追加
3. `<main>` の条件レンダリングに追加
4. `docs/requirements.md` § 2 に機能要件追加、`docs/design.md` § 4 にコンポーネント設計追加

### 7.2 新プロセスデータ追加

1. `src/data/processes/` 以下の対応ファイルを編集
2. `src/data/index.ts` のエクスポートを更新（新ファイルの場合）
3. `docs/requirements.md` § 4.1 のプロセス一覧を更新

### 7.3 データモデル変更

1. `src/types/aspice.ts` を変更
2. 影響するデータファイル・コンポーネントを更新
3. `docs/design.md` § 3 のデータモデルを更新
