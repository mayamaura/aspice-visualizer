import { useState } from 'react'
import { Map, GitBranch, Network, Grid2x2, Workflow, Sun, Moon } from 'lucide-react'
import { ProcessMapView } from './components/ProcessMap/ProcessMapView'
import { RelationshipGraphView } from './components/RelationshipGraph/RelationshipGraphView'
import { VModelView } from './components/VModelView/VModelView'
import { MatrixView } from './components/MatrixView/MatrixView'
import { ArtifactFlowView } from './components/ArtifactFlowView/ArtifactFlowView'
import { GlobalSearch } from './components/common/GlobalSearch'
import { useLang } from './store/languageStore'
import { useTheme } from './store/themeStore'
import { useAppUrlState } from './hooks/useAppUrlState'
import type { NavigateTarget } from './utils/searchUtils'

type ViewId = 'map' | 'graph' | 'vmodel' | 'matrix' | 'flow'

const VIEWS = [
  { id: 'map' as ViewId, icon: Map, labelEn: 'Process Map', labelJa: 'プロセスマップ' },
  { id: 'graph' as ViewId, icon: GitBranch, labelEn: 'Relationship Graph', labelJa: 'リレーションシップグラフ' },
  { id: 'vmodel' as ViewId, icon: Network, labelEn: 'V-Model', labelJa: 'Vモデル' },
  { id: 'matrix' as ViewId, icon: Grid2x2, labelEn: 'Matrix', labelJa: 'マトリクス' },
  { id: 'flow' as ViewId, icon: Workflow, labelEn: 'Artifact Flow', labelJa: '成果物フロー' },
]

export default function App() {
  const { url, setView, setProcess, setGraphState, setFlowState } = useAppUrlState()
  const view = url.view
  const [lang, toggleLang] = useLang()
  const [theme, toggleTheme] = useTheme()
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
    <div className="flex flex-col h-screen overflow-hidden bg-bg text-content">
      {/* Top Nav */}
      <header className="flex items-center gap-4 px-5 py-3 bg-surface border-b border-line-subtle shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="text-accent font-mono text-xs font-bold bg-accent-bg border border-accent px-2 py-0.5 rounded">
            ASPICE 4.0
          </div>
          <div className="text-accent font-mono text-xs font-bold bg-accent-bg border border-accent px-2 py-0.5 rounded">
            CS 2.0
          </div>
          <span className="text-content font-semibold text-sm">
            {lang === 'en' ? 'Process Visualizer' : 'プロセスビジュアライザー'}
          </span>
        </div>

        {/* View Tabs */}
        <nav className="flex rounded-lg overflow-hidden border border-line">
          {VIEWS.map(({ id, icon: Icon, labelEn, labelJa }) => (
            <button
              key={id}
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-r border-line last:border-r-0 ${
                view === id ? 'bg-surface-2 text-content' : 'text-content-2 hover:text-content hover:bg-surface-2'
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
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-line text-content-2 hover:text-content hover:border-content-muted transition-colors"
            aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          >
            {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
          </button>

          {/* Language Toggle */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-content-2 hover:text-content hover:border-content-muted transition-colors"
          >
            <span className={lang === 'en' ? 'text-content' : 'text-content-muted'}>EN</span>
            <span className="text-content-muted">/</span>
            <span className={lang === 'ja' ? 'text-content' : 'text-content-muted'}>JA</span>
          </button>
        </div>
      </header>

      {/* View Content */}
      <main className="flex-1 overflow-hidden">
        {view === 'map' && (
          <ProcessMapView
            lang={lang}
            navigateTo={pendingNav}
            onNavConsumed={handleNavConsumed}
            initialProcessId={url.process}
            onProcessChange={setProcess}
          />
        )}
        {view === 'graph' && (
          <RelationshipGraphView
            lang={lang}
            navigateTo={pendingNav}
            onNavConsumed={handleNavConsumed}
            initialLevel={url.level}
            initialFocusId={url.focus}
            onGraphStateChange={setGraphState}
          />
        )}
        {view === 'vmodel' && (
          <VModelView lang={lang} navigateTo={pendingNav} onNavConsumed={handleNavConsumed} />
        )}
        {view === 'matrix' && (
          <MatrixView lang={lang} onNavigate={handleNavigate} />
        )}
        {view === 'flow' && (
          <ArtifactFlowView
            lang={lang}
            navigateTo={pendingNav}
            onNavConsumed={handleNavConsumed}
            initialFlowGroup={url.flowGroup}
            onFlowStateChange={setFlowState}
            onNavigate={handleNavigate}
          />
        )}
      </main>
    </div>
  )
}
