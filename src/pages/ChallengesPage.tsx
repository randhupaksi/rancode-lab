import { useMemo, useState } from 'react'
import { ArrowRight, CheckCircle2, Code2, ListFilter } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { challenges, courses, getCourse, getLessonForChallenge } from '../content/runtime/catalog'
import ChallengeBlock from '../features/challenges/ChallengeBlock'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import SelectField from '../components/ui/SelectField'
import '../styles/reference.css'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeChallenge, localizeCourse } from '../content/runtime/localize'

const difficultyLabelsId = { Beginner: 'Pemula', Intermediate: 'Menengah', Advanced: 'Lanjutan' } as const

export default function ChallengesPage() {
  const { locale, t } = useLocale()
  const { challengeId } = useParams()
  const { completedChallenges, storageAvailable, completeLesson } = useProgress()
  const [topic, setTopic] = useState('All')
  const [courseId, setCourseId] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [hideCompleted, setHideCompleted] = useState(false)
  const localizedChallenges = useMemo(() => challenges.map(challenge => {
    const lesson = getLessonForChallenge(challenge.id)
    return lesson ? localizeChallenge(challenge, lesson, locale) : challenge
  }), [locale])
  const topics = [...new Set(localizedChallenges.filter(challenge => courseId === 'All' || getLessonForChallenge(challenge.id)?.courseId === courseId).map(challenge => challenge.topic))]
  const activeTopic = topics.includes(topic) ? topic : 'All'
  const filtered = localizedChallenges.filter((challenge) => {
    const lesson = getLessonForChallenge(challenge.id)
    return (courseId === 'All' || lesson?.courseId === courseId) && (activeTopic === 'All' || challenge.topic === activeTopic) && (difficulty === 'All' || challenge.difficulty === difficulty) && (!hideCompleted || !completedChallenges.includes(challenge.id))
  })
  const requested = challengeId ? localizedChallenges.find((challenge) => challenge.id === challengeId) : undefined
  const selected = requested && filtered.some((challenge) => challenge.id === requested.id) ? requested : filtered[0]
  const completedCount = localizedChallenges.filter((challenge) => completedChallenges.includes(challenge.id)).length
  usePageTitle(selected ? `${selected.title} · ${t('nav.challenges')}` : t('challenges.pageTitle'))

  function clearFilters() { setCourseId('All'); setTopic('All'); setDifficulty('All'); setHideCompleted(false) }

  return <div className="page-width reference-page challenges-page">
    <header className="page-header reference-page-header"><div><p className="eyebrow">{t('challenges.eyebrow')}</p><h1 className="page-heading">{t('challenges.heading')}</h1><p className="page-lead">{t('challenges.lead')}</p></div><div className="challenge-progress-summary"><span><strong>{completedCount}</strong> / {challenges.length}</span><p>{t('challenges.completed')}</p><progress value={completedCount} max={challenges.length || 1} aria-label={`${completedCount} / ${challenges.length} ${t('challenges.completed')}`} /></div></header>
    <div className="reference-toolbar challenge-toolbar"><ListFilter size={17} aria-hidden="true" /><SelectField id="challenge-path" className="reference-select" label={t('reference.path')} value={courseId} onValueChange={value => { setCourseId(value); setTopic('All') }} options={[{ value: 'All', label: t('reference.allPaths') }, ...courses.map(course => ({ value: course.id, label: localizeCourse(course, locale).title }))]} /><SelectField id="challenge-topic" className="reference-select" label={t('reference.topic')} value={activeTopic} onValueChange={setTopic} options={[{ value: 'All', label: t('reference.allTopics') }, ...topics.map(item => ({ value: item, label: item }))]} /><SelectField id="challenge-level" className="reference-select" label={t('challenges.level')} value={difficulty} onValueChange={setDifficulty} options={[{ value: 'All', label: t('challenges.allLevels') }, ...['Beginner', 'Intermediate', 'Advanced'].map(item => ({ value: item, label: locale === 'id' ? difficultyLabelsId[item as keyof typeof difficultyLabelsId] : item }))]} /><label className="challenge-hide-completed"><input type="checkbox" checked={hideCompleted} onChange={(event) => setHideCompleted(event.target.checked)} /> {t('challenges.hide')}</label><span className="reference-result-count" role="status">{filtered.length} {t('nav.challenges').toLowerCase()}</span></div>
    <div className="challenges-layout">
      <nav className="challenge-list" aria-label={t('challenges.choose')}>{filtered.map((challenge, index) => { const lesson = getLessonForChallenge(challenge.id); const course = getCourse(lesson?.courseId); return <Link className={`challenge-list-item ${selected?.id === challenge.id ? 'is-active' : ''}`} to={`/challenges/${challenge.id}`} key={challenge.id} aria-current={selected?.id === challenge.id ? 'page' : undefined}><span className={`challenge-list-number ${completedChallenges.includes(challenge.id) ? 'is-complete' : ''}`}>{completedChallenges.includes(challenge.id) ? <CheckCircle2 size={18} aria-label={t('lesson.completed')} /> : String(index + 1).padStart(2, '0')}</span><span><strong>{challenge.title}</strong><small>{course ? localizeCourse(course, locale).title : ''} <span aria-hidden="true">·</span> {challenge.topic} <span aria-hidden="true">·</span> {locale === 'id' ? difficultyLabelsId[challenge.difficulty] : challenge.difficulty}</small></span><ArrowRight size={14} aria-hidden="true" /></Link> })}{!filtered.length && <div className="reference-empty"><h2>{t('challenges.empty')}</h2><p>{t('challenges.emptyLead')}</p><button className="button secondary" onClick={clearFilters}>{t('challenges.reset')}</button></div>}</nav>
      {selected ? <article className="challenge-workspace"><header className="challenge-workspace-heading"><span className="eyebrow"><Code2 size={16} aria-hidden="true" /> {selected.topic}</span>{completedChallenges.includes(selected.id) && <span className="challenge-completed-label"><CheckCircle2 size={15} aria-hidden="true" /> {t('lesson.completed')}</span>}<h2>{selected.title}</h2></header><ChallengeBlock key={selected.id} challenge={selected} onComplete={() => { const lesson = getLessonForChallenge(selected.id); if (lesson) completeLesson(lesson.id) }} /><p className="challenge-persistence-note">{storageAvailable ? t('challenges.saved') : t('challenges.session')}</p></article> : <section className="reference-empty"><Code2 size={30} aria-hidden="true" /><h2>{t('challenges.empty')}</h2><p>{t('challenges.emptyLead')}</p></section>}
    </div>
  </div>
}
