import type { ProcessGroup } from '../types/aspice'

export function cssVar(name: string): string {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v ? `rgb(${v})` : 'transparent'
}

export function groupColorHex(groupId: ProcessGroup, role: 'surface' | 'line' | 'text'): string {
  return cssVar(`--grp-${groupId.toLowerCase()}-${role}`)
}
