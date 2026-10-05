import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUpRight, Check, Languages, Menu, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../../features/progress/ProgressProvider'
import Dialog from '../ui/Dialog'
import ErrorBoundary from '../ui/ErrorBoundary'
import { useLocale } from '../../features/locale/LocaleProvider'

import { routeLoader } from '../../routeLoaders'
const ContentBoundary = lazy(() => import('../../content/runtime/ContentBoundary'))
const SearchDialog = lazy(() => import('../../features/search/SearchDialog'))
const navigation = [['nav.learn', '/learn'], ['nav.projects', '/projects'], ['nav.explore', '/explore'], ['nav.playground', '/playground'], ['nav.challenges', '/challenges'], ['nav.cheatSheet', '/cheat-sheet']]

export default function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetDone, setResetDone] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const progress = useProgress()
  const { locale, toggleLocale, t } = useLocale()
  useEffect(() => {
    const shortcut = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setSearchOpen(value => !value) }
      if (event.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', shortcut)
    return () => window.removeEventListener('keydown', shortcut)
  }, [])
  useEffect(() => {
    setMobileOpen(false)
    const frame = requestAnimationFrame(() => {
      if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView()
      else { window.scrollTo(0, 0); document.getElementById('main-content')?.focus({ preventScroll: true }) }
    })
    return () => cancelAnimationFrame(frame)
  }, [location.pathname, location.hash])
  useEffect(() => {
    // Load route code and content concurrently on direct entry/navigation, before the boundary renders.
    void routeLoader(location.pathname)?.().catch(() => {})
    if (location.pathname !== '/') void import('../../content/runtime/ContentBoundary').then(module => module.preloadContent(location.pathname + location.search, locale)).catch(() => {})
  }, [location.pathname, location.search, locale])
  useEffect(() => {
    const timers = new Map<HTMLAnchorElement, ReturnType<typeof setTimeout>>()
    const warm = (event: Event) => {
      const link = (event.target as Element).closest?.('a[href]') as HTMLAnchorElement | null
      if (!link || link.origin !== locationOrigin || timers.has(link)) return
      const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection
      if (connection?.saveData || ['slow-2g', '2g'].includes(connection?.effectiveType ?? '')) return
      timers.set(link, setTimeout(() => {
        void routeLoader(link.pathname)?.().catch(() => {})
        // Do not download the entire reference catalog speculatively.
        if (link.pathname.startsWith('/learn') || link.pathname.startsWith('/projects') || link.pathname === '/start')
          void import('../../content/runtime/ContentBoundary').then(module => module.preloadContent(link.pathname + link.search, locale)).catch(() => {})
      }, event.type === 'focusin' ? 0 : 120))
    }
    const cancel = (event: Event) => {
      const link = (event.target as Element).closest?.('a[href]') as HTMLAnchorElement | null
      if (link) { clearTimeout(timers.get(link)); timers.delete(link) }
    }
    const locationOrigin = window.location.origin
    document.addEventListener('pointerover', warm); document.addEventListener('focusin', warm)
    document.addEventListener('pointerout', cancel); document.addEventListener('focusout', cancel)
    return () => { timers.forEach(clearTimeout); document.removeEventListener('pointerover', warm); document.removeEventListener('focusin', warm); document.removeEventListener('pointerout', cancel); document.removeEventListener('focusout', cancel) }
  }, [locale])
  return <>
    <a href="#main-content" className="skip-link">{t('layout.skip')}</a>
    <header className="site-header"><div className="header-inner"><Link to="/" className="brand" translate="no" aria-label={t('layout.brandHome')}><span className="brand-mark" aria-hidden="true">r<span>_</span></span><span>Rancode Lab</span></Link>
      <nav className={`primary-nav ${mobileOpen ? 'open' : ''}`} aria-label={t('layout.mainNavigation')}>{navigation.map(([label, url]) => <NavLink key={url} to={url}>{t(label)}</NavLink>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={t('layout.searchLabel')}><Search size={16}/><span>{t('layout.search')}</span><kbd>⌘ K</kbd></button><button className="locale-switcher" type="button" onClick={toggleLocale} aria-label={t('language.switchTo')} title={t('language.switchTo')}><Languages size={15} aria-hidden="true"/><span>{locale === 'en' ? 'ID' : 'EN'}</span></button><button className="icon-button settings-trigger" aria-label={t('layout.progressSettings')} onClick={() => { setSettingsOpen(true); setConfirmReset(false); setResetDone(false) }}><SlidersHorizontal size={17}/></button><button className="icon-button mobile-toggle" aria-label={mobileOpen ? t('layout.closeMenu') : t('layout.openMenu')} aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X size={22}/> : <Menu size={22}/>}</button></div>
    </div></header>
    {!progress.storageAvailable && <div className="storage-notice" role="status">{t('layout.storageBlocked')}</div>}
    <main id="main-content" tabIndex={-1}><ErrorBoundary key={location.pathname}><Suspense fallback={<div className="route-loading page-width" role="status"><span className="loading-line"/>{t('layout.loading')}</div>}>{location.pathname === '/' ? <Outlet/> : <ContentBoundary><Outlet/></ContentBoundary>}</Suspense></ErrorBoundary></main>
    <footer className="site-footer page-width"><Link className="footer-brand" translate="no" to="/">Rancode Lab</Link><p>{t('layout.footer')}</p><div><span><span className="status-dot"/> {t('layout.progressStays')}</span><a href="https://github.com/randhupaksi/rancode-lab" target="_blank" rel="noreferrer">{t('layout.source')} <ArrowUpRight size={13}/></a></div><small className="brand-attribution">{t('layout.trademarkNotice')}</small></footer>
    {searchOpen && <Suspense fallback={<Dialog open title={t('layout.search')} onClose={() => setSearchOpen(false)}><p role="status">{t('layout.loading')}</p></Dialog>}><ErrorBoundary><SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)}/></ErrorBoundary></Suspense>}
    <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} title={t('settings.title')}><p className="muted">{t('settings.lead')}</p><div className="settings-counts"><div><strong>{progress.completedLessons.length}</strong><span>{t('settings.lessons')}</span></div><div><strong>{progress.completedChallenges.length}</strong><span>{t('settings.challenges')}</span></div></div>{resetDone && <p className="feedback success" role="status"><Check size={16}/>{t('settings.resetDone')}</p>}{confirmReset ? <div className="reset-confirmation"><h3>{t('settings.resetPrompt')}</h3><p>{t('settings.resetLead')}</p><div className="button-row"><button className="button danger" onClick={() => { progress.resetProgress(); setConfirmReset(false); setResetDone(true) }}>{t('settings.reset')}</button><button className="button secondary" onClick={() => setConfirmReset(false)}>{t('settings.keep')}</button></div></div> : <button className="button secondary" onClick={() => setConfirmReset(true)}>{t('settings.resetLocal')}</button>}</Dialog>
  </>
}
