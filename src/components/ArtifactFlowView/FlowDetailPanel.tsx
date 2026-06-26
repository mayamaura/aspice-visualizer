import { X } from 'lucide-react'
import type { Language } from '../../types/aspice'
import type { NavigateTarget } from '../../utils/searchUtils'
import { INFORMATION_ITEMS } from '../../data'

export interface FlowSelection {
  type: 'link' | 'rightNode'
  title: string
  itemIds: string[]
}

interface Props {
  selection: FlowSelection
  lang: Language
  onClose: () => void
  onNavigate: (target: NavigateTarget) => void
}

export function FlowDetailPanel({ selection, lang, onClose, onNavigate }: Props) {
  return (
    <div className="w-80 flex flex-col bg-surface border-l border-line-subtle overflow-hidden shrink-0 animate-panel-in">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-line-subtle">
        <span className="text-xs font-semibold text-content truncate max-w-[200px]">
          {selection.title}
        </span>
        <button
          onClick={onClose}
          aria-label={lang === 'en' ? 'Close' : '閉じる'}
          className="text-content-muted hover:text-content-2 transition-colors ml-2 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* 件数バッジ */}
      <div className="px-4 py-2 border-b border-line-subtle">
        <span className="text-xs text-content-2">
          {selection.itemIds.length}{' '}
          {lang === 'en' ? 'information item(s)' : '件の情報項目'}
        </span>
      </div>

      {/* 情報項目一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        {selection.itemIds.map((id) => {
          const item = INFORMATION_ITEMS.find((i) => i.id === id)
          const name = item
            ? lang === 'en'
              ? item.name.en
              : item.name.ja
            : id
          return (
            <button
              key={id}
              onClick={() => onNavigate({ type: 'item', itemId: id })}
              className="w-full text-left flex items-start gap-2 px-3 py-2 rounded-md bg-surface-2 hover:bg-line transition-colors group"
            >
              <span className="text-item font-mono text-xs shrink-0 mt-0.5">{id}</span>
              <span className="text-content-2 text-xs leading-snug group-hover:text-content">
                {name}
              </span>
            </button>
          )
        })}
      </div>

      {/* フッター注記 */}
      <div className="px-4 py-2 border-t border-line-subtle">
        <p className="text-xs text-content-muted">
          {lang === 'en'
            ? 'Click an item to view in Relationship Graph'
            : '情報項目をクリックするとリレーションシップグラフに遷移します'}
        </p>
      </div>
    </div>
  )
}
