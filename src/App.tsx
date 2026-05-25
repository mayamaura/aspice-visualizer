import { useState } from 'react'
import { Map, GitBranch } from 'lucide-react'
import { ProcessMapView } from './components/ProcessMap/ProcessMapView'
import { RelationshipGraphView } from './components/RelationshipGraph/RelationshipGraphView'
import { GlobalSearch } from './components/common/GlobalSearch'
import { useLang } from './store/languageStore'
import type { NavigateTarget } from './utils/searchUtils'

type ViewId = 'map' | 'graph'

const VIEWS = [
  { id: 'map' as ViewId, icon: Map, labelEn: 'Process Map', labelJa: 'プロセスマップ' },
  { id: 'graph' as ViewId, icon: GitBranch, labelEn: 'Relationship Graph', labelJa: 'リレーションシップグラフ' },
]

export default function App() {
  const [view, setView] = useState<ViewId>('map')
  const [lang, toggleLang] = useLang()
  const [pendingNav, setPendingNav] = useState<NavigateTarget | null>(null)

  const handleNavigate = (target: NavigateTarget) => {
    if (target.type === 'process') {
      setView('map')
    } else {
      setView('graph')
    }
    setPendingNav(target)
  }

  const handleNavConsumed = () => setPendingNav(null)

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-950 text-gray-100">
      {/* Top Nav */}
      <header className="flex items-center gap-4 px-5 py-3 bg-gray-900 border-b border-gray-800 shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="text-blue-400 font-mono text-xs font-bold bg-blue-950 border border-blue-700 px-2 py-0.5 rounded">
            ASPICE 4.0
          </div>
          <span className="text-gray-200 font-semibold text-sm">
            {lang === 'en' ? 'Process Visualizer' : 'プロセスビジュアライザー'}
          </span>
        </div>

        {/* View Tabs */}
        <nav className="flex rounded-lg overflow-hidden border border-gray-700">
          {VIEWS.map(({ id, icon: Icon, labelEn, labelJa }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-r border-gray-700 last:border-r-0 ${
                view === id ? 'bg-gray-700 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={13} />
              {lang === 'en' ? labelEn : labelJa}
            </button>
          ))}
        </nav>

        {/* Global Search */}
        <GlobalSearch lang={lang} onNavigate={handleNavigate} />

        <div className="ml-auto flex items-center gap-3">
          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-700 text-xs font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
          >
            <span className={lang === 'en' ? 'text-white' : 'text-gray-500'}>EN</span>
            <span className="text-gray-600">/</span>
            <span className={lang === 'ja' ? 'text-white' : 'text-gray-500'}>JA</span>
          </button>
        </div>
      </header>

      {/* View Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'map' && (
          <ProcessMapView lang={lang} navigateTo={pendingNav} onNavConsumed={handleNavConsumed} />
        )}
        {view === 'graph' && (
          <RelationshipGraphView lang={lang} navigateTo={pendingNav} onNavConsumed={handleNavConsumed} />
        )}
      </main>
    </div>
  )
}
