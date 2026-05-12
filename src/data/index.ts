import type { Process } from '../types/aspice'
import { SYS_PROCESSES } from './processes/sys'
import { SWE_PROCESSES } from './processes/swe'
import { HWE_PROCESSES } from './processes/hwe'
import { MAN_PROCESSES } from './processes/man'
import { SUP_PROCESSES } from './processes/sup'
import { ACQ_PROCESSES, SPL_PROCESSES, REU_PROCESSES } from './processes/acq_spl_reu'

export const ALL_PROCESSES: Process[] = [
  ...SYS_PROCESSES,
  ...SWE_PROCESSES,
  ...HWE_PROCESSES,
  ...MAN_PROCESSES,
  ...SUP_PROCESSES,
  ...ACQ_PROCESSES,
  ...SPL_PROCESSES,
  ...REU_PROCESSES,
]

export { PROCESS_GROUPS } from './processGroups'
export { SYS_PROCESSES, SWE_PROCESSES, HWE_PROCESSES, MAN_PROCESSES, SUP_PROCESSES, ACQ_PROCESSES, SPL_PROCESSES, REU_PROCESSES }
