import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import '../../styles/mobile-bottom-navigation.css'
import { BookOpen, BriefcaseBusiness, Compass, House, Trophy } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useLocale } from '../../features/locale/LocaleProvider'
import { routeLoader } from '../../routeLoaders'

const primaryNavigation = [
  { label: 'nav.home', href: '/', icon: House },
  { label: 'nav.learn', href: '/learn', icon: BookOpen },
  { label: 'nav.projects', href: '/projects', icon: BriefcaseBusiness },
  { label: 'nav.explore', href: '/explore', icon: Compass },
  { label: 'nav.challenges', href: '/challenges', icon: Trophy },
]

const NAVIGATION_VIEWBOX_WIDTH = 500
const NAVIGATION_VIEWBOX_HEIGHT = 92
const NAVIGATION_TOP_EDGE = 30
const NAVIGATION_ACTIVE_NOTCH_DEPTH = 59
const NAVIGATION_ACTIVE_NOTCH_HALF_WIDTH = 50
const NAVIGATION_ACTIVE_NOTCH_CONTROL_OFFSET = 18

function buildNavigationFramePath(activeIndex: number) {
  if (activeIndex < 0) {
    return 'M 0 ' + NAVIGATION_TOP_EDGE + ' H ' + NAVIGATION_VIEWBOX_WIDTH + ' V ' + NAVIGATION_VIEWBOX_HEIGHT + ' H 0 Z'
  }


  const activeCenter = activeIndex * 100 + 50
  const notchStart = activeCenter - NAVIGATION_ACTIVE_NOTCH_HALF_WIDTH
  const notchEnd = activeCenter + NAVIGATION_ACTIVE_NOTCH_HALF_WIDTH
  const curveControl = Math.min(26, (notchEnd - notchStart) * 0.34)

  return [
    'M 0 ' + NAVIGATION_TOP_EDGE,
    'H ' + notchStart,
    'C ' + (notchStart + NAVIGATION_ACTIVE_NOTCH_CONTROL_OFFSET) + ' ' + NAVIGATION_TOP_EDGE + ' ' + (activeCenter - curveControl) + ' ' + NAVIGATION_ACTIVE_NOTCH_DEPTH + ' ' + activeCenter + ' ' + NAVIGATION_ACTIVE_NOTCH_DEPTH,
    'C ' + (activeCenter + curveControl) + ' ' + NAVIGATION_ACTIVE_NOTCH_DEPTH + ' ' + (notchEnd - NAVIGATION_ACTIVE_NOTCH_CONTROL_OFFSET) + ' ' + NAVIGATION_TOP_EDGE + ' ' + notchEnd + ' ' + NAVIGATION_TOP_EDGE,
    'H ' + NAVIGATION_VIEWBOX_WIDTH,
    'V ' + NAVIGATION_VIEWBOX_HEIGHT,
    'H 0 Z',
  ].join(' ')
}

function preloadNavigationTarget(pathname: string, locale: 'en' | 'id') {
  const loadRoute = routeLoader(pathname)
  if (loadRoute) void loadRoute().catch(() => {})
  if (pathname !== '/') {
    void import('../../content/runtime/ContentBoundary')
      .then(module => module.preloadContent(pathname, locale))
      .catch(() => {})
  }
}

function getActiveNavigationIndex(pathname: string) {
  const activePath = pathname === '/start'
    ? '/learn'
    : pathname === '/cheat-sheet'
      ? '/explore'
      : pathname

  const index = primaryNavigation.findIndex(({ href }) => (
    href === '/' ? activePath === '/' : activePath === href || activePath.startsWith(href + '/')
  ))

  return index
}

export default function MobileBottomNavigation() {
  const navigationRef = useRef<HTMLElement>(null)
  const activeIndicatorRef = useRef<HTMLSpanElement>(null)
  const { pathname } = useLocation()
  const { locale, t } = useLocale()
  const activeIndex = getActiveNavigationIndex(pathname)
  const activeNavigation = activeIndex >= 0 ? primaryNavigation[activeIndex] : undefined
  const ActiveIcon = activeNavigation?.icon ?? House
  const navigationFramePath = buildNavigationFramePath(activeIndex)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return
      }

      const isCompactViewport = window.matchMedia('(max-width: 767px)').matches

      gsap.fromTo(
        navigationRef.current,
        { yPercent: 105 },
        {
          yPercent: 0,
          duration: isCompactViewport ? 0.66 : 0.78,
          ease: 'power3.out',
          force3D: true,
          clearProps: 'willChange',
        },
      )
    }, navigationRef)

    return () => ctx.revert()
  }, [])

  useLayoutEffect(() => {
    const indicator = activeIndicatorRef.current

    if (!indicator || activeIndex < 0) {
      return
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      gsap.set(indicator, { xPercent: activeIndex * 100, y: '0.1rem' })
      return
    }

    gsap.to(indicator, {
      xPercent: activeIndex * 100,
      y: '0.1rem',
      duration: window.matchMedia('(max-width: 767px)').matches ? 0.42 : 0.56,
      ease: 'power3.out',
      force3D: true,
      overwrite: 'auto',
    })
  }, [activeIndex])

  return (
    <nav
      ref={navigationRef}
      aria-label={t('layout.mainNavigation')}
      className="mobile-bottom-navigation"
    >
      <div className="mobile-bottom-navigation__frame">
        <svg
          aria-hidden="true"
          className="mobile-bottom-navigation__svg"
          viewBox={'0 0 ' + NAVIGATION_VIEWBOX_WIDTH + ' ' + NAVIGATION_VIEWBOX_HEIGHT}
          preserveAspectRatio="none"
        >
          <path
            d={navigationFramePath}
            fill="var(--surface)"
            stroke="currentColor"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <span
          ref={activeIndicatorRef}
          aria-hidden="true"
          className="mobile-bottom-navigation__active-indicator"
          hidden={!activeNavigation}
        >
          <span className="mobile-bottom-navigation__active-ring">
            <span className="mobile-bottom-navigation__active-disc">
              <ActiveIcon
                key={activeIndex}
                size={20}
                strokeWidth={2.35}
                className="mobile-bottom-navigation__active-icon"
              />
            </span>
          </span>
        </span>

        <div className="mobile-bottom-navigation__items">
          {primaryNavigation.map(({ label, href, icon: Icon }, index) => {
            const isActive = index === activeIndex

            return (
              <Link
                key={href}
                aria-current={isActive ? 'page' : undefined}
                to={href}
                onPointerDown={event => {
                  if (event.button === 0) preloadNavigationTarget(href, locale)
                }}
                onFocus={() => preloadNavigationTarget(href, locale)}
                className={'mobile-bottom-navigation__item' + (isActive ? ' is-active' : '')}
              >
                <Icon
                  aria-hidden="true"
                  size={20}
                  strokeWidth={2.05}
                  className="mobile-bottom-navigation__item-icon"
                />
                <span className="mobile-bottom-navigation__label">{t(label)}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}







