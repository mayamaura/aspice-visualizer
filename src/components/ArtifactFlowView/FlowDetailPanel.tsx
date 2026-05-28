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
    <div className="w-80 flex flex-col bg-gray-900 border-l border-gray-800 overflow-hidden shrink-0">
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
        <span className="text-xs font-semibold text-gray-200 truncate max-w-[200px]">
          {selection.title}
        </span>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 transition-colors ml-2 shrink-0"
        >
          <X size={14} />
        </button>
      </div>

      {/* 件数バッジ */}
      <div className="px-4 py-2 border-b border-gray-800">
        <span className="text-xs text-gray-400">
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
              className="w-full text-left flex items-start gap-2 px-3 py-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors group"
            >
              <span className="text-emerald-400 font-mono text-xs shrink-0 mt-0.5">{id}</span>
              <span className="text-gray-300 text-xs leading-snug group-hover:text-white">
                {name}
              </span>
            </button>
          )
        })}
      </div>

      {/* フッター注記 */}
      <div className="px-4 py-2 border-t border-gray-800">
        <p className="text-xs text-gray-600">
          {lang === 'en'
            ? 'Click an item to view in Relationship Graph'
            : '情報項目をクリックするとリレーションシップグラフに遷移します'}
        </p>
      </div>
    </div>
  )
}
