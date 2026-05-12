import type { ProcessGroup_Meta } from '../types/aspice'

export const PROCESS_GROUPS: ProcessGroup_Meta[] = [
  {
    id: 'SYS',
    name: { en: 'System Engineering', ja: 'システムエンジニアリング' },
    color: 'bg-blue-900',
    textColor: 'text-blue-200',
    borderColor: 'border-blue-600',
  },
  {
    id: 'SWE',
    name: { en: 'Software Engineering', ja: 'ソフトウェアエンジニアリング' },
    color: 'bg-violet-900',
    textColor: 'text-violet-200',
    borderColor: 'border-violet-600',
  },
  {
    id: 'HWE',
    name: { en: 'Hardware Engineering', ja: 'ハードウェアエンジニアリング' },
    color: 'bg-cyan-900',
    textColor: 'text-cyan-200',
    borderColor: 'border-cyan-600',
  },
  {
    id: 'MAN',
    name: { en: 'Management', ja: 'マネジメント' },
    color: 'bg-amber-900',
    textColor: 'text-amber-200',
    borderColor: 'border-amber-600',
  },
  {
    id: 'SUP',
    name: { en: 'Support', ja: 'サポート' },
    color: 'bg-green-900',
    textColor: 'text-green-200',
    borderColor: 'border-green-600',
  },
  {
    id: 'ACQ',
    name: { en: 'Acquisition', ja: '調達' },
    color: 'bg-orange-900',
    textColor: 'text-orange-200',
    borderColor: 'border-orange-600',
  },
  {
    id: 'SPL',
    name: { en: 'Supply', ja: '供給' },
    color: 'bg-rose-900',
    textColor: 'text-rose-200',
    borderColor: 'border-rose-600',
  },
  {
    id: 'REU',
    name: { en: 'Reuse', ja: '再利用' },
    color: 'bg-teal-900',
    textColor: 'text-teal-200',
    borderColor: 'border-teal-600',
  },
]
