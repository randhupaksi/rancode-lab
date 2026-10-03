import { useMemo, useState } from 'react'
import { ArrowRight, Braces, Search } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { concepts, courses, getCourse, getLesson, lessonPath } from '../content'
import ConceptCanvas from '../components/learning/ConceptCanvas'
import CodeBlock from '../components/ui/CodeBlock'
import SelectField from '../components/ui/SelectField'
import { usePageTitle } from '../hooks/usePageTitle'
import '../styles/reference.css'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeConcept, localizeCourse, localizeLesson } from '../content/localize'

export default function ExplorePage() {
  const { conceptId } = useParams()
  const { locale, t } = useLocale()
  const [query, setQuery] = useState('')
  const [courseId, setCourseId] = useState('all')
  const localizedConcepts = useMemo(() => concepts.map(concept => {
    const lesson = getLesson(concept.lessonId)
    return lesson ? localizeConcept(concept, lesson, locale) : concept
  }), [locale])
  const filtered = localizedConcepts.filter((concept) => (courseId === 'all' || concept.courseId === courseId) && `${concept.title} ${concept.category} ${concept.description}`.toLowerCase().includes(query.toLowerCase().trim()))
  const requested = localizedConcepts.find((concept) => concept.id === conceptId)
  const selected = requested && filtered.some((concept) => concept.id === requested.id) ? requested : !conceptId ? filtered[0] : undefined
  const categories = [...new Set(filtered.map((concept) => concept.category))]
  const sourceLesson = selected ? getLesson(selected.lessonId) : undefined
  const lesson = sourceLesson ? localizeLesson(sourceLesson, locale) : undefined
  const visual = selected?.visual ?? lesson?.visual
  usePageTitle(selected ? `${selected.title} · Explore` : 'Explore concepts')

  return <div className="page-width reference-page">
    <header className="page-header reference-page-header">
      <div><p className="eyebrow">{t('explore.eyebrow')}</p><h1 className="page-heading">{t('explore.heading')}</h1><p className="page-lead">{t('explore.lead')}</p></div>
      <span className="reference-count"><Braces size={18} aria-hidden="true" /> {t('explore.count', { count: concepts.length })}</span>
    </header>
    <div className="reference-layout">
      <aside className="concept-index" aria-label={t('explore.eyebrow')}>
        <label className="reference-search"><Search size={16} aria-hidden="true" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t('explore.find')} aria-label={t('explore.find')} type="search" /></label><SelectField id="explore-path" className="concept-course-filter" label={t('reference.path')} value={courseId} onValueChange={setCourseId} options={[{ value: 'all', label: t('reference.allPaths') }, ...courses.map(course => ({ value: course.id, label: course.title }))]} />
        <p className="reference-result-count" role="status">{filtered.length} {filtered.length === 1 ? t('explore.concept') : t('explore.concepts')}</p>
        {categories.map((category) => <section className="concept-group" key={category}><h2>{category}</h2><nav aria-label={`${category} concepts`}>{filtered.filter((concept) => concept.category === category).map((concept) => <Link key={concept.id} className={`concept-link ${selected?.id === concept.id ? 'is-active' : ''}`} to={`/explore/${concept.id}`} aria-current={selected?.id === concept.id ? 'page' : undefined}>{concept.title}<ArrowRight size={14} aria-hidden="true" /></Link>)}</nav></section>)}
        {!filtered.length && <div className="reference-empty"><p>{t('search.empty', { query })}</p><button className="button ghost" onClick={() => setQuery('')}>{t('explore.clear')}</button></div>}
      </aside>
      {selected ? <article className="concept-detail" key={selected.id}>
        <div className="concept-detail-heading"><span className="eyebrow">{getCourse(selected.courseId) ? localizeCourse(getCourse(selected.courseId)!, locale).title : ''} / {selected.category}</span><span className="reference-mono">{String(concepts.findIndex(concept => concept.id === selected.id) + 1).padStart(2, '0')} / {String(concepts.length).padStart(2, '0')}</span></div>
        <h2>{selected.title}</h2><p className="concept-definition">{selected.description}</p>
        <section className="reference-example"><h3 className="section-heading">{t('explore.code')}</h3><CodeBlock code={selected.code} language={selected.language} /></section>
        {visual && <section className="reference-visual"><h3 className="section-heading">{t('explore.mental')}</h3><ConceptCanvas visual={visual} /></section>}
        <div className="concept-next"><div><span className="eyebrow">{t('explore.practice')}</span><h3>{lesson?.title ?? t('explore.learn')}</h3><p className="muted">{t('explore.try')}</p></div>{lesson && <Link className="button primary" to={lessonPath(lesson)}>{t('explore.open')} <ArrowRight size={16} aria-hidden="true" /></Link>}</div>
      </article> : <section className="reference-empty"><h2>{t('explore.missing')}</h2><p>{t('explore.choose')}</p><Link className="button secondary" to="/explore">{t('explore.browse')}</Link></section>}
    </div>
  </div>
}
