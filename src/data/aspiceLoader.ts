/**
 * aspice_models.json との接触面を集約するローダーモジュール。
 * JSON を更新する際はこのファイルと src/types/aspiceRaw.ts のみを修正する。
 */
import type { RawAspiceModels } from '../types/aspiceRaw'
import type { Process, InformationItem, CapabilityLevel, ProcessGroup } from '../types/aspice'

// Vite の JSON インポート（型推論が不正確なため unknown 経由でキャスト）
import rawData from './aspice_models.json'

const data = rawData as unknown as RawAspiceModels

/**
 * 全プロセス一覧（group フィールドを付与してフラット化）。
 * JSON 内で group は ProcessGroup の親に定義されているため、ローダーで付加する。
 */
export const ALL_PROCESSES: Process[] = data.process_groups.flatMap((g) =>
  g.processes.map((p) => ({ ...p, group: g.id as ProcessGroup }))
)

/** 情報項目マスタ（Annex B 全件） */
export const INFORMATION_ITEMS: InformationItem[] = data.information_items

/** 能力次元データ（将来の拡張用） */
export const CAPABILITY_LEVELS: CapabilityLevel[] = data.capability_levels
