# 新機能開発計画

**対象:** Automotive SPICE 4.0 Process Visualizer  
**計画バージョン:** 2.0  
**作成日:** 2026-05-25（最終更新: 2026-05-29）  
**対応要件:** FR-5 / FR-6 / FR-7 / FR-8 / FR-1-10/11 / FR-2-18/19 / NFR-6  
**ステータス:** 全7フェーズ完了

---

## 実装フェーズ概要

| Phase | 機能 | 要件ID | 優先度 | 概算工数 | 状態 |
|---|---|---|---|---|---|
| 1 | グローバル検索 | FR-5 | ★★★ | M | ✅ 完了 |
| 2 | プロセスマップ補強 | FR-1-10, FR-1-11 | ★★☆ | S | ✅ 完了 |
| 3 | グラフビュー補強 | FR-2-18, FR-2-19 | ★★☆ | S | ✅ 完了 |
| 4 | Vモデルビュー | FR-6 | ★★★ | L | ✅ 完了 |
| 5 | クロスリファレンスマトリクス | FR-7 | ★★★ | L | ✅ 完了 |
| 6 | URL状態共有 | NFR-6 | ★☆☆ | M | ✅ 完了 |
| 7 | 成果物フロービュー | FR-8 | ★★☆ | L | ✅ 完了 |

全フェーズ完了。現在のアプリは5ビュー（プロセスマップ / リレーションシップグラフ / Vモデル / マトリクス / 成果物フロー）とグローバル検索・URL状態共有を提供する。

---

## Phase 1: グローバル検索（FR-5）

### ブランチ
```
feat/global-search
```

### 目標
ヘッダーに常設の検索ボックスを追加し、プロセス・BP・情報項目を横断検索できるようにする。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/utils/searchUtils.ts` | 新規 | 検索インデックス構築・クエリ実行ロジック |
| `src/components/common/GlobalSearch.tsx` | 新規 | 検索ボックス＋ドロップダウン結果UIコンポーネント |
| `src/App.tsx` | 変更 | ヘッダーに `<GlobalSearch>` を追加。ビュー遷移コールバック（`onNavigate`）を受け取り処理 |
| `src/components/ProcessMap/ProcessMapView.tsx` | 変更 | `navigateTo` prop を受け取り、指定プロセスの詳細パネルを開く |
| `src/components/RelationshipGraph/RelationshipGraphView.tsx` | 変更 | `navigateTo` prop を受け取り、BP/情報項目レベルへ遷移してハイライト |

### searchUtils.ts の設計

```typescript
// 検索対象の型
type SearchResultType = 'process' | 'bp' | 'item'

interface SearchResult {
  type: SearchResultType
  id: string           // プロセスID / BP ID / 情報項目ID
  label: string        // 表示名
  sublabel: string     // 所属プロセス名 or グループ名
  processId?: string   // type='bp' の場合の親プロセスID
}

// 検索実行（EN+JA両方にマッチ）
function search(query: string, lang: Language): SearchResult[]
// → 最大20件。カテゴリ別 (process → bp → item) にソート
```

### App.tsx への onNavigate 設計

```typescript
type NavigateTarget =
  | { type: 'process'; processId: string }
  | { type: 'bp'; processId: string; bpId: string }
  | { type: 'item'; itemId: string }

// App.tsx が状態を持ち、各ビューへ prop で渡す
const [pendingNav, setPendingNav] = useState<NavigateTarget | null>(null)
```

### 受け入れ条件
- [x] "SWE.2" と入力すると SWE.2 プロセスが最上位に表示される
- [x] "BP.SWE.1.1" 相当のBP名を入力するとBPカテゴリに結果が出る
- [x] 情報項目ID "17-08" を入力すると情報項目カテゴリに結果が出る
- [x] 日本語クエリ（例: "ソフトウェア要件"）でも検索できる
- [x] 結果クリックでプロセスマップに遷移し詳細パネルが開く
- [x] ESCキーで検索ドロップダウンが閉じる

---

## Phase 2: プロセスマップ補強（FR-1-10 / FR-1-11）

### ブランチ
```
feat/process-map-enhancements
```

### 目標
詳細パネルに「関連プロセス」セクションを追加し、Phase 1 の検索ナビゲーションによるカードハイライトを実装する。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/ProcessMap/DetailPanel.tsx` | 変更 | §5「関連プロセス」セクション追加（共通情報項目で接続されるプロセス一覧） |
| `src/components/ProcessMap/ProcessMapView.tsx` | 変更 | `highlightProcessId` state 管理。2秒後に自動リセット |
| `src/components/ProcessMap/ProcessCard.tsx` | 変更 | `isHighlighted` prop を受け取りリング表示 |

### 関連プロセス計算ロジック

```typescript
// このプロセスが出力する情報項目ID一覧を取得
const myItemIds = process.output_information_items.map(o => o.id)

// 同じ情報項目IDを output_information_items に持つ他プロセスを検索
const relatedProcesses = ALL_PROCESSES.filter(p =>
  p.id !== process.id &&
  p.output_information_items.some(o => myItemIds.includes(o.id))
)
```

### 受け入れ条件
- [x] 詳細パネルの最下部に「関連プロセス」セクションが表示される
- [x] 共通の情報項目IDが折りたたみ表示で確認できる
- [x] 関連プロセス名をクリックすると、そのプロセスの詳細パネルに遷移する
- [x] 検索からジャンプした際、対象カードが2秒間ハイライト（黄色リング）される

---

## Phase 3: グラフビュー補強（FR-2-18 / FR-2-19）

### ブランチ
```
feat/graph-enhancements
```

### 目標
グラフのPNGエクスポートと、プロセスノードのホバーツールチップを追加する。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/RelationshipGraph/RelationshipGraphView.tsx` | 変更 | エクスポートボタン追加・ホバーツールチップ表示制御 |
| `src/components/RelationshipGraph/CustomNodes.tsx` | 変更 | ProcessNode にホバーイベントと data.purpose/outcomeCount/bpCount を追加 |
| `src/components/RelationshipGraph/GraphExportButton.tsx` | 新規 | React Flowの `useReactFlow().toObject()` + html-to-image でPNG出力 |
| `src/components/RelationshipGraph/ProcessHoverTooltip.tsx` | 新規 | ホバー時のツールチップUI（目的先頭1文・成果数・BP数） |

### PNG エクスポート実装方針
- `html-to-image` ライブラリ（`toPng`）を使用し、React Flowのコンテナ DOM要素をキャプチャ
- ファイル名は `aspice-graph-{timestamp}.png`
- パッケージ追加: `npm install html-to-image`

### ホバーツールチップ実装方針
- ProcessNode の `onMouseEnter` / `onMouseLeave` でホバー状態を RelationshipGraphView へ伝播
- ツールチップはグラフキャンバス上に `position: absolute` で表示（React Flow Portは不要）
- ホバー中のノード座標を React Flow の `getNode()` で取得してピクセル変換

### 受け入れ条件
- [x] ツールバーの「エクスポート」ボタンクリックでPNG画像がダウンロードされる
- [x] プロセスレベルでノードをホバーするとツールチップが表示される
- [x] ツールチップには目的テキスト（先頭1文）・成果数・BP数が表示される
- [x] ツールチップは現在の言語（EN/JA）に対応する

---

## Phase 4: Vモデルビュー（FR-6）

### ブランチ
```
feat/vmodel-view
```

### 目標
SYS/SWE/HWE/VAL のプロセスをV字に配置し、仕様フェーズと検証フェーズの対応関係を可視化する。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/VModelView/VModelView.tsx` | 新規 | Vモデルビュー全体（React Flow キャンバス＋詳細パネル） |
| `src/components/VModelView/vmodelLayout.ts` | 新規 | V字座標定義・対応エッジ定義 |
| `src/App.tsx` | 変更 | `ViewId` に `'vmodel'` 追加。タブ追加 |

### vmodelLayout.ts の設計

```typescript
// V字の左辺（仕様・設計フェーズ）: 上から下
const LEFT_SIDE = [
  'SYS.1', 'SYS.2', 'SYS.3',
  'SWE.1', 'SWE.2', 'SWE.3',
  'HWE.1', 'HWE.2',
]

// V字の右辺（統合・検証フェーズ）: 下から上
const RIGHT_SIDE = [
  'HWE.3', 'HWE.4',
  'SWE.4', 'SWE.5', 'SWE.6',
  'SYS.4', 'SYS.5',
]

// 対応線（左辺 ↔ 右辺）
const CORRESPONDENCE_PAIRS = [
  ['SYS.1', 'SYS.5'],
  ['SYS.2', 'SYS.4'],
  ['SYS.3', 'SYS.4'],
  ['SWE.1', 'SWE.6'],
  ['SWE.2', 'SWE.5'],
  ['SWE.3', 'SWE.4'],
  ['HWE.1', 'HWE.4'],
  ['HWE.2', 'HWE.3'],
]

// 固定座標（V字形状）
// 左辺: x=100, y を等間隔で増加（仕様フェーズ）
// 右辺: x=800, y を同じ間隔で減少（下から上）
// VAL.1: x=1000, y=top（SYS.5 と同じ高さ）
```

### ノード設計
- ProcessNode（CustomNodes.tsx のものを再利用）
- 対応エッジ: `type: 'straight'`、灰色点線（`style: { stroke: '#6b7280', strokeDasharray: '4 4' }`）
- 左辺→右辺の流れエッジは描画しない（V字の形状のみで暗示）

### 受け入れ条件
- [x] ヘッダータブに「Vモデル」が表示され切替できる
- [x] SYS/SWE/HWEがV字に並び、対応関係が水平点線で示される
- [x] VAL.1が右上に配置される
- [x] ノードをクリックすると右側に DetailPanel が表示される
- [x] グループカラーが適用されている

---

## Phase 5: クロスリファレンスマトリクスビュー（FR-7）

### ブランチ
```
feat/matrix-view
```

### 目標
プロセス×情報項目のマトリクスで、成果物のカバレッジを一目で把握できるようにする。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/MatrixView/MatrixView.tsx` | 新規 | マトリクスビュー全体（テーブル＋フィルター＋ポップアップ） |
| `src/components/MatrixView/MatrixCell.tsx` | 新規 | 塗りつぶしセル（クリックでポップアップ） |
| `src/components/MatrixView/CellDetailPopup.tsx` | 新規 | セルクリック時のポップアップ（プロセス目的＋情報項目説明） |
| `src/App.tsx` | 変更 | `ViewId` に `'matrix'` 追加。タブ追加 |

### データ構築ロジック

```typescript
// 全情報項目IDを昇順で列挙（重複排除）
const allItemIds: string[] = [...new Set(
  ALL_PROCESSES.flatMap(p => p.output_information_items.map(o => o.id))
)].sort()

// マトリクスのセル値
function hasOutput(process: Process, itemId: string): boolean {
  return process.output_information_items.some(o => o.id === itemId)
}
```

### 列グループ見出し（FR-7-3）
- 情報項目IDの上2桁（例: `17-08` → `17`）が同じものをグループ化
- グループ見出し行を `<th colSpan={n}>` で挿入

### テーブルスクロール設計
- 全体は `overflow-x: auto` でスクロール
- 行ヘッダー（プロセスID＋名称）は `position: sticky; left: 0` で固定
- 列ヘッダー（情報項目ID）は `position: sticky; top: 0` で固定
- 大量セルによるパフォーマンス劣化を防ぐため `useMemo` で行データを事前計算

### 受け入れ条件
- [x] ヘッダータブに「マトリクス」が表示され切替できる
- [x] 全プロセス×全情報項目が表示される
- [x] 出力セルが塗りつぶされており、非出力セルは空欄
- [x] 行ヘッダーと列ヘッダーがスクロール時も固定される
- [x] グループフィルターで表示行を絞り込める
- [x] セルクリックでポップアップが表示される
- [x] 列ヘッダーの情報項目IDクリックでグラフビューの情報項目起点に遷移できる

---

## Phase 6: URL状態共有（NFR-6）

### ブランチ
```
feat/url-state
```

### 目標
現在の表示状態をURLクエリパラメータに同期し、URLを共有・ブックマークすることで同じ状態を再現できるようにする。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/hooks/useUrlState.ts` | 新規 | URLクエリと React state を双方向同期するカスタムフック |
| `src/App.tsx` | 変更 | `useState` を `useUrlState` に切り替え |

### URLパラメータ仕様

| パラメータ | 値の例 | 対応状態 |
|---|---|---|
| `view` | `map` / `graph` / `vmodel` / `matrix` | 表示ビュー |
| `process` | `SWE.2` | 選択プロセスID（プロセスマップの詳細パネル開閉） |
| `level` | `process` / `bp` / `item` | グラフビューのレベル |
| `focus` | `SWE.2` / `17-08` | BP levelのフォーカスプロセス or 情報項目のフォーカスID |

### useUrlState の設計

```typescript
// URLを読んで初期値を決定 → 状態変化時にURLを history.replaceState で更新
function useUrlState<T>(key: string, defaultValue: T, serialize, deserialize): [T, Dispatch<SetStateAction<T>>]
```

### 受け入れ条件
- [ ] ビュー切替するとURLが `?view=graph` のように更新される
- [ ] プロセス詳細パネルを開くと `?process=SWE.2` が付与される
- [ ] URLを別タブで開くと同じ状態が再現される
- [ ] ブラウザの「戻る/進む」ボタンが機能する

---

## 共通の実装規約

1. **ブランチ戦略:** 各フェーズごとに `feat/*` ブランチを切り、完成後に `main` へ `--no-ff` マージ
2. **型エラーゼロ:** 各フェーズ完了時に `npm run type-check` を実行してエラーゼロを確認
3. **ドキュメント同期:** 各フェーズのコミットに `docs/design.md` の該当セクション更新を含める
4. **コメント方針:** WHYが非自明な箇所のみ1行、docstringは書かない

---

## フェーズ間の依存関係

```
Phase 1（グローバル検索）
    ↓ onNavigate コールバック設計が確定
Phase 2（プロセスマップ補強）── FR-1-11（検索ハイライト）は Phase 1 完了後に着手

Phase 3（グラフ補強）
    ↓ 独立して着手可能（Phase 1 と並行可能）

Phase 4（Vモデル）
    ↓ App.tsx のタブ追加設計は Phase 5 と共通のため同時実施推奨

Phase 5（マトリクス）
    ↓ 情報項目IDクリック → グラフ遷移（FR-7-6）は Phase 1 の onNavigate を利用

Phase 6（URL状態）
    ↓ flowgroup パラメータ設計（Phase 7）は Phase 6 の useAppUrlState 拡張として実装

Phase 7（成果物フロービュー）
    → useAppUrlState に flowGroup を追加。App.tsx の setFlowState コールバックで同期
```

---

## Phase 7: 成果物フロービュー（FR-8）

### ブランチ
```
feat/artifact-flow
```

### 目標
プロセスグループが出力する情報項目の全体分布をサンキー図で俯瞰できるビューを追加する。グループレベルとプロセスレベルの2段階表示により、アセスメント計画のスコープ設定と成果物カバレッジ確認を支援する。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/ArtifactFlowView/ArtifactFlowView.tsx` | 新規 | ビュー全体（ツールバー＋キャンバス＋詳細パネル） |
| `src/components/ArtifactFlowView/SankeyCanvas.tsx` | 新規 | カスタムSVGサンキーレンダラー（ResizeObserver対応） |
| `src/components/ArtifactFlowView/sankeyLayout.ts` | 新規 | 2カラムサンキーのノード位置・リンクパス座標計算 |
| `src/components/ArtifactFlowView/sankeyData.ts` | 新規 | ALL_PROCESSES → SankeyNode/SankeyLink 変換 |
| `src/components/ArtifactFlowView/FlowDetailPanel.tsx` | 新規 | リンク/ノードクリック時の右側詳細パネル |
| `src/App.tsx` | 変更 | ViewId に `'flow'` 追加、タブ追加、ArtifactFlowView レンダリング |
| `src/hooks/useAppUrlState.ts` | 変更 | `flowGroup` パラメータ追加、`setFlowState` コールバック追加 |
| `docs/requirements.md` | 変更 | §2.8 FR-8 追加 |
| `docs/design.md` | 変更 | §4.10 ArtifactFlowView 追加、URL状態表更新、ファイル構成更新 |

### 設計上の決定事項

- **カスタム SVG サンキー（ライブラリ追加なし）**: 2カラム固定構造のため `@nivo/sankey` 等は不要。~300KB の依存追加を回避
- **`flowGroup` パラメータ分離**: グラフビューの `focus` パラメータとの衝突を避けるため専用パラメータを設ける
- **依存関係**: useAppUrlState の `flowGroup` 型は `string | null`（ProcessGroup の検証は View 側で実施）

### 受け入れ条件

- [x] 「成果物フロー」タブをクリックするとサンキー図が表示される
- [x] 12グループのノードと情報項目カテゴリノードが帯でつながれている
- [x] 帯幅がカテゴリの情報項目数に比例している
- [x] グループノードをクリックするとプロセスレベルに展開される
- [x] リンクをクリックすると右側に情報項目一覧パネルが表示される
- [x] 情報項目 ID クリックでリレーションシップグラフに遷移する
- [x] EN/JA 切替でラベルが即時変わる
- [x] `npm run build` が型エラーゼロで成功する

---

## 各フェーズの着手確認事項

フェーズ着手前に以下を確認すること：
- `main` ブランチが最新であること（`git pull`）
- `npm run type-check` がエラーゼロであること
- `npm run dev` でアプリが正常起動することを確認

---
---

# UI/UX 強化 開発計画（v3.0）

**計画バージョン:** 3.0
**作成日:** 2026-06-14
**前提:** 上記 v2.0 の全7フェーズ（5ビュー＋検索＋URL状態）完了済み
**実装担当:** Sonnet が本計画を参照して設計・実装できる粒度で記述
**ステータス:** Phase 1, 2 完了

> v2.0 までと記載粒度が異なるが、精度を重視し詳細度を上げている。本計画内の Phase 番号（1〜5）は v3.0 内のローカル番号であり、v2.0 の Phase 1〜7 とは別系列。

---

## Context（なぜこの開発を行うか）

アプリは機能面で成熟したが（5ビュー・グローバル検索・URL状態共有）、操作性・初見ユーザーへの導線・外観の柔軟性に伸びしろがある。現状の課題は次の4点：

1. **キーボード操作が未整備** — 検索フォーカス・結果選択・ビュー切替がすべてマウス前提（GlobalSearch は ESC のみ対応）
2. **テーマがダーク固定** — `bg-gray-950` / `text-gray-100` 等を全コンポーネントが直接ハードコードしており、明るい環境・印刷・好みに対応できない
3. **設定が揮発** — 言語・ビューが再訪時に初期化される（URL 共有時を除く）
4. **初見ユーザーへの導線がない** — 各ビューの目的説明・ショートカット案内・空状態のガイドが無い

本計画は UI/UX のポリッシュに集中し、上記を5フェーズで解消する。新しいプロセスデータやビューは追加しない（読み取り専用アプリの性質を維持）。

確認済みの方針：
- 改善領域は **4領域すべて**（キーボード操作 / テーマ＋永続化 / オンボーディング / 視覚的洗練・a11y）
- テーマは **CSS変数トークン化による全面ライト対応**（段階移行ではなく正攻法）

---

## v3.0 フェーズ概要

| Phase | 内容 | 優先度 | 規模 | 依存 | 状態 |
|---|---|---|---|---|---|
| 1 | 設定永続化基盤（themeStore + localStorage） | ★★★ | S | なし | ✅ 完了 |
| 2 | テーマトークン化と全面ライト対応 | ★★★ | XL | Phase 1 | ✅ 完了 |
| 3 | キーボード操作・ショートカット | ★★☆ | M | なし（1と並行可） | ✅ 完了 |
| 4 | オンボーディング・ヘルプ | ★★☆ | M | Phase 3（?キー連携） | ✅ 完了 |
| 5 | 視覚的洗練・アクセシビリティ | ★☆☆ | M | Phase 2 | 未着手 |

**推奨着手順:** 1 → 2 →（3 → 4）→ 5。Phase 3 は Phase 1/2 と並行可能。

---

## v3.0 共通実装規約（全フェーズ共通）

1. **ブランチ:** 各フェーズで `feat/*` を切り、完成後 `main` へ `--no-ff` マージ（CLAUDE.md準拠）
2. **型エラーゼロ:** 各フェーズ完了時に `npm run type-check`（または `npm run build`）でエラーゼロを確認
3. **ドキュメント同期（最重要・CLAUDE.md準拠）:** 各フェーズのコミットに `docs/requirements.md` と `docs/design.md` の該当セクション更新を必ず含める
4. **コメント方針:** WHY が非自明な箇所のみ1行。docstring は書かない
5. **既存パターン踏襲:** 新ストアは `src/store/languageStore.ts` のモジュールシングルトン＋パブサブ方式に揃える。新フックは `src/hooks/` に配置

---

## v3.0 Phase 1: 設定永続化基盤

### ブランチ
```
feat/settings-persistence
```

### 目的
テーマストアを新設し、言語・テーマ・最終ビューを `localStorage` に保存して再訪時に復元する。Phase 2 のテーマ切替の受け皿を先に整える。

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/store/themeStore.ts` | 新規 | `languageStore.ts` と同型のシングルトン＋パブサブ。`useTheme(): ['dark'\|'light', () => void]`。初期値は localStorage → 無ければ `matchMedia('(prefers-color-scheme: light)')` → 既定 `dark` |
| `src/store/languageStore.ts` | 変更 | 初期 `currentLang` を localStorage から読み込み、`toggle` 時に保存。SSR非対象なので `window` 直参照で可 |
| `src/utils/persistence.ts` | 新規 | `loadSetting<T>(key, fallback)` / `saveSetting(key, value)` の薄いラッパ（try/catch で localStorage 不可環境を握りつぶす）。キー定数 `STORAGE_KEYS = { lang, theme, lastView }` を集約 |
| `src/hooks/useAppUrlState.ts` | 変更 | `parseUrl()` で `view` パラメータが無い場合のみ localStorage の `lastView` を初期値に採用（URL指定があれば常にURL優先）。`setView` 内で `lastView` を保存 |

### themeStore.ts の設計（languageStore 踏襲）
```typescript
import { useState } from 'react'
import { loadSetting, saveSetting, STORAGE_KEYS } from '../utils/persistence'

export type Theme = 'dark' | 'light'

function detectInitial(): Theme {
  const saved = loadSetting<Theme | null>(STORAGE_KEYS.theme, null)
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

let currentTheme: Theme = detectInitial()
const listeners = new Set<() => void>()

function applyToDom(theme: Theme) {
  // Phase 2 が参照: ライト時のみ <html> に .light を付与（既定ダークは無印）
  document.documentElement.classList.toggle('light', theme === 'light')
}
applyToDom(currentTheme)

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(currentTheme)
  const toggle = () => {
    currentTheme = currentTheme === 'dark' ? 'light' : 'dark'
    saveSetting(STORAGE_KEYS.theme, currentTheme)
    applyToDom(currentTheme)
    listeners.forEach((l) => l())
  }
  useState(() => {
    const update = () => setTheme(currentTheme)
    listeners.add(update)
    return () => listeners.delete(update)
  })
  return [theme, toggle]
}
```
> Phase 1 では `.light` クラスを付けてもまだ見た目は変わらない（CSS変数を Phase 2 で定義するため）。本フェーズはストアと永続化の確立まで。

### 受け入れ条件
- [x] 言語を切り替えてリロードすると、選択言語が保持される
- [x] `localStorage` を消すと既定（EN / `prefers-color-scheme`）に戻る
- [x] `?view=graph` 付きURLを開くと、保存ビューより URL が優先される
- [x] URL に `view` 無しで開くと、前回見ていたビューが復元される
- [x] `useTheme()` でトグルすると `<html class="light">` が付与/除去される（見た目変化は Phase 2）

### ドキュメント更新
- `design.md` §1.1 構成図・§5 に themeStore / persistence を追記、§1.4 に lastView の localStorage フォールバックを追記
- `requirements.md` に NFR（設定永続化）を追記

---

## v3.0 Phase 2: テーマトークン化と全面ライト対応

### ブランチ
```
feat/theme-tokens
```

### 目的
色をセマンティックなCSS変数トークンに集約し、ダーク（既定）/ライトの双方を提供する。全コンポーネントのハードコード色クラスをトークンクラスへ置換する。

### 設計方針：CSS変数 + Tailwind theme 拡張

**1. `src/index.css` にトークンを定義**（RGB成分でalpha対応。既定=ダーク、`.light` で上書き）
```css
@layer base {
  :root {
    --color-bg: 3 7 18;            /* gray-950 : アプリ最背面 */
    --color-surface: 17 24 39;     /* gray-900 : ヘッダー/パネル/カード */
    --color-surface-2: 31 41 55;   /* gray-800 : 入力欄/ホバー面 */
    --color-line: 55 65 81;        /* gray-700 : 既定ボーダー */
    --color-line-subtle: 31 41 55; /* gray-800 : 弱ボーダー */
    --color-content: 243 244 246;  /* gray-100 : 主テキスト */
    --color-content-2: 156 163 175;/* gray-400 : 副テキスト */
    --color-content-muted: 107 114 128; /* gray-500 : 補助テキスト */
    --color-accent: 96 165 250;    /* blue-400 */
    --color-accent-bg: 23 37 84;   /* blue-950 : バッジ背景 */
  }
  :root.light {
    --color-bg: 255 255 255;
    --color-surface: 249 250 251;  /* gray-50 */
    --color-surface-2: 243 244 246;/* gray-100 */
    --color-line: 209 213 219;     /* gray-300 */
    --color-line-subtle: 229 231 235; /* gray-200 */
    --color-content: 17 24 39;     /* gray-900 */
    --color-content-2: 75 85 99;   /* gray-600 */
    --color-content-muted: 107 114 128;
    --color-accent: 37 99 235;     /* blue-600 */
    --color-accent-bg: 219 234 254;/* blue-100 */
  }
  /* React Flow 背景もトークン参照に */
  .react-flow__background { background-color: rgb(var(--color-bg)); }
}
```

**2. `tailwind.config.js` の theme.extend.colors にトークンを登録**
```js
theme: { extend: { colors: {
  bg:               'rgb(var(--color-bg) / <alpha-value>)',
  surface:          'rgb(var(--color-surface) / <alpha-value>)',
  'surface-2':      'rgb(var(--color-surface-2) / <alpha-value>)',
  line:             'rgb(var(--color-line) / <alpha-value>)',
  'line-subtle':    'rgb(var(--color-line-subtle) / <alpha-value>)',
  content:          'rgb(var(--color-content) / <alpha-value>)',
  'content-2':      'rgb(var(--color-content-2) / <alpha-value>)',
  'content-muted':  'rgb(var(--color-content-muted) / <alpha-value>)',
  accent:           'rgb(var(--color-accent) / <alpha-value>)',
  'accent-bg':      'rgb(var(--color-accent-bg) / <alpha-value>)',
}}}
```
> 色名 `border` は Tailwind の `border` ユーティリティと衝突するため `line` を採用。

**3. 置換ルール（全コンポーネント横断）** — 代表的な機械置換：

| 旧クラス | 新クラス |
|---|---|
| `bg-gray-950` | `bg-bg` |
| `bg-gray-900` | `bg-surface` |
| `bg-gray-800` | `bg-surface-2` |
| `border-gray-700` | `border-line` |
| `border-gray-800` | `border-line-subtle` |
| `text-gray-100/200` | `text-content` |
| `text-gray-400` | `text-content-2` |
| `text-gray-500/600` | `text-content-muted` |
| `ring-offset-gray-950` | `ring-offset-bg` |

置換対象は `src/**/*.tsx` のほぼ全コンポーネント（App.tsx, ProcessMap/*, RelationshipGraph/*, VModelView/*, MatrixView/*, ArtifactFlowView/*, common/*）。`Grep` で `gray-(950|900|800|700|600|500|400|200|100)` を洗い出し、文脈（背景/境界/文字）に応じてトークンへ寄せる。

**4. グループカラー（12グループ×3ロール）のトークン化**

各グループ・各ロールに対しCSS変数を `index.css` に定義する：
```css
:root {
  --grp-sys-surface: 30 58 138;  /* blue-900 */ --grp-sys-line: 37 99 235; --grp-sys-text: 191 219 254;
  /* …12グループ分… */
}
:root.light {
  --grp-sys-surface: 219 234 254; /* blue-100 */ --grp-sys-line: 59 130 246; --grp-sys-text: 30 64 175; /* blue-800 */
  /* …12グループ分… */
}
```
- CSS変数はReact Flow系コンポーネント（CustomNodes / vmodelLayout / SankeyCanvas等）の `cssVar()` / `groupColorHex()` 経由でのみ利用
- `processGroups.ts` のクラス文字列（`bg-blue-900` / `text-blue-200` / `border-blue-600` 等）は Tailwind 組み込みカラーのまま維持。ライト/ダーク共通で同じクラスを使用
- `tailwind.config.js` への `grp-*` トークン登録は実施しない（Tailwind クラス経由のグループ色切替は行わない）

**5. React Flow 用 hex 色（CustomNodes.tsx / graphUtils.ts / vmodelLayout.ts / sankey*）への対応**

reactflow はインラインスタイルで hex を要求する箇所がある（design.md §6.2）。テーマ変更時に再評価が必要：
```typescript
// src/utils/themeColors.ts（新規）
export function cssVar(name: string): string {
  // '30 58 138' → 'rgb(30 58 138)'
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v ? `rgb(${v})` : 'transparent'
}
export function groupColorHex(groupId: ProcessGroup, role: 'surface'|'line'|'text'): string {
  return cssVar(`--grp-${groupId.toLowerCase()}-${role}`)
}
```
- グラフ系コンポーネントは `useTheme()` を購読し、テーマ変更時に nodes/edges を再生成（`useMemo` の依存配列に `theme` を追加）。これにより hex 色がテーマ追従する
- OutcomeNode / ItemNode の固定 hex（indigo / green / blue）も CSS変数化し `cssVar()` 経由に統一

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/index.css` | 変更 | トークン定義（共通＋グループ12×3）、React Flow背景のトークン化 |
| `tailwind.config.js` | 変更 | `theme.extend.colors` にセマンティック＋グループトークンを登録 |
| `src/utils/themeColors.ts` | 新規 | `cssVar()` / `groupColorHex()` ヘルパー |
| `src/data/processGroups.ts` | 変更なし | Tailwind組み込みカラークラスを維持（グループ色切替はCSS変数＋cssVar()経由のみ） |
| `src/App.tsx` | 変更 | ヘッダーにテーマ切替ボタン（lucide `Sun`/`Moon`）を言語トグル隣に追加。`useTheme()` 使用 |
| `src/**/*.tsx`（全ビュー・共通） | 変更 | gray-* ハードコードをトークンクラスへ機械置換 |
| グラフ系（CustomNodes/graphUtils/vmodelLayout/SankeyCanvas 等） | 変更 | hex を `cssVar()`/`groupColorHex()` 経由に。`useTheme()` を依存に追加し再生成 |

### 受け入れ条件
- [x] ヘッダーのテーマ切替ボタンでライト/ダークが即時切替わる
- [x] ライトテーマで全5ビューが可読（コントラスト確保、白飛び/黒潰れなし）
- [x] グループカラーがライト/ダーク双方で判別可能（ProcessCard・グラフノード・サンキー帯）
- [x] React Flow のノード/エッジ色がテーマに追従する
- [x] テーマ選択がリロード後も保持される（Phase 1 連携）
- [x] `npm run build` が型エラーゼロで成功

### ドキュメント更新
- `design.md` §6（スタイル設計）を全面改訂：トークン表・グループトークン表・hex取得方針を記載。§1.2 にテーマ機構を追記
- `requirements.md` にテーマ切替の機能要件を追記

---

## v3.0 Phase 3: キーボード操作・ショートカット

### ブランチ
```
feat/keyboard-shortcuts
```

### 目的
主要操作をキーボードで完結できるようにする。検索フォーカス・結果選択・ビュー切替・ヘルプ表示を追加。

### ショートカット仕様

| キー | 動作 | 実装箇所 |
|---|---|---|
| `Cmd/Ctrl + K` または `/` | 検索ボックスにフォーカス | GlobalSearch + App |
| `Esc` | 検索を閉じる（既存）/ 開いているパネル・ポップアップを閉じる | 各ビュー |
| `↑` `↓` | 検索結果のフラットリストを上下移動 | GlobalSearch |
| `Enter` | 選択中の検索結果へ遷移 | GlobalSearch |
| `1`〜`5` | ビュー切替（map/graph/vmodel/matrix/flow）※入力欄フォーカス時は無効 | App |
| `?`（Shift+/） | ヘルプオーバーレイ開閉（Phase 4 で中身実装、Phase 3 ではトグルstateのみ用意） | App |

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/hooks/useKeyboardShortcuts.ts` | 新規 | グローバルキーハンドラ。`isTypingTarget(e)`（input/textarea/contenteditable 判定）でテキスト入力中は数字/`?`/`/`を無効化。コールバック群 `{ onSearch, onView, onHelp }` を受け取る |
| `src/components/common/GlobalSearch.tsx` | 変更 | `forwardRef` で `focus()` を App に公開、または `imperative` な focus 用 ref。結果を `flatResults` 配列化し `activeIndex` state を追加。`onKeyDown` で ↑↓/Enter 処理。アクティブ項目に強調スタイル（`bg-surface-2`）と `aria-selected` |
| `src/App.tsx` | 変更 | `useKeyboardShortcuts` を呼び、`searchRef.current?.focus()` / `setView` / `setHelpOpen(true)` を配線。`helpOpen` state を新設（Phase 4 が消費） |

### useKeyboardShortcuts.ts の骨子
```typescript
interface Handlers {
  onSearchFocus: () => void
  onSelectView: (index: number) => void  // 0..4
  onToggleHelp: () => void
}
export function useKeyboardShortcuts(h: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = isTypingTarget(e.target)
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); h.onSearchFocus(); return }
      if (typing) return
      if (e.key === '/') { e.preventDefault(); h.onSearchFocus(); return }
      if (e.key === '?') { h.onToggleHelp(); return }
      if (e.key >= '1' && e.key <= '5') { h.onSelectView(Number(e.key) - 1) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [h])
}
```

### 受け入れ条件
- [ ] `Cmd/Ctrl+K` または `/` で検索にフォーカスが移る
- [ ] 検索結果を `↑↓` で移動でき、選択行が視覚的に分かる
- [ ] `Enter` で選択中の結果へ遷移する（マウスクリックと同等）
- [ ] `1`〜`5` でビューが切り替わる（検索入力中は数字が無効）
- [ ] `?` でヘルプ表示トグル（Phase 4 で中身が出る）
- [ ] 既存の Esc 動作が壊れていない

### ドキュメント更新
- `design.md` §4 に useKeyboardShortcuts を追記、GlobalSearch の状態（activeIndex）を更新
- `requirements.md` に操作性要件を追記

---

## v3.0 Phase 4: オンボーディング・ヘルプ

### ブランチ
```
feat/onboarding-help
```

### 目的
初見ユーザーが各ビューの目的とショートカットを把握できる導線を用意する。

### 機能
1. **ヘルプオーバーレイ**（`?` キー / ヘッダーの `?` ボタンで開く）：ショートカット一覧＋5ビューの1行説明。Esc / 背景クリックで閉じる
2. **初回起動ガイド**：初回のみ「ようこそ」+ ビュータブとテーマ/検索の場所を案内する軽量バナー or 1ステップのスポットライト。localStorage フラグ `onboarded` で2回目以降は非表示
3. **空状態の案内文**：選択前のビュー（例：グラフBPレベルでフォーカス未選択、検索結果0件、フローのパネル未選択）に「○○をクリックしてください」等のガイドテキスト。既存の空状態を洗い出して補強

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/common/HelpOverlay.tsx` | 新規 | モーダル。ショートカット表＋ビュー説明。`{ open, onClose, lang }`。EN/JA 両対応。フォーカストラップと Esc 対応 |
| `src/components/common/OnboardingBanner.tsx` | 新規 | 初回のみ表示する閉じれるバナー。`persistence` の `onboarded` フラグを参照・更新 |
| `src/data/viewMeta.ts` | 新規 | 5ビューの `{ id, titleEn/Ja, descEn/Ja }` を集約（App の VIEWS と重複させず、VIEWS を拡張してもよい） |
| `src/App.tsx` | 変更 | `?` ボタンをヘッダーに追加。`HelpOverlay` / `OnboardingBanner` をレンダリング。Phase 3 の `helpOpen` を接続 |
| 各ビュー（空状態箇所） | 変更 | ガイドテキスト追加（現状の空状態を確認のうえ最小限） |

### 受け入れ条件
- [x] `?` キー / ヘッダー `?` ボタンでヘルプが開き、ショートカットとビュー説明が読める
- [x] ヘルプは Esc / 背景クリック / 閉じるボタンで閉じる
- [x] 初回アクセス時のみガイドバナーが出て、閉じると以後表示されない（localStorage）
- [x] 主要な空状態に操作ガイドが表示される（成果物フロービューの右パネル未選択時）
- [x] EN/JA 切替でヘルプ・ガイド文言が変わる

### ドキュメント更新

- `design.md` §4 に HelpOverlay / OnboardingBanner / viewMeta を追記（完了）
- `requirements.md` にオンボーディング要件を追記（完了）

---

## v3.0 Phase 5: 視覚的洗練・アクセシビリティ

### ブランチ
```
feat/polish-a11y
```

### 目的
トランジション・フィードバック・レスポンシブ・a11y を底上げし、全体の完成度を上げる。

### 内容
1. **トランジション**：ビュー切替・詳細パネル/ポップアップ開閉に軽い transition（Tailwind `transition` + opacity/translate。ライブラリ追加なし）。`prefers-reduced-motion` を尊重して無効化
2. **トースト通知**：PNG エクスポート完了・URL コピー等の操作フィードバック。`src/components/common/Toast.tsx` + 簡易な発火関数（モジュールシングルトンのパブサブ、languageStore 方式）。GraphExportButton 等から呼ぶ
3. **レスポンシブ**：ヘッダーが狭幅で破綻しないよう、ビュータブのラベルを狭幅でアイコンのみ化（`hidden sm:inline`）、検索ボックス幅の可変化、`flex-wrap` 検討
4. **アクセシビリティ**：
   - インタラクティブ要素に `aria-label`（アイコンのみボタン：テーマ/言語/検索クリア/エクスポート/ヘルプ/閉じる）
   - ビュータブを `role="tablist"` / `role="tab"` / `aria-selected` 化
   - フォーカスリングの可視化（トークン `focus-visible:ring-2 focus-visible:ring-accent`）をボタン共通に
   - モーダル（HelpOverlay / CellDetailPopup）のフォーカストラップと `role="dialog"` / `aria-modal`

### 作成・変更ファイル

| ファイル | 種別 | 内容 |
|---|---|---|
| `src/components/common/Toast.tsx` | 新規 | トースト表示＋ `toast(message)` 発火関数（シングルトン pubsub）。自動消滅（3秒） |
| `src/App.tsx` | 変更 | `<Toast />` をルートに配置。ヘッダーのレスポンシブ化・タブの role 付与・aria-label 付与。ビュー切替のフェード |
| `src/components/RelationshipGraph/GraphExportButton.tsx` | 変更 | エクスポート完了時に `toast()` |
| 各ビューの詳細パネル/ポップアップ | 変更 | 開閉トランジション・`role="dialog"`・フォーカストラップ（HelpOverlay と共通ユーティリティ化検討） |
| `src/index.css` | 変更 | `prefers-reduced-motion` でトランジション無効化する `@media` |

### 受け入れ条件
- [ ] ビュー切替・パネル開閉に滑らかなトランジションが付く
- [ ] `prefers-reduced-motion: reduce` でアニメーションが無効になる
- [ ] PNG エクスポート時にトーストが表示される
- [ ] 狭幅ウィンドウでヘッダーが破綻しない（タブがアイコン化 or 折返し）
- [ ] アイコンのみボタンに `aria-label` がある（スクリーンリーダ読み上げ確認）
- [ ] Tab キーでフォーカス移動でき、フォーカスリングが見える
- [ ] モーダルが `role="dialog"` を持ち、Esc で閉じ、フォーカスが内側に留まる

### ドキュメント更新
- `design.md` §6 にトランジション/フォーカス方針、§4 に Toast を追記
- `requirements.md` に a11y / レスポンシブ要件（NFR）を追記

---

## v3.0 検証方法（エンドツーエンド）

各フェーズ完了時：
1. `npm run type-check`（または `npm run build`）でエラーゼロ
2. `npm run dev` で起動し、対象フェーズの受け入れ条件を手動確認
3. 全5ビュー（map/graph/vmodel/matrix/flow）×EN/JA×ライト/ダーク の主要組合せを目視
4. `git status` で `docs/requirements.md`・`docs/design.md` が同コミットに含まれることを確認（CLAUDE.md準拠）

全フェーズ完了後：
- ライト/ダーク双方で全ビューを巡回し、コントラスト・グループ色判別・テキスト可読性を確認
- キーボードのみ（マウス不使用）で「検索→遷移→ビュー切替→ヘルプ」が完結することを確認
- DevTools の Lighthouse Accessibility または手動 Tab 走査で a11y を確認

---

## v3.0 リスク・留意点

- **Phase 2 が最大の工数**：色クラス置換は全コンポーネントに及ぶ。`Grep` で `gray-\d{3}` を網羅抽出し、機械的に置換 → 各ビューを目視回帰。グループ色36トークンは Tailwind パージ対象外にするため `tailwind.config.js` の `colors` に必ず明示登録する
- **React Flow の hex 追従**：`useMemo` 依存に `theme` を追加し忘れるとテーマ切替でノード色が更新されない。グラフ系4ビュー（graph/vmodel/flow とプロセスレベル）で要確認
- **ライト時のグループ色設計**：`*-100` 背景 + `*-800` テキストを基準にコントラスト比 4.5:1 を目安に調整
- **既存 URL 状態との非干渉**：テーマ・言語は URL に載せず localStorage のみ（共有URLの再現性は現行どおりビュー状態に限定）
