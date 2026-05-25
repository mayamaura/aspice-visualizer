import type { Language, Process, InformationItem } from '../types/aspice'
import { ALL_PROCESSES, INFORMATION_ITEMS } from '../data'

export type SearchResultType = 'process' | 'bp' | 'item'

export interface SearchResult {
  type: SearchResultType
  id: string
  label: string
  sublabel: string
  processId?: string
}

export type NavigateTarget =
  | { type: 'process'; processId: string }
  | { type: 'bp'; processId: string; bpId: string }
  | { type: 'item'; itemId: string }

const MAX_RESULTS = 20

function matchesQuery(q: string, ...targets: string[]): boolean {
  return targets.some((t) => t.toLowerCase().includes(q))
}

export function search(query: string, lang: Language): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []

  const results: SearchResult[] = []

  for (const p of ALL_PROCESSES as Process[]) {
    if (results.length >= MAX_RESULTS) break
    if (matchesQuery(q, p.id, p.name.en, p.name.ja, p.purpose.en, p.purpose.ja)) {
      results.push({
        type: 'process',
        id: p.id,
        label: `${p.id} ${lang === 'en' ? p.name.en : p.name.ja}`,
        sublabel: p.group,
      })
    }
  }

  for (const p of ALL_PROCESSES as Process[]) {
    for (const bp of p.base_practices) {
      if (results.length >= MAX_RESULTS) break
      if (matchesQuery(q, bp.id, bp.name.en, bp.name.ja, bp.description.en, bp.description.ja)) {
        results.push({
          type: 'bp',
          id: bp.id,
          label: `${bp.id} ${lang === 'en' ? bp.name.en : bp.name.ja}`,
          sublabel: p.id,
          processId: p.id,
        })
      }
    }
  }

  for (const item of INFORMATION_ITEMS as InformationItem[]) {
    if (results.length >= MAX_RESULTS) break
    if (
      matchesQuery(
        q,
        item.id,
        item.name.en,
        item.name.ja,
        item.description?.en ?? '',
        item.description?.ja ?? ''
      )
    ) {
      results.push({
        type: 'item',
        id: item.id,
        label: `${item.id} ${lang === 'en' ? item.name.en : item.name.ja}`,
        sublabel: '',
      })
    }
  }

  return results
}
