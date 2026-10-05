import { useEffect } from 'react'
import type { ReactNode } from 'react'
import '../../styles/content.css'
import { useLocation } from 'react-router-dom'
import { useLocale } from '../../features/locale/LocaleProvider'
import { activateCatalog, catalogReady, prepareCatalog } from './catalog'
const resources = new Map<string, { status: 'pending' | 'ready' | 'error'; promise: Promise<void>; error?: unknown }>()
function read(pathname: string, locale: 'en' | 'id') {
  if (catalogReady(pathname, locale)) { activateCatalog(locale); return }
  const key = locale + ':' + pathname
  let resource = resources.get(key)
  if (!resource) {
    const state = { status: 'pending' as 'pending' | 'ready' | 'error', promise: Promise.resolve(), error: undefined as unknown }
    state.promise = prepareCatalog(pathname, locale).then(() => { state.status = 'ready' }, error => { state.status = 'error'; state.error = error })
    resources.set(key, state); resource = state
  }
  if (resource.status === 'error') throw resource.error
  if (resource.status !== 'ready') throw resource.promise
  activateCatalog(locale)
}
export function preloadContent(pathname: string, locale: 'en' | 'id') { return prepareCatalog(pathname, locale) }
export default function ContentBoundary({ children }: { children: ReactNode }) {
  const { pathname, search, hash } = useLocation()
  const { locale } = useLocale()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView()
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname, search, hash])
  read(pathname + search, locale)
  return children
}
