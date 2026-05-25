# 新機能開発計画

**対象:** Automotive SPICE 4.0 Process Visualizer  
**計画バージョン:** 1.0  
**作成日:** 2026-05-25  
**対応要件:** FR-5 / FR-6 / FR-7 / FR-1-10/11 / FR-2-18/19 / NFR-6

---

## 実装フェーズ概要

| Phase | 機能 | 要件ID | 優先度 | 概算工数 |
|---|---|---|---|---|
| 1 | グローバル検索 | FR-5 | ★★★ | M |
| 2 | プロセスマップ補強 | FR-1-10, FR-1-11 | ★★☆ | S |
| 3 | グラフビュー補強 | FR-2-18, FR-2-19 | ★★☆ | S |
| 4 | Vモデルビュー | FR-6 | ★★★ | L |
| 5 | クロスリファレンスマトリクス | FR-7 | ★★★ | L |
| 6 | URL状態共有 | NFR-6 | ★☆☆ | M |

フェーズ1を先に実装する理由: FR-1-11（検索からのハイライトジャンプ）と FR-5-3/4/5（検索結果クリック時のビュー遷移）はいずれも FR-5 のナビゲーションコールバック設計に依存するため。

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
- [ ] "SWE.2" と入力すると SWE.2 プロセスが最上位に表示される
- [ ] "BP.SWE.1.1" 相当のBP名を入力するとBPカテゴリに結果が出る
- [ ] 情報項目ID "17-08" を入力すると情報項目カテゴリに結果が出る
- [ ] 日本語クエリ（例: "ソフトウェア要件"）でも検索できる
- [ ] 結果クリックでプロセスマップに遷移し詳細パネルが開く
- [ ] ESCキーで検索ドロップダウンが閉じる

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
- [ ] 詳細パネルの最下部に「関連プロセス」セクションが表示される
- [ ] 共通の情報項目IDが折りたたみ表示で確認できる
- [ ] 関連プロセス名をクリックすると、そのプロセスの詳細パネルに遷移する
- [ ] 検索からジャンプした際、対象カードが2秒間ハイライト（黄色リング）される

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
- [ ] ツールバーの「エクスポート」ボタンクリックでPNG画像がダウンロードされる
- [ ] プロセスレベルでノードをホバーするとツールチップが表示される
- [ ] ツールチップには目的テキスト（先頭1文）・成果数・BP数が表示される
- [ ] ツールチップは現在の言語（EN/JA）に対応する

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
- [ ] ヘッダータブに「Vモデル」が表示され切替できる
- [ ] SYS/SWE/HWEがV字に並び、対応関係が水平点線で示される
- [ ] VAL.1が右上に配置される
- [ ] ノードをクリックすると右側に DetailPanel が表示される
- [ ] グループカラーが適用されている

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
- [ ] ヘッダータブに「マトリクス」が表示され切替できる
- [ ] 全38プロセス×全情報項目が表示される
- [ ] 出力セルが塗りつぶされており、非出力セルは空欄
- [ ] 行ヘッダーと列ヘッダーがスクロール時も固定される
- [ ] グループフィルターで表示行を絞り込める
- [ ] セルクリックでポップアップが表示される
- [ ] 列ヘッダーの情報項目IDクリックでグラフビューの情報項目起点に遷移できる

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
    → すべてのビューが揃った後に着手するとパラメータ設計が安定する
```

---

## 各フェーズの着手確認事項

フェーズ着手前に以下を確認すること：
- `main` ブランチが最新であること（`git pull`）
- `npm run type-check` がエラーゼロであること
- `npm run dev` でアプリが正常起動することを確認
