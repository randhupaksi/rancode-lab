import { lazy, Suspense, useEffect, useMemo } from 'react'
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Clock3 } from 'lucide-react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { concepts, getCourse, getCourseLessons, getCourseModules, getLesson, getModuleLessons, lessonPath } from '../content'
import type { Lesson } from '../content'
import ConceptCanvas from '../components/learning/ConceptCanvas'
import ExecutionStepper from '../components/learning/ExecutionStepper'
import LessonLab from '../components/learning/LessonLab'
import StageMilestone from '../features/journey/StageMilestone'
import FrameworkSetup from '../features/journey/FrameworkSetup'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import CodeBlock from '../components/ui/CodeBlock'
import ErrorBoundary from '../components/ui/ErrorBoundary'
import SelectField from '../components/ui/SelectField'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeConcept, localizeCourse, localizeLesson, localizeModule } from '../content/localize'

const ChallengeBlock = lazy(() => import('../features/challenges/ChallengeBlock'))

function CourseNavigation({ lesson }: { lesson: Lesson }) {
  const navigate = useNavigate()
  const { completedLessons } = useProgress()
  const { locale, t } = useLocale()
  const sourceCourse = getCourse(lesson.courseId)
  const course = sourceCourse ? localizeCourse(sourceCourse, locale) : undefined
  const courseLessons = getCourseLessons(lesson.courseId ?? 'typescript').map(item => localizeLesson(item, locale))
  const courseModules = getCourseModules(lesson.courseId ?? 'typescript').map(module => localizeModule(module, locale))
  return <aside className="lesson-sidebar" aria-label={`${course?.title ?? ''} ${t('common.path')}`}>
    <Link className="lesson-overview-link" to={`/learn/${lesson.courseId}`}><ArrowLeft size={14} aria-hidden="true"/>{t('lesson.backToPath', { course: course?.title ?? '' })}</Link>
    <div className="lesson-sidebar-heading"><span className="eyebrow">{course?.title}</span><span>{courseLessons.filter(item => completedLessons.includes(item.id)).length}/{courseLessons.length}</span></div>
    <SelectField id="lesson-mobile-select" className="lesson-mobile-select" label={t('lesson.jump')} value={lesson.id} onValueChange={id => { const selected = getLesson(id); if (selected) navigate(lessonPath(selected)) }} options={courseModules.flatMap(module => getModuleLessons(module.id).map(item => localizeLesson(item, locale)).map(item => ({ value: item.id, label: `${completedLessons.includes(item.id) ? '✓ ' : ''}${item.title}`, group: `${module.number} · ${module.title}` })))}/>
    <nav className="lesson-navigation" aria-label={`${course?.title ?? ''} ${t('course.curriculum')}`}>{courseModules.map(module => <details key={module.id} open={module.id === lesson.moduleId}><summary><span className="number-label">{module.number}</span>{module.title}</summary><ol>{getModuleLessons(module.id).map(sourceItem => { const item = localizeLesson(sourceItem, locale); return <li key={item.id}><Link to={lessonPath(item)} aria-current={item.id === lesson.id ? 'page' : undefined} className={completedLessons.includes(item.id) ? 'is-complete' : undefined}><span>{item.title}</span>{completedLessons.includes(item.id) && <Check size={13} aria-label={t('lesson.completed')}/>}</Link></li>})}</ol></details>)}</nav>
  </aside>
}

function LessonContent({ lesson }: { lesson: Lesson }) {
  const { completeLesson, completedLessons, storageAvailable } = useProgress()
  const { locale, t } = useLocale()
  const c = useLearningCopy()
  const done = completedLessons.includes(lesson.id)
  const courseLessons = getCourseLessons(lesson.courseId ?? 'typescript').map(item => localizeLesson(item, locale))
  const sourceCourse = getCourse(lesson.courseId)
  const course = sourceCourse ? localizeCourse(sourceCourse, locale) : undefined
  const index = courseLessons.findIndex(item => item.id === lesson.id)
  const previous = courseLessons[index - 1]
  const next = courseLessons[index + 1]
  const sourceModule = getCourseModules(lesson.courseId ?? 'typescript').find(item => item.id === lesson.moduleId)
  const module = sourceModule ? localizeModule(sourceModule, locale) : undefined

  return <article className="lesson-content">
    <header className="lesson-header">
      <div className="lesson-breadcrumb"><Link to={`/learn/${lesson.courseId}`}>{course?.title}</Link><span aria-hidden="true">/</span><span>{module?.title}</span></div>
      <div className="lesson-header-meta"><span className="eyebrow">{t('lesson.of', { current: String(index + 1).padStart(2, '0'), total: courseLessons.length })}</span><span><Clock3 size={13} aria-hidden="true"/>{lesson.minutes} {t('common.min')}</span>{done && <span className="completion-label"><CheckCircle2 size={14} aria-hidden="true"/>{t('lesson.completed')}</span>}</div>
      <h1>{lesson.title}</h1><p className="section-description">{lesson.description}</p>
      <nav className="lesson-section-nav" aria-label={lesson.title}>{[['explain', 'lesson.explain'], ['visualize', 'lesson.visualize'], ['play', 'lesson.play'], ['challenge', 'lesson.challenge'], ['recap', 'lesson.recap']].map(([section, label]) => <a href={`#${section}`} key={section}>{section === 'play' && lesson.promptExample ? c('Write a prompt', 'Tulis prompt') : t(label)}</a>)}</nav>
    </header>

    <section className="lesson-section" id="explain" aria-labelledby="explain-title"><span className="lesson-section-label">01 / {t('lesson.understand')}</span><h2 id="explain-title">{t('lesson.idea')}</h2><div className="lesson-prose">{lesson.explanation.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</div>{lesson.comparison && <div className="code-comparison"><div><h3>{lesson.comparison.beforeLabel}</h3><CodeBlock code={lesson.comparison.before} language={lesson.language ?? (lesson.comparison.beforeLabel === 'JavaScript' ? 'javascript' : 'typescript')}/></div><div><h3>{lesson.comparison.afterLabel}</h3><CodeBlock code={lesson.comparison.after} language={lesson.courseId === 'react' ? 'jsx' : lesson.courseId === 'nextjs' || lesson.comparison.afterLabel.includes('TSX') ? 'tsx' : 'typescript'}/></div></div>}</section>

    <section className="lesson-section" id="visualize" aria-labelledby="visualize-title"><span className="lesson-section-label">02 / {t('lesson.relationship')}</span><h2 id="visualize-title">{lesson.visual.title}</h2><p className="section-description">{lesson.visual.description}</p><ConceptCanvas visual={lesson.visual}/>{lesson.steps && <ExecutionStepper code={lesson.code} steps={lesson.steps}/>}</section>

    <section className="lesson-section" id="play" aria-labelledby="play-title"><span className="lesson-section-label">03 / {t('lesson.try')}</span><h2 id="play-title">{lesson.promptExample ? c('Make this prompt your own', 'Sesuaikan prompt ini untuk idemu') : lesson.practice ? c('Try it, then explain what changed', 'Coba, lalu jelaskan perubahannya') : t('lesson.change')}</h2><p className="section-description">{lesson.practice ?? t('lesson.editorLead')}</p>{(lesson.courseId === 'react' || lesson.courseId === 'nextjs') && <><FrameworkSetup framework={lesson.courseId}/>{lesson.courseId === 'nextjs' && <p className="quiet-note">{c('New to the type annotations in these examples?', 'Belum kenal anotasi type di contoh ini?')} <Link className="text-link" to="/learn/typescript">{c('Review the TypeScript path', 'Pelajari dasar TypeScript')}</Link>.</p>}</>}<LessonLab lesson={lesson}/>{(lesson.lab !== 'read' || lesson.promptExample) && <Link className="text-link" to={`/playground?example=${lesson.id}`}>{t('lesson.playground')} <ArrowRight size={14} aria-hidden="true"/></Link>}</section>

    <section className="lesson-section" id="challenge" aria-labelledby="challenge-title"><span className="lesson-section-label">04 / {t('lesson.checkUnderstanding')}</span><h2 id="challenge-title">{lesson.challenge.title}</h2>{done && <p className="quiet-note">{t('lesson.completed')}</p>}<ErrorBoundary compact><Suspense fallback={<div className="loading-note" role="status">{t('layout.loading')}</div>}><ChallengeBlock challenge={lesson.challenge} onComplete={() => completeLesson(lesson.id)}/></Suspense></ErrorBoundary></section>

    <section className="lesson-section lesson-recap" id="recap" aria-labelledby="recap-title"><span className="lesson-section-label">05 / {t('lesson.takeWithYou')}</span><h2 id="recap-title">{t('lesson.remember')}</h2><ul>{lesson.recap.map(item => <li key={item}><Check size={15} aria-hidden="true"/><span>{item}</span></li>)}</ul><div className="lesson-completion-note" role="status">{done ? <><CheckCircle2 size={16} aria-hidden="true"/><span>{storageAvailable ? t('lesson.done') : t('lesson.doneSession')}</span></> : <span>{t('lesson.completePrompt')}</span>}</div><div className="related-concepts"><span className="eyebrow">{t('lesson.exploreFurther')}</span><div>{lesson.relatedConcepts.map(id => { const concept = concepts.find(item => item.id === id); const conceptLesson = concept ? getLesson(concept.lessonId) : undefined; const localizedConcept = concept && conceptLesson ? localizeConcept(concept, conceptLesson, locale) : concept; return localizedConcept ? <Link to={`/explore/${id}`} key={id}>{localizedConcept.title}<ArrowRight size={12} aria-hidden="true"/></Link> : null })}</div></div></section>

    {!next && <StageMilestone courseId={lesson.courseId!}/>}
    <nav className="lesson-pagination" aria-label={t('lesson.paths')}><div>{previous ? <Link to={lessonPath(previous)}><span><ArrowLeft size={13} aria-hidden="true"/>{t('lesson.previous')}</span><strong>{previous.title}</strong></Link> : <Link to={`/learn/${lesson.courseId}`}><span><ArrowLeft size={13} aria-hidden="true"/>{t('lesson.backTo')}</span><strong>{course?.title} {t('common.path')}</strong></Link>}</div><div>{next ? <Link to={lessonPath(next)}><span>{t('lesson.next')}<ArrowRight size={13} aria-hidden="true"/></span><strong>{next.title}</strong></Link> : <Link to={`/learn/${lesson.courseId}/checkpoint`}><span>{c('Next step', 'Langkah berikutnya')}<ArrowRight size={13} aria-hidden="true"/></span><strong>{c('Stage knowledge check', 'Cek pemahaman tahap ini')}</strong></Link>}</div></nav>
  </article>
}

export default function LessonPage() {
  const { courseId, lessonId } = useParams<{ courseId: string; lessonId: string }>()
  const sourceLesson = getLesson(lessonId)
  const { locale, t } = useLocale()
  const lesson = useMemo(() => sourceLesson ? localizeLesson(sourceLesson, locale) : undefined, [sourceLesson, locale])
  const { visitLesson } = useProgress()
  usePageTitle(lesson?.title ?? t('lesson.missing'))
  useEffect(() => { if (lesson && lesson.courseId === courseId) visitLesson(lesson.id) }, [lesson, courseId, visitLesson])

  if (!lesson || lesson.courseId !== courseId) return <Navigate to="/learn" replace/>
  return <div className="lesson-layout page-width"><CourseNavigation lesson={lesson}/><LessonContent lesson={lesson} key={lesson.id}/></div>
}
