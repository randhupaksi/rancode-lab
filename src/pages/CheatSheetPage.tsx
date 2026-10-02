import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { concepts, courses } from '../content'
import CodeBlock from '../components/ui/CodeBlock'
import { usePageTitle } from '../hooks/usePageTitle'
import '../styles/reference.css'
import SelectField from '../components/ui/SelectField'
import { useLocale } from '../features/locale/LocaleProvider'

export default function CheatSheetPage() {
  const { t } = useLocale()
  usePageTitle('Code cheat sheet')
  const { hash } = useLocation()
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('All')
  const [category, setCategory] = useState('All')
  const pendingAnchor = useRef<string | null>(null)
  const scoped = concepts.filter((concept) => courseId === 'All' || concept.courseId === courseId)
  const categories = [...new Set(scoped.map((concept) => concept.category))]
  const filtered = scoped.filter((concept) => (category === 'All' || concept.category === category) && `${concept.title} ${concept.description} ${concept.code}`.toLowerCase().includes(query.trim().toLowerCase()))

  useEffect(() => {
    const id = hash.slice(1)
    if (!concepts.some((concept) => concept.id === id)) return
    pendingAnchor.current = id
    setQuery('')
    setCourseId('All')
    setCategory('All')
  }, [hash])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = pendingAnchor.current ? document.getElementById(pendingAnchor.current) : null
      if (!target) return
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
      pendingAnchor.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, query, category, courseId])

  return <div className="page-width reference-page cheatsheet-page">
    <header className="page-header reference-page-header"><div><p className="eyebrow">{t('sheet.eyebrow')}</p><h1 className="page-heading">{t('sheet.heading')}</h1><p className="page-lead">{t('sheet.lead')}</p></div><span className="reference-count">stack / quick reference</span></header>
    <div className="reference-toolbar"><label className="reference-search"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('sheet.placeholder')} aria-label={t('sheet.searchLabel')} /></label><SelectField id="cheatsheet-path" className="reference-select" label={t('reference.path')} value={courseId} onValueChange={value => { setCourseId(value); setCategory('All') }} options={[{ value: 'All', label: t('reference.allPaths') }, ...courses.map(course => ({ value: course.id, label: course.title }))]} /><SelectField id="cheatsheet-topic" className="reference-select" label={t('reference.topic')} value={category} onValueChange={setCategory} options={[{ value: 'All', label: t('reference.allTopics') }, ...categories.map(item => ({ value: item, label: item }))]} /><span className="reference-result-count" role="status">{filtered.length} {t('reference.examples')}</span></div>
    {filtered.length ? <div className="cheatsheet-groups">{categories.filter((item) => filtered.some((concept) => concept.category === item)).map((item) => <section className="cheatsheet-group" key={item} aria-label={item}><div className="cheatsheet-group-heading"><h2>{item}</h2><span>{filtered.filter((concept) => concept.category === item).length} {t('reference.patterns')}</span></div><div className="cheatsheet-grid">{filtered.filter((concept) => concept.category === item).map((concept) => <article className="cheatsheet-entry" key={concept.id} id={concept.id} tabIndex={-1} aria-labelledby={`${concept.id}-title`}><header><h3 id={`${concept.id}-title`}><a href={`#${concept.id}`}>{concept.title}</a></h3></header><p>{concept.description}</p><CodeBlock code={concept.code} /><Link className="reference-text-link" to={`/explore/${concept.id}`}>{t('sheet.understand')} <ArrowUpRight size={14} aria-hidden="true" /></Link></article>)}</div></section>)}</div> : <div className="reference-empty"><h2>{t('sheet.empty')}</h2><p>{t('sheet.emptyLead')}</p><button className="button secondary" onClick={() => { setQuery(''); setCourseId('All'); setCategory('All') }}>{t('sheet.reset')}</button></div>}
    <p className="cheatsheet-note">A type annotation describes data. Components, routes, and handlers each still need deliberate runtime behavior.</p>
  </div>
}
