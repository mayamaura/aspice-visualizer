import { useCallback, useEffect, useState } from 'react'
import type { GraphLevel } from '../components/RelationshipGraph/graphUtils'
import { loadSetting, saveSetting, STORAGE_KEYS } from '../utils/persistence'
import type { ViewId } from '../data/viewMeta'

export interface AppUrlState {
  view: ViewId
  process: string | null
  level: GraphLevel
  focus: string | null
  flowGroup: string | null
}

const VALID_VIEWS: ViewId[] = ['map', 'graph', 'vmodel', 'matrix', 'flow']
const VALID_LEVELS: GraphLevel[] = ['process', 'bp', 'item']

function parseUrl(): AppUrlState {
  const p = new URLSearchParams(window.location.search)
  const viewParam = p.get('view') as ViewId
  const level = p.get('level') as GraphLevel

  // URL に view が無い場合のみ lastView を初期値に採用（URL指定があれば常にURL優先）
  let view: ViewId
  if (VALID_VIEWS.includes(viewParam)) {
    view = viewParam
  } else {
    const saved = loadSetting<ViewId | null>(STORAGE_KEYS.lastView, null)
    view = saved && VALID_VIEWS.includes(saved) ? saved : 'map'
  }

  return {
    view,
    process: p.get('process'),
    level: VALID_LEVELS.includes(level) ? level : 'process',
    focus: p.get('focus'),
    flowGroup: p.get('flowgroup'),
  }
}

function toSearch(state: AppUrlState): string {
  const p = new URLSearchParams()
  if (state.view !== 'map') p.set('view', state.view)
  if (state.process) p.set('process', state.process)
  if (state.level !== 'process') p.set('level', state.level)
  if (state.focus) p.set('focus', state.focus)
  if (state.flowGroup) p.set('flowgroup', state.flowGroup)
  const qs = p.toString()
  return qs ? `?${qs}` : window.location.pathname
}

export function useAppUrlState() {
  const [url, setUrl] = useState<AppUrlState>(parseUrl)

  useEffect(() => {
    const handler = () => setUrl(parseUrl())
    window.addEventListener('popstate', handler)
    return () => window.removeEventListener('popstate', handler)
  }, [])

  // ビュー切替は pushState（back/forward の履歴エントリを作る）
  const setView = useCallback((view: ViewId) => {
    saveSetting(STORAGE_KEYS.lastView, view)
    setUrl(prev => {
      const next: AppUrlState = { ...prev, view }
      history.pushState(null, '', toSearch(next))
      return next
    })
  }, [])

  // プロセス選択は replaceState（細かい操作で履歴を汚さない）
  const setProcess = useCallback((process: string | null) => {
    setUrl(prev => {
      const next: AppUrlState = { ...prev, process }
      history.replaceState(null, '', toSearch(next))
      return next
    })
  }, [])

  // グラフのレベル・フォーカス変更は replaceState
  const setGraphState = useCallback((level: GraphLevel, focus: string | null) => {
    setUrl(prev => {
      const next: AppUrlState = { ...prev, level, focus }
      history.replaceState(null, '', toSearch(next))
      return next
    })
  }, [])

  // 成果物フロービューの選択グループ変更は replaceState
  const setFlowState = useCallback((flowGroup: string | null) => {
    setUrl(prev => {
      const next: AppUrlState = { ...prev, flowGroup }
      history.replaceState(null, '', toSearch(next))
      return next
    })
  }, [])

  return { url, setView, setProcess, setGraphState, setFlowState }
}
