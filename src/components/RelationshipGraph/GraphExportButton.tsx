import { toPng } from 'html-to-image'
import type { RefObject } from 'react'
import type { Language } from '../../types/aspice'

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  lang: Language
}

export function GraphExportButton({ containerRef, lang }: Props) {
  const handleExport = async () => {
    if (!containerRef.current) return
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const dataUrl = await toPng(containerRef.current, { backgroundColor: '#111827' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `aspice-graph-${timestamp}.png`
      a.click()
    } catch {
      // export failure is non-fatal
    }
  }

  return (
    <button
      onClick={handleExport}
      title={lang === 'en' ? 'Export graph as PNG' : 'グラフをPNGで保存'}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-gray-600 text-gray-300 hover:text-white hover:border-gray-400 transition-colors bg-gray-800 shrink-0"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      {lang === 'en' ? 'Export PNG' : 'PNGエクスポート'}
    </button>
  )
}
