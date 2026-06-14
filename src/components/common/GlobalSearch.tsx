import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { search, type SearchResult, type SearchResultType, type NavigateTarget } from '../../utils/searchUtils'
import type { Language } from '../../types/aspice'

const CATEGORY_LABEL: Record<SearchResultType, { en: string; ja: string }> = {
  process: { en: 'Process', ja: 'プロセス' },
  bp: { en: 'Base Practice', ja: '基本プラクティス' },
  item: { en: 'Information Item', ja: '情報項目' },
}

const CATEGORY_COLOR: Record<SearchResultType, string> = {
  process: 'text-blue-400',
  bp: 'text-violet-400',
  item: 'text-emerald-400',
}

interface Props {
  lang: Language
  onNavigate: (target: NavigateTarget) => void
}

export function GlobalSearch({ lang, onNavigate }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(() => {
      setResults(search(query, lang))
    }, 200)
    return () => clearTimeout(timer)
  }, [query, lang])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setQuery('')
      }
    }
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKey)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'process') {
      onNavigate({ type: 'process', processId: result.id })
    } else if (result.type === 'bp' && result.processId) {
      onNavigate({ type: 'bp', processId: result.processId, bpId: result.id })
    } else if (result.type === 'item') {
      onNavigate({ type: 'item', itemId: result.id })
    }
    setOpen(false)
    setQuery('')
  }

  const handleClear = () => {
    setQuery('')
    setResults([])
    inputRef.current?.focus()
  }

  const grouped = (['process', 'bp', 'item'] as SearchResultType[])
    .map((type) => ({ type, items: results.filter((r) => r.type === type) }))
    .filter((g) => g.items.length > 0)

  const placeholder = lang === 'en' ? 'Search processes, BPs, items…' : 'プロセス / BP / 情報項目を検索…'

  return (
    <div ref={containerRef} className="relative">
      {/* 検索ボックス */}
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-line bg-surface-2 w-64 focus-within:border-content-muted transition-colors">
        <Search size={13} className="text-content-muted shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => { if (query) setOpen(true) }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-xs text-content placeholder-content-muted outline-none min-w-0"
        />
        {query && (
          <button onClick={handleClear} className="text-content-muted hover:text-content-2 shrink-0">
            <X size={12} />
          </button>
        )}
      </div>

      {/* ドロップダウン */}
      {open && query.trim() && (
        <div className="absolute top-full mt-1 left-0 w-96 bg-surface border border-line rounded-lg shadow-2xl z-50 overflow-hidden">
          {grouped.length === 0 ? (
            <div className="px-4 py-3 text-xs text-content-muted">
              {lang === 'en' ? 'No results found.' : '結果が見つかりませんでした。'}
            </div>
          ) : (
            <>
              {grouped.map(({ type, items }) => (
                <div key={type}>
                  {/* カテゴリ見出し */}
                  <div className="px-3 py-1.5 bg-surface-2/60 border-b border-line/50">
                    <span className={`text-xs font-semibold ${CATEGORY_COLOR[type]}`}>
                      {lang === 'en' ? CATEGORY_LABEL[type].en : CATEGORY_LABEL[type].ja}
                      <span className="ml-1 text-content-muted font-normal">({items.length})</span>
                    </span>
                  </div>
                  {/* 結果リスト */}
                  {items.map((result) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => handleResultClick(result)}
                      className="w-full text-left px-4 py-2 hover:bg-surface-2 transition-colors border-b border-line-subtle/50 last:border-b-0"
                    >
                      <div className="text-xs text-content truncate">{result.label}</div>
                      {result.sublabel && (
                        <div className="text-xs text-content-muted mt-0.5">{result.sublabel}</div>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {results.length >= 20 && (
                <div className="px-4 py-2 text-xs text-content-muted bg-surface-2/40 border-t border-line/50">
                  {lang === 'en' ? 'Showing first 20 results. Refine your query.' : '先頭20件を表示。クエリを絞り込んでください。'}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}
