/**
 * aspice_models.json の構造に忠実な Raw 型定義。
 * JSON が更新されたときに型エラーでローダー（aspiceLoader.ts）の修正箇所を特定できる。
 * アプリ内部型（aspice.ts）とは独立して管理する。
 */

export interface RawBilingualText {
  en: string
  ja: string
}

export interface RawNote {
  id: number
  text: RawBilingualText
}

export interface RawOutcome {
  id: number
  text: RawBilingualText
}

export interface RawBasePractice {
  id: string
  name: RawBilingualText
  description: RawBilingualText
  notes: RawNote[]
  outcome_refs: number[]
}

export interface RawProcessOutputItem {
  id: string
  outcome_refs: number[]
}

export interface RawProcess {
  id: string
  name: RawBilingualText
  purpose: RawBilingualText
  outcomes: RawOutcome[]
  base_practices: RawBasePractice[]
  output_information_items: RawProcessOutputItem[]
}

export interface RawProcessGroup {
  id: string
  name: RawBilingualText
  processes: RawProcess[]
}

export interface RawCharacteristic {
  type: 'bullet' | 'category' | 'note'
  en: string
  ja?: string
}

export interface RawInformationItem {
  id: string
  name: RawBilingualText
  description?: RawBilingualText
  characteristics: RawCharacteristic[]
}

// 能力次元
export interface RawAchievement {
  id: number
  text: RawBilingualText
}

export interface RawGenericPractice {
  id: string
  name: RawBilingualText
  description: RawBilingualText
  notes: RawNote[]
  achievement_refs: number[]
}

export interface RawCapabilityOutputItem {
  id: string
  achievement_refs: number[]
}

export interface RawProcessAttribute {
  id: string
  name: RawBilingualText
  scope: RawBilingualText
  achievements: RawAchievement[]
  generic_practices: RawGenericPractice[]
  output_information_items: RawCapabilityOutputItem[]
}

export interface RawCapabilityLevel {
  level: number
  name?: RawBilingualText
  description?: RawBilingualText
  process_attributes: RawProcessAttribute[]
}

export interface RawAspiceModels {
  version: string
  languages: string[]
  process_groups: RawProcessGroup[]
  capability_levels: RawCapabilityLevel[]
  information_items: RawInformationItem[]
}
