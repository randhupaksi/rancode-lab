type RouteSkeletonProps = { pathname: string; label: string }
type SectionSkeletonProps = { label: string; variant?: 'code' | 'preview' | 'prompt' | 'challenge' }

function Line({ width = '100%', size = 'copy' }: { width?: string; size?: 'eyebrow' | 'title' | 'heading' | 'copy' | 'small' }) {
  return <span className={`loading-skeleton-line loading-skeleton-line--${size}`} style={{ width }}/>
}

function Lines({ count = 3 }: { count?: number }) {
  const widths = ['100%', '91%', '72%']
  return <div className="loading-skeleton-lines">{Array.from({ length: count }, (_, index) => <Line key={index} width={widths[index % widths.length]}/>)}</div>
}

function PageHeading({ split = false }: { split?: boolean }) {
  return <div className={`loading-skeleton-heading${split ? ' is-split' : ''}`}>
    <div><Line width="138px" size="eyebrow"/><Line width="min(520px, 72vw)" size="title"/><Lines count={2}/></div>
    {split && <div className="loading-skeleton-panel loading-skeleton-panel--progress"><Line width="68px" size="heading"/><Line width="110px" size="copy"/><Line width="100%" size="small"/></div>}
  </div>
}

function Rows({ count = 3, className = '' }: { count?: number; className?: string }) {
  return <div className={`loading-skeleton-rows ${className}`}>{Array.from({ length: count }, (_, index) => <div className="loading-skeleton-row" key={index}>
    <Line width="28px" size="small"/><div><Line width={`${index === 1 ? 52 : 64}%`} size="heading"/><Line width={`${index === 2 ? 58 : 82}%`} size="copy"/></div><Line width="18px" size="small"/>
  </div>)}</div>
}

function routeVariant(pathname: string) {
  const parts = pathname.split('/').filter(Boolean)
  if (!parts.length) return 'home'
  if (parts[0] === 'learn') {
    if (parts[2] === 'checkpoint') return 'checkpoint'
    if (parts.length === 1) return 'learning'
    if (parts.length === 2) return 'course'
    return 'lesson'
  }
  if (parts[0] === 'projects') return parts.length === 1 ? 'projects' : 'project'
  if (parts[0] === 'explore') return 'explore'
  if (parts[0] === 'challenges') return 'challenges'
  if (parts[0] === 'playground') return 'playground'
  if (parts[0] === 'cheat-sheet') return 'reference'
  if (parts[0] === 'start') return 'start'
  return 'default'
}

function RouteSkeletonContent({ variant }: { variant: string }) {
  if (variant === 'home') return <div className="loading-skeleton-home">
    <section className="loading-skeleton-home-hero">
      <div className="loading-skeleton-home-eyebrow"><Line width="22px" size="small"/><Line width="190px" size="eyebrow"/><Line width="22px" size="small"/></div>
      <div className="loading-skeleton-home-title"><Line width="min(760px, 82vw)" size="title"/><Line width="min(590px, 68vw)" size="title"/></div>
      <div className="loading-skeleton-home-lead"><Lines count={2}/></div>
      <div className="loading-skeleton-home-actions"><Line width="166px" size="heading"/><Line width="176px" size="heading"/></div>
      <Line width="142px" size="small"/>
    </section>
    <div className="loading-skeleton-home-prelude"><Line width="172px" size="small"/><Line width="112px" size="small"/></div>
    <section className="loading-skeleton-home-demo">
      <div className="loading-skeleton-home-toolbar"><Line width="106px" size="small"/><Line width="95px" size="small"/></div>
      <div className="loading-skeleton-home-workspace">
        <div><Lines count={6}/></div>
        <div><Line width="92px" size="eyebrow"/><Line width="58%" size="heading"/><Line width="88%" size="copy"/><Line width="94px" size="small"/></div>
      </div>
    </section>
    <section className="loading-skeleton-home-path">
      <div><Line width="130px" size="eyebrow"/><Line width="min(330px, 70vw)" size="title"/><Lines count={2}/><div className="loading-skeleton-inline"><Line width="92px" size="small"/><Line width="94px" size="small"/></div></div>
      <Rows count={3}/>
    </section>
  </div>
  if (variant === 'learning') return <>
    <PageHeading split/>
    <div className="loading-skeleton-panel loading-skeleton-panel--next"><Line width="105px" size="eyebrow"/><Line width="min(470px, 72vw)" size="heading"/><Lines count={2}/></div>
    <div className="loading-skeleton-section-heading"><Line width="180px" size="heading"/><Line width="130px" size="small"/></div>
    <Rows count={3}/>
  </>

  if (variant === 'course') return <>
    <PageHeading split/>
    <div className="loading-skeleton-section-heading"><Line width="170px" size="heading"/><Line width="90px" size="small"/></div>
    <Rows count={3}/>
  </>

  if (variant === 'lesson') return <div className="loading-skeleton-lesson-layout">
    <aside className="loading-skeleton-lesson-sidebar"><Line width="94px" size="small"/><Line width="132px" size="heading"/><Lines count={4}/></aside>
    <div className="loading-skeleton-lesson-content">
      <div className="loading-skeleton-inline"><Line width="85px" size="small"/><Line width="110px" size="small"/></div>
      <Line width="min(490px, 74vw)" size="title"/><Lines count={2}/>
      <div className="loading-skeleton-inline loading-skeleton-chips"><Line width="65px" size="small"/><Line width="82px" size="small"/><Line width="53px" size="small"/><Line width="76px" size="small"/></div>
      <section className="loading-skeleton-lesson-section"><Line width="92px" size="eyebrow"/><Line width="210px" size="heading"/><Lines count={3}/></section>
      <div className="loading-skeleton-panel loading-skeleton-panel--visual"/>
      <div className="loading-skeleton-panel loading-skeleton-panel--editor"><div className="loading-skeleton-inline"><Line width="95px" size="small"/><Line width="48px" size="small"/></div><Lines count={5}/></div>
    </div>
  </div>

  if (variant === 'checkpoint') return <>
    <PageHeading/>
    <div className="loading-skeleton-panel loading-skeleton-panel--question"><Line width="115px" size="eyebrow"/><Line width="72%" size="heading"/><div className="loading-skeleton-options"><Line width="100%" size="copy"/><Line width="93%" size="copy"/><Line width="97%" size="copy"/></div></div>
  </>

  if (variant === 'projects') return <><PageHeading/><Rows count={3} className="loading-skeleton-project-rows"/></>

  if (variant === 'project') return <>
    <PageHeading/>
    <div className="loading-skeleton-project-layout"><div><Line width="180px" size="heading"/><Lines count={3}/><div className="loading-skeleton-panel loading-skeleton-panel--editor"><div className="loading-skeleton-inline"><Line width="100px" size="small"/><Line width="52px" size="small"/></div><Lines count={6}/></div></div><aside className="loading-skeleton-panel loading-skeleton-review"><Line width="140px" size="heading"/><Lines count={2}/><div className="loading-skeleton-options"><Line width="90%" size="copy"/><Line width="95%" size="copy"/><Line width="82%" size="copy"/></div></aside></div>
  </>

  if (variant === 'reference') return <>
    <PageHeading/>
    <div className="loading-skeleton-toolbar"><Line width="min(340px, 100%)" size="heading"/><Line width="110px" size="heading"/><Line width="110px" size="heading"/></div>
    <div className="loading-skeleton-reference-grid">{Array.from({ length: 3 }, (_, index) => <div className="loading-skeleton-panel" key={index}><Line width="62%" size="heading"/><Lines count={2}/><div className="loading-skeleton-panel loading-skeleton-panel--editor"><Lines count={4}/></div></div>)}</div>
  </>

  if (variant === 'explore') return <>
    <PageHeading/>
    <div className="loading-skeleton-toolbar"><Line width="min(360px, 100%)" size="heading"/><Line width="120px" size="heading"/></div>
    <div className="loading-skeleton-explore-layout"><aside className="loading-skeleton-panel loading-skeleton-index"><Lines count={5}/></aside><div className="loading-skeleton-concept"><Line width="100px" size="eyebrow"/><Line width="min(400px, 68vw)" size="title"/><Lines count={3}/><div className="loading-skeleton-panel loading-skeleton-panel--editor"><Lines count={5}/></div></div></div>
  </>

  if (variant === 'challenges') return <>
    <PageHeading split/>
    <div className="loading-skeleton-toolbar"><Line width="min(170px, 40%)" size="heading"/><Line width="min(170px, 40%)" size="heading"/><Line width="100px" size="small"/></div>
    <div className="loading-skeleton-challenge-layout"><aside className="loading-skeleton-panel loading-skeleton-index"><Rows count={3}/></aside><div className="loading-skeleton-concept"><Line width="90px" size="eyebrow"/><Line width="min(380px, 65vw)" size="title"/><Lines count={2}/><div className="loading-skeleton-options"><Line width="100%" size="copy"/><Line width="100%" size="copy"/><Line width="100%" size="copy"/></div></div></div>
  </>

  if (variant === 'playground') return <>
    <PageHeading/>
    <div className="loading-skeleton-toolbar"><Line width="210px" size="heading"/></div>
    <div className="loading-skeleton-panel loading-skeleton-panel--editor"><div className="loading-skeleton-inline"><Line width="120px" size="small"/><Line width="52px" size="small"/></div><Lines count={8}/></div>
  </>

  if (variant === 'start') return <>
    <PageHeading/>
    <div className="loading-skeleton-start-options"><div/><div/><div/></div>
  </>

  return <PageHeading/>
}

export function RouteSkeleton({ pathname, label }: RouteSkeletonProps) {
  const variant = routeVariant(pathname)
  return <div className="route-skeleton page-width" role="status" aria-busy="true" aria-label={label}>
    <span className="route-skeleton-indicator" aria-hidden="true"/>
    <div className={`route-skeleton-content route-skeleton-content--${variant}`} aria-hidden="true"><RouteSkeletonContent variant={variant}/></div>
  </div>
}

export function SectionLoadingSkeleton({ label, variant = 'code' }: SectionSkeletonProps) {
  return <div className={`section-loading-skeleton section-loading-skeleton--${variant}`} role="status" aria-busy="true" aria-label={label}>
    <div className="section-loading-toolbar" aria-hidden="true"><Line width="122px" size="small"/><Line width="42px" size="small"/></div>
    {variant === 'prompt'
      ? <div className="section-loading-prompt" aria-hidden="true"><Lines count={3}/></div>
      : variant === 'challenge'
        ? <div className="section-loading-challenge" aria-hidden="true"><Line width="72%" size="heading"/><Lines count={2}/><div className="loading-skeleton-options"><Line width="100%" size="copy"/><Line width="100%" size="copy"/><Line width="100%" size="copy"/></div></div>
        : <div className="section-loading-workspace" aria-hidden="true"><div className="section-loading-code"><Lines count={7}/></div>{variant !== 'code' && <div className="section-loading-preview"><Line width="42%" size="heading"/><Line width="72%" size="copy"/><Line width="94px" size="small"/></div>}</div>}
  </div>
}
