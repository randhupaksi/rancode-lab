import { useEffect, useMemo, useRef, useState } from 'react'
import { ArrowUpRight, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { concepts, courses, getLesson } from '../content/runtime/catalog'
import CodeBlock from '../components/ui/CodeBlock'
import { usePageTitle } from '../hooks/usePageTitle'
import '../styles/reference.css'
import SelectField from '../components/ui/SelectField'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeConcept, localizeCourse } from '../content/runtime/localize'
import { useLearningCopy } from '../features/journey/useLearningCopy'

const PAGE_SIZE = 24

export default function CheatSheetPage() {
  const { locale, t } = useLocale()
  const c = useLearningCopy()
  const localizedConcepts = useMemo(() => concepts.map(concept => {
    const lesson = getLesson(concept.lessonId)
    return lesson ? localizeConcept(concept, lesson, locale) : concept
  }), [locale])
  usePageTitle(t('sheet.heading'))
  const { hash } = useLocation()
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('All')
  const [category, setCategory] = useState('All')
  const pendingAnchor = useRef<string | null>(null)
  const resultsHeading = useRef<HTMLDivElement>(null)
  const [pageState, setPageState] = useState({ key: '', page: 0 })
  const scoped = localizedConcepts.filter((concept) => courseId === 'All' || concept.courseId === courseId)
  const categories = [...new Set(scoped.map((concept) => concept.category))]
  const activeCategory = categories.includes(category) ? category : 'All'
  const normalizedQuery = query.trim().toLowerCase()
  const filtered = scoped.filter((concept) => (activeCategory === 'All' || concept.category === activeCategory) && `${concept.title} ${concept.description} ${concept.promptExample ?? concept.code}`.toLowerCase().includes(normalizedQuery))
  const ordered = categories.flatMap(item => filtered.filter(concept => concept.category === item))
  const filterKey = JSON.stringify([locale, query, courseId, activeCategory])
  const pageCount = Math.ceil(ordered.length / PAGE_SIZE)
  const page = pageState.key === filterKey ? Math.min(pageState.page, Math.max(0, pageCount - 1)) : 0
  const visible = ordered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const visibleCategories = [...new Set(visible.map(concept => concept.category))]

  useEffect(() => {
    const id = hash.slice(1)
    if (!localizedConcepts.some((concept) => concept.id === id)) return
    pendingAnchor.current = id
    setQuery('')
    setCourseId('All')
    setCategory('All')
    const allCategories = [...new Set(localizedConcepts.map(concept => concept.category))]
    const allOrdered = allCategories.flatMap(item => localizedConcepts.filter(concept => concept.category === item))
    setPageState({ key: JSON.stringify([locale, '', 'All', 'All']), page: Math.floor(allOrdered.findIndex(concept => concept.id === id) / PAGE_SIZE) })
  }, [hash, localizedConcepts, locale])

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const target = pendingAnchor.current ? document.getElementById(pendingAnchor.current) : null
      if (!target) return
      target.focus({ preventScroll: true })
      target.scrollIntoView({ block: 'start' })
      pendingAnchor.current = null
    })
    return () => cancelAnimationFrame(frame)
  }, [hash, query, category, courseId, page, locale])

  function changePage(next: number) {
    pendingAnchor.current = null
    setPageState({ key: filterKey, page: next })
    resultsHeading.current?.focus({ preventScroll: true })
    resultsHeading.current?.scrollIntoView({ block: 'start' })
  }

  return <div className="page-width reference-page cheatsheet-page">
    <header className="page-header reference-page-header"><div><p className="eyebrow">{t('sheet.eyebrow')}</p><h1 className="page-heading">{t('sheet.heading')}</h1><p className="page-lead">{t('sheet.lead')}</p></div><span className="reference-count">{t('sheet.countLabel')}</span></header>
    <div className="reference-toolbar"><label className="reference-search"><Search size={17} aria-hidden="true" /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('sheet.placeholder')} aria-label={t('sheet.searchLabel')} /></label><SelectField id="cheatsheet-path" className="reference-select" label={t('reference.path')} value={courseId} onValueChange={value => { setCourseId(value); setCategory('All') }} options={[{ value: 'All', label: t('reference.allPaths') }, ...courses.map(course => ({ value: course.id, label: localizeCourse(course, locale).title }))]} /><SelectField id="cheatsheet-topic" className="reference-select" label={t('reference.topic')} value={activeCategory} onValueChange={setCategory} options={[{ value: 'All', label: t('reference.allTopics') }, ...categories.map(item => ({ value: item, label: item }))]} /><span className="reference-result-count" role="status">{filtered.length} {t('reference.examples')}</span></div>
    {filtered.length ? <div className="cheatsheet-groups" id="reference-results" ref={resultsHeading} tabIndex={-1} aria-label={c('Reference results', 'Hasil referensi')}>{visibleCategories.map((item) => <section className="cheatsheet-group" key={item} aria-label={item}><div className="cheatsheet-group-heading"><h2>{item}</h2><span>{visible.filter((concept) => concept.category === item).length} {t('reference.patterns')}</span></div><div className="cheatsheet-grid">{visible.filter((concept) => concept.category === item).map((concept) => <article className="cheatsheet-entry" key={concept.id} id={concept.id} tabIndex={-1} aria-labelledby={`${concept.id}-title`}><header><h3 id={`${concept.id}-title`}><a href={`#${concept.id}`}>{concept.title}</a></h3></header><p>{concept.description}</p><CodeBlock code={concept.promptExample ?? concept.code} language={concept.language} /><Link className="reference-text-link" to={`/explore/${concept.id}`}>{t('sheet.understand')} <ArrowUpRight size={14} aria-hidden="true" /></Link></article>)}</div></section>)}</div> : <div className="reference-empty"><h2>{t('sheet.empty')}</h2><p>{t('sheet.emptyLead')}</p><button className="button secondary" onClick={() => { setQuery(''); setCourseId('All'); setCategory('All') }}>{t('sheet.reset')}</button></div>}
    {pageCount > 1 && <nav className="reference-pagination" aria-label={c('Reference pages', 'Halaman referensi')}><button className="button secondary" disabled={page === 0} onClick={() => changePage(page - 1)} aria-controls="reference-results">{c('Previous', 'Sebelumnya')}</button><span role="status">{c('Page', 'Halaman')} {page + 1} / {pageCount} · {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, ordered.length)} / {ordered.length}</span><button className="button secondary" disabled={page + 1 >= pageCount} onClick={() => changePage(page + 1)} aria-controls="reference-results">{c('Next', 'Berikutnya')}</button></nav>}
    <p className="cheatsheet-note">{c('A type annotation describes data. Components, routes, and handlers each still need deliberate runtime behavior.', 'Anotasi type menjelaskan data. Components, routes, dan handlers tetap membutuhkan perilaku runtime yang dirancang dengan sengaja.')}</p>
  </div>
}
