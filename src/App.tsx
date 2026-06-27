import { useRef, useState } from 'react'
import { Sun, Moon, HelpCircle, Link2 } from 'lucide-react'
import { ProcessMapView } from './components/ProcessMap/ProcessMapView'
import { RelationshipGraphView } from './components/RelationshipGraph/RelationshipGraphView'
import { VModelView } from './components/VModelView/VModelView'
import { MatrixView } from './components/MatrixView/MatrixView'
import { ArtifactFlowView } from './components/ArtifactFlowView/ArtifactFlowView'
import { GlobalSearch, type GlobalSearchHandle } from './components/common/GlobalSearch'
import { HelpOverlay } from './components/common/HelpOverlay'
import { OnboardingBanner } from './components/common/OnboardingBanner'
import { Toast } from './components/common/Toast'
import { useLang } from './store/languageStore'
import { useTheme } from './store/themeStore'
import { toast } from './store/toastStore'
import { useAppUrlState } from './hooks/useAppUrlState'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'
import type { NavigateTarget } from './utils/searchUtils'
import { VIEWS } from './data/viewMeta'

export default function App() {
  const { url, setView, setProcess, setGraphState, setFlowState } = useAppUrlState()
  const view = url.view
  const [lang, toggleLang] = useLang()
  const [theme, toggleTheme] = useTheme()
  const [pendingNav, setPendingNav] = useState<NavigateTarget | null>(null)
  const searchRef = useRef<GlobalSearchHandle>(null)
  const [helpOpen, setHelpOpen] = useState(false)

  useKeyboardShortcuts({
    onSearchFocus: () => searchRef.current?.focus(),
    onSelectView: (index) => { const v = VIEWS[index]; if (v) setView(v.id) },
    onToggleHelp: () => setHelpOpen((o) => !o),
  })

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
      <header className="flex flex-wrap items-center gap-4 px-5 py-3 bg-surface border-b border-line-subtle shrink-0">
        <div className="flex items-center gap-2 mr-4">
          <div className="text-accent font-mono text-xs font-bold bg-accent-bg border border-accent px-2 py-0.5 rounded">
            ASPICE 4.0
          </div>
          <div className="text-accent font-mono text-xs font-bold bg-accent-bg border border-accent px-2 py-0.5 rounded">
            CS 2.0
          </div>
          <span className="hidden lg:inline text-content font-semibold text-sm">
            {lang === 'en' ? 'Process Visualizer' : 'プロセスビジュアライザー'}
          </span>
        </div>

        {/* View Tabs */}
        <nav className="flex rounded-lg overflow-hidden border border-line" role="tablist">
          {VIEWS.map(({ id, icon: Icon, labelEn, labelJa }) => (
            <button
              key={id}
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors border-r border-line last:border-r-0 ${
                view === id ? 'bg-surface-2 text-content' : 'text-content-2 hover:text-content hover:bg-surface-2'
              }`}
            >
              <Icon size={13} />
              <span className="hidden md:inline">{lang === 'en' ? labelEn : labelJa}</span>
            </button>
          ))}
        </nav>

        {/* Global Search */}
        <GlobalSearch ref={searchRef} lang={lang} onNavigate={handleNavigate} />

        <div className="ml-auto flex items-center gap-3">
          {/* Copy link button */}
          <button
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(window.location.href)
                toast(lang === 'en' ? 'Link copied' : 'リンクをコピーしました')
              } catch {
                toast(lang === 'en' ? 'Copy failed' : 'コピーに失敗しました')
              }
            }}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-line text-content-2 hover:text-content hover:border-content-muted transition-colors"
            aria-label={lang === 'en' ? 'Copy shareable link' : '共有リンクをコピー'}
          >
            <Link2 size={13} />
          </button>

          {/* Help Button */}
          <button
            onClick={() => setHelpOpen(true)}
            className="flex items-center justify-center w-7 h-7 rounded-lg border border-line text-content-2 hover:text-content hover:border-content-muted transition-colors"
            aria-label={lang === 'en' ? 'Keyboard shortcuts and help' : 'ヘルプ'}
          >
            <HelpCircle size={13} />
          </button>

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
            aria-label={lang === 'en' ? 'Switch language' : '言語を切り替え'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line text-xs font-medium text-content-2 hover:text-content hover:border-content-muted transition-colors"
          >
            <span className={lang === 'en' ? 'text-content' : 'text-content-muted'}>EN</span>
            <span className="text-content-muted">/</span>
            <span className={lang === 'ja' ? 'text-content' : 'text-content-muted'}>JA</span>
          </button>
        </div>
      </header>

      {/* Onboarding Banner (first visit only) */}
      <OnboardingBanner lang={lang} onOpenHelp={() => setHelpOpen(true)} />

      {/* View Content */}
      <main className="flex-1 overflow-hidden" role="tabpanel">
        <div key={view} className="h-full animate-fade-in">
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
        </div>
      </main>

      {/* Help Overlay */}
      <HelpOverlay open={helpOpen} onClose={() => setHelpOpen(false)} lang={lang} />

      {/* Toast notifications */}
      <Toast />
    </div>
  )
}
