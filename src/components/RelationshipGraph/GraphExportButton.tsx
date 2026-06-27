import { toPng } from 'html-to-image'
import { Download } from 'lucide-react'
import type { RefObject } from 'react'
import type { Language } from '../../types/aspice'
import { cssVar } from '../../utils/themeColors'
import { toast } from '../../store/toastStore'

interface Props {
  containerRef: RefObject<HTMLDivElement | null>
  lang: Language
}

export function GraphExportButton({ containerRef, lang }: Props) {
  const handleExport = async () => {
    if (!containerRef.current) return
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const dataUrl = await toPng(containerRef.current, { backgroundColor: cssVar('--color-bg') })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = `aspice-graph-${timestamp}.png`
      a.click()
      toast(lang === 'en' ? 'Graph exported as PNG' : 'グラフをPNGで保存しました')
    } catch {
      // export failure is non-fatal
    }
  }

  return (
    <button
      onClick={handleExport}
      title={lang === 'en' ? 'Export graph as PNG' : 'グラフをPNGで保存'}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-line text-content-2 hover:text-content hover:border-line-subtle transition-colors bg-surface-2 shrink-0"
    >
      <Download className="h-3.5 w-3.5" />
      {lang === 'en' ? 'Export PNG' : 'PNGエクスポート'}
    </button>
  )
}
