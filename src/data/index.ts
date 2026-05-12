import type { Process } from '../types/aspice'
import { SWE_PROCESSES } from './processes/swe'
import { SYS_PROCESSES } from './processes/sys'

export const ALL_PROCESSES: Process[] = [
  ...SYS_PROCESSES,
  ...SWE_PROCESSES,
]

export { PROCESS_GROUPS } from './processGroups'
export { SWE_PROCESSES, SYS_PROCESSES }
