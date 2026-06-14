import type { Language } from '../../types/aspice'

interface Props {
  purpose: string
  outcomeCount: number
  bpCount: number
  x: number
  y: number
  lang: Language
}

export function ProcessHoverTooltip({ purpose, outcomeCount, bpCount, x, y, lang }: Props) {
  return (
    <div
      style={{
        position: 'fixed',
        left: x + 16,
        top: y + 16,
        zIndex: 9999,
        pointerEvents: 'none',
        maxWidth: 280,
      }}
      className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 shadow-xl text-xs"
    >
      <p className="text-content leading-snug mb-2">{purpose}</p>
      <div className="flex gap-4 text-content-2">
        <span>
          {lang === 'en' ? 'Outcomes' : '成果数'}:{' '}
          <span className="text-content font-semibold">{outcomeCount}</span>
        </span>
        <span>
          {lang === 'en' ? 'BPs' : 'BP数'}:{' '}
          <span className="text-content font-semibold">{bpCount}</span>
        </span>
      </div>
    </div>
  )
}
