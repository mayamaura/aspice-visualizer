export type ProcessGroup = 'SYS' | 'SWE' | 'HWE' | 'MAN' | 'SUP' | 'ACQ' | 'SPL' | 'REU'

export type Language = 'en' | 'ja'

export interface BilingualText {
  en: string
  ja: string
}

export interface InformationItem {
  id: string              // e.g. "17-08"
  name: BilingualText
  characteristics: BilingualText[]
}

export interface InformationItemRef {
  itemId: string          // references InformationItem.id
  note?: BilingualText
}

export interface BasePractice {
  id: string              // e.g. "SWE.1.BP1"
  name: BilingualText
  description: BilingualText
  supportsOutcomes: string[]     // Outcome IDs e.g. ["SWE.1.1", "SWE.1.2"]
  outputs: InformationItemRef[]
  inputs: InformationItemRef[]
}

export interface Outcome {
  id: string              // e.g. "SWE.1.1"
  description: BilingualText
}

export interface Process {
  id: string              // e.g. "SWE.1"
  name: BilingualText
  group: ProcessGroup
  purpose: BilingualText
  outcomes: Outcome[]
  basePractices: BasePractice[]
  outputItems: InformationItem[]
}

export interface ProcessGroup_Meta {
  id: ProcessGroup
  name: BilingualText
  color: string           // Tailwind bg color class
  textColor: string
  borderColor: string
}
