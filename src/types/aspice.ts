export type ProcessGroup = 'SYS' | 'SWE' | 'HWE' | 'MAN' | 'SUP' | 'ACQ' | 'SPL' | 'REU' | 'VAL' | 'MLE' | 'PIM' | 'SEC'

export type Language = 'en' | 'ja'

export interface BilingualText {
  en: string
  ja: string
}

export interface Note {
  id: number
  text: BilingualText
}

export interface Outcome {
  id: number
  text: BilingualText
}

export interface BasePractice {
  id: string
  name: BilingualText
  description: BilingualText
  notes: Note[]
  outcome_refs: number[]
}

export interface ProcessOutputItem {
  id: string
  outcome_refs: number[]
}

export interface Characteristic {
  type: 'bullet' | 'category' | 'note'
  en: string
  ja?: string
}

export interface InformationItem {
  id: string
  name: BilingualText
  description?: BilingualText
  characteristics: Characteristic[]
}

export interface Process {
  id: string
  name: BilingualText
  group: ProcessGroup
  purpose: BilingualText
  outcomes: Outcome[]
  base_practices: BasePractice[]
  output_information_items: ProcessOutputItem[]
}

export interface ProcessGroup_Meta {
  id: ProcessGroup
  name: BilingualText
  color: string
  textColor: string
  borderColor: string
}

// 能力次元（将来の拡張用）
export interface Achievement {
  id: number
  text: BilingualText
}

export interface GenericPractice {
  id: string
  name: BilingualText
  description: BilingualText
  notes: Note[]
  achievement_refs: number[]
}

export interface CapabilityOutputItem {
  id: string
  achievement_refs: number[]
}

export interface ProcessAttribute {
  id: string
  name: BilingualText
  scope: BilingualText
  achievements: Achievement[]
  generic_practices: GenericPractice[]
  output_information_items: CapabilityOutputItem[]
}

export interface CapabilityLevel {
  level: number
  name?: BilingualText
  description?: BilingualText
  process_attributes: ProcessAttribute[]
}
