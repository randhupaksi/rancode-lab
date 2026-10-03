import { lazy, Suspense, useEffect, useState } from 'react'
import { ArrowUpRight, Check, Languages, Menu, Search, SlidersHorizontal, X } from 'lucide-react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useProgress } from '../../features/progress/ProgressProvider'
import Dialog from '../ui/Dialog'
import ErrorBoundary from '../ui/ErrorBoundary'
import { useLocale } from '../../features/locale/LocaleProvider'

const SearchDialog = lazy(() => import('../../features/search/SearchDialog'))
const navigation = [['nav.learn', '/learn'], ['nav.projects', '/projects'], ['nav.explore', '/explore'], ['nav.playground', '/playground'], ['nav.challenges', '/challenges'], ['nav.cheatSheet', '/cheat-sheet']]

export default function SiteLayout() {
  const [searchOpen, setSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const [resetMessage, setResetMessage] = useState('')
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
  return <>
    <a href="#main-content" className="skip-link">{t('layout.skip')}</a>
    <header className="site-header"><div className="header-inner"><Link to="/" className="brand" translate="no" aria-label="UnderCode home"><span className="brand-mark" aria-hidden="true">u<span>_</span></span><span>under<span className="brand-light">code</span></span></Link>
      <nav className={`primary-nav ${mobileOpen ? 'open' : ''}`} aria-label="Main navigation">{navigation.map(([label, url]) => <NavLink key={url} to={url}>{t(label)}</NavLink>)}</nav>
      <div className="header-actions"><button className="search-trigger" onClick={() => setSearchOpen(true)} aria-label={t('layout.searchLabel')}><Search size={16}/><span>{t('layout.search')}</span><kbd>⌘ K</kbd></button><button className="locale-switcher" type="button" onClick={toggleLocale} aria-label={t('language.switchTo')} title={t('language.switchTo')}><Languages size={15} aria-hidden="true"/><span>{locale === 'en' ? 'ID' : 'EN'}</span></button><button className="icon-button settings-trigger" aria-label={t('layout.progressSettings')} onClick={() => { setSettingsOpen(true); setConfirmReset(false); setResetMessage('') }}><SlidersHorizontal size={17}/></button><button className="icon-button mobile-toggle" aria-label={mobileOpen ? t('layout.closeMenu') : t('layout.openMenu')} aria-expanded={mobileOpen} onClick={() => setMobileOpen(v => !v)}>{mobileOpen ? <X size={22}/> : <Menu size={22}/>}</button></div>
    </div></header>
    {!progress.storageAvailable && <div className="storage-notice" role="status">{t('layout.storageBlocked')}</div>}
    <main id="main-content" tabIndex={-1}><ErrorBoundary key={location.pathname}><Suspense fallback={<div className="route-loading page-width" role="status"><span className="loading-line"/>{t('layout.loading')}</div>}><Outlet/></Suspense></ErrorBoundary></main>
    <footer className="site-footer page-width"><Link className="footer-brand" translate="no" to="/">under<span>code</span></Link><p>{t('layout.footer')}</p><div><span><span className="status-dot"/> {t('layout.progressStays')}</span><a href="https://github.com/randhupaksi/undercode" target="_blank" rel="noreferrer">{t('layout.source')} <ArrowUpRight size={13}/></a></div><small className="brand-attribution">Vercel, the Vercel design, Next.js and related marks, designs and logos are trademarks or registered trademarks of Vercel, Inc. or its affiliates in the US and other countries.</small></footer>
    {searchOpen && <Suspense fallback={<Dialog open title={t('layout.search')} onClose={() => setSearchOpen(false)}><p role="status">{t('layout.loading')}</p></Dialog>}><SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)}/></Suspense>}
    <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} title={t('settings.title')}><p className="muted">{t('settings.lead')}</p><div className="settings-counts"><div><strong>{progress.completedLessons.length}</strong><span>{t('settings.lessons')}</span></div><div><strong>{progress.completedChallenges.length}</strong><span>{t('settings.challenges')}</span></div></div>{resetMessage && <p className="feedback success" role="status"><Check size={16}/>{resetMessage}</p>}{confirmReset ? <div className="reset-confirmation"><h3>{t('settings.resetPrompt')}</h3><p>{t('settings.resetLead')}</p><div className="button-row"><button className="button danger" onClick={() => { progress.resetProgress(); setConfirmReset(false); setResetMessage(t('settings.resetDone')) }}>{t('settings.reset')}</button><button className="button secondary" onClick={() => setConfirmReset(false)}>{t('settings.keep')}</button></div></div> : <button className="button secondary" onClick={() => setConfirmReset(true)}>{t('settings.resetLocal')}</button>}</Dialog>
  </>
}
