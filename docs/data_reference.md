# aspice_models.json データリファレンス

React アプリ開発者向けのデータ構造説明書。

---

## 概要

`aspice_models.json` は **Automotive SPICE** の2つのモデルを英日バイリンガルで統合した JSON ファイルです。

| モデル | バージョン | 収録内容 |
|---|---|---|
| PAM（Process Assessment Model） | v4.0 | 標準プロセス |
| CS-PAM（Cyber Security PAM） | v2.0 | サイバーセキュリティ特化プロセス |

Automotive SPICE はソフトウェア開発プロセスの能力を評価するための国際標準です（自動車業界向け ISO/IEC 33000 系）。

---

## トップレベル構造

```json
{
  "version": "4.0",
  "languages": ["en", "ja"],
  "process_groups": [...],      // プロセス次元
  "capability_levels": [...],   // 能力次元
  "information_items": [...]    // 情報項目マスタ（Annex B）
}
```

データは **2つの独立した次元** に分かれています。

---

## 次元1: プロセス次元（`process_groups`）

プロセスグループ → プロセス → BP/Outcome/情報項目 という階層。

### プロセスグループ一覧（12グループ）

| id | 名称（英語） | プロセス数 | 由来 |
|---|---|---|---|
| ACQ | Acquisition | 2 | PAM |
| SPL | Supply | 1 | PAM |
| SYS | System Engineering | 5 | PAM |
| SWE | Software Engineering | 6 | PAM |
| VAL | Validation | 1 | PAM |
| MLE | Machine Learning Engineering | 4 | PAM |
| HWE | Hardware Engineering | 4 | PAM |
| SUP | Supporting | 5 | PAM |
| MAN | Management | 4 | PAM |
| PIM | Process Improvement | 1 | PAM |
| REU | Reuse | 1 | PAM |
| SEC | Security | 4 | CS-PAM |

### ProcessGroup の構造

```json
{
  "id": "SYS",
  "name": { "en": "System Engineering", "ja": "システムエンジニアリング" },
  "processes": [ ...Process ]
}
```

### Process の構造

```json
{
  "id": "SYS.1",
  "name": { "en": "Requirements Elicitation", "ja": "要件抽出" },
  "purpose": { "en": "...", "ja": "..." },
  "outcomes": [ ...Outcome ],
  "base_practices": [ ...BasePractice ],
  "output_information_items": [ ...ProcessOutputItem ]
}
```

### Outcome（成果）

プロセスが達成すべき結果。BP・情報項目の両方がこの id に紐づく。

```json
{
  "id": 1,          // 1始まりの整数
  "text": { "en": "...", "ja": "..." }
}
```

### BasePractice（基本プラクティス、BP）

プロセスの実施方法を定義するアクティビティ。

```json
{
  "id": "SYS.1.BP1",
  "name": { "en": "...", "ja": "..." },
  "description": { "en": "...", "ja": "..." },
  "notes": [
    { "id": 1, "text": { "en": "...", "ja": "..." } }
  ],
  "outcome_refs": [1, 2]    // 対応する Outcome の id リスト
}
```

### ProcessOutputItem（プロセスの出力情報項目）

プロセスが生成する成果物の参照。詳細は `information_items` を引く。

```json
{
  "id": "17-00",          // information_items の id と対応
  "outcome_refs": [1, 3]  // 対応する Outcome の id リスト
}
```

---

## 次元2: 能力次元（`capability_levels`）

能力レベル（CL）→ プロセス属性（PA）→ GP/Achievement/情報項目 という階層。

### 能力レベル一覧

| level | 内容 |
|---|---|
| 0 | Incomplete（PAs なし） |
| 1 | Performed（PA 1.1） |
| 2 | Managed（PA 2.1, 2.2） |
| 3 | Established（PA 3.1, 3.2） |
| 4 | Predictable（PA 4.1, 4.2） |
| 5 | Optimizing（PA 5.1, 5.2） |

### CapabilityLevel の構造

```json
{
  "level": 2,
  "process_attributes": [ ...ProcessAttribute ]
}
```

### ProcessAttribute（プロセス属性、PA）

```json
{
  "id": "PA 2.1",
  "name": { "en": "...", "ja": "..." },
  "scope": { "en": "...", "ja": "..." },
  "achievements": [ ...Achievement ],
  "generic_practices": [ ...GenericPractice ],
  "output_information_items": [ ...CapabilityOutputItem ]
}
```

### Achievement（達成基準）

PA の充足を判断する基準。GP・情報項目の両方がこの id に紐づく。

```json
{
  "id": 1,
  "text": { "en": "...", "ja": "..." }
}
```

### GenericPractice（ジェネリックプラクティス、GP）

```json
{
  "id": "GP 2.1.1",
  "name": { "en": "...", "ja": "..." },
  "description": { "en": "...", "ja": "..." },
  "notes": [...],
  "achievement_refs": [1, 2]   // 対応する Achievement の id リスト
}
```

### CapabilityOutputItem（能力次元の出力情報項目）

```json
{
  "id": "17-00",
  "achievement_refs": [1]
}
```

---

## 情報項目マスタ（`information_items`）

122件。プロセス次元・能力次元の両方から `id` で参照される。

```json
{
  "id": "07-51",
  "name": { "en": "Measurement result", "ja": "測定結果" },
  "description": { "en": "Result of gathering qualitative or quantitative data, e.g., Process metric", "ja": "..." },
  "characteristics": [
    { "type": "bullet",   "en": "Measurements about the process' performance:\n- ability to...", "ja": "..." },
    { "type": "category", "en": "Project metric", "ja": "プロジェクトメトリクス" },
    { "type": "bullet",   "en": "Monitors key processes...", "ja": "..." },
    { "type": "note",     "en": "NOTE: Work breakdown structure may be used to...", "ja": "..." }
  ]
}
```

### フィールド説明

| フィールド | 必須 | 説明 |
|---|---|---|
| `id` | ✓ | 情報項目 ID（例: `"17-00"`） |
| `name` | ✓ | 名称（英日） |
| `description` | — | バレット列挙の前文テキスト（一部の情報項目のみ） |
| `characteristics` | ✓ | 特性の配列（0件以上） |

### characteristics の各エントリ

各エントリは `type` フィールドで種別を示す。

| `type` | 意味 | レンダリング例 |
|---|---|---|
| `"bullet"` | 箇条書き項目（`•`）。`\n- text` でサブ項目を含む場合あり | `•` で表示 |
| `"category"` | セクション見出し（例: "Project metric"）。バレット前に現れ、その後のバレットが配下に属する | 小見出し `##` 等 |
| `"note"` | 備考（NOTE:/Note:/備考:）。バレットと独立した補足説明 | 注記欄 |

```typescript
// characteristics エントリの型
interface Characteristic {
  type: "bullet" | "category" | "note";
  en: string;
  ja?: string;  // 日本語テキスト（ほぼ全件に存在）
}
```

#### bullet のサブ項目

`type: "bullet"` の `en`/`ja` フィールドには、`\n- text` 形式でサブ項目が折り込まれている。

```typescript
// サブ項目の展開例
const lines = char.en.split('\n');
// lines[0] = "Identifies aspects such as:"
// lines[1] = "- capacity"
// lines[2] = "- throughput"
```

---

## 共通型

### BilingualText

英語と日本語のペア。UI の言語切替に使う。

```typescript
interface BilingualText {
  en: string;
  ja: string;
}
```

---

## データの規模感

| 要素 | 件数 |
|---|---|
| プロセスグループ | 12 |
| プロセス（PAM） | 34 |
| プロセス（CS-PAM / SECグループ） | 4 |
| プロセス合計 | 38 |
| 能力レベル | 6（CL0〜CL5） |
| プロセス属性（PA） | 合計9個（CL1〜CL5） |
| 情報項目 | 122 |

---

## 参照関係の図

```
process_groups
  └── Process
        ├── Outcome (id: 1, 2, ...)
        ├── BasePractice  ──→ outcome_refs: [1, 2]
        └── ProcessOutputItem (id: "17-00") ──→ outcome_refs: [1]
                                                       │
                                              information_items
                                                (id: "17-00")
                                                       │
capability_levels                                      │
  └── ProcessAttribute                                 │
        ├── Achievement (id: 1, 2, ...)                │
        ├── GenericPractice ──→ achievement_refs: [1]  │
        └── CapabilityOutputItem (id: "17-00") ────────┘
              └─ achievement_refs: [1]
```

---

## TypeScript 型定義（参考）

```typescript
interface BilingualText { en: string; ja: string; }

interface AspiceModels {
  version: string;
  languages: string[];
  process_groups: ProcessGroup[];
  capability_levels: CapabilityLevel[];
  information_items: InformationItem[];
}

interface ProcessGroup {
  id: string;           // "SYS", "SWE", ...
  name: BilingualText;
  processes: Process[];
}

interface Process {
  id: string;           // "SYS.1", "SWE.3", ...
  name: BilingualText;
  purpose: BilingualText;
  outcomes: Outcome[];
  base_practices: BasePractice[];
  output_information_items: ProcessOutputItem[];
}

interface Outcome        { id: number; text: BilingualText; }
interface BasePractice   { id: string; name: BilingualText; description: BilingualText; notes: Note[]; outcome_refs: number[]; }
interface ProcessOutputItem { id: string; outcome_refs: number[]; }
interface Note           { id: number; text: BilingualText; }

interface CapabilityLevel    { level: number; process_attributes: ProcessAttribute[]; }
interface ProcessAttribute   { id: string; name: BilingualText; scope: BilingualText; achievements: Achievement[]; generic_practices: GenericPractice[]; output_information_items: CapabilityOutputItem[]; }
interface Achievement        { id: number; text: BilingualText; }
interface GenericPractice    { id: string; name: BilingualText; description: BilingualText; notes: Note[]; achievement_refs: number[]; }
interface CapabilityOutputItem { id: string; achievement_refs: number[]; }

interface Characteristic {
  type: "bullet" | "category" | "note";
  en: string;
  ja?: string;
}
interface InformationItem {
  id: string;
  name: BilingualText;
  description?: BilingualText;   // バレット前文（一部の情報項目のみ）
  characteristics: Characteristic[];
}
```
