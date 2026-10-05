import { ArrowRight, Check, CheckCircle2, Clock3, Play } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import { getCourse, getCourseLessons, getCourseModules, getModuleLessons, getNextCourse, lessonPath } from '../content/runtime/catalog'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse, localizeLesson, localizeModule } from '../content/runtime/localize'
import StageMilestone from '../features/journey/StageMilestone'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { getStage, journey } from '../content/runtime/catalog'
import { localizeJourneyStage } from '../content/runtime/localize'
import AiCodingOrientation from '../features/ai-coding/AiCodingOrientation'
import AiCodingEntry from '../features/ai-coding/AiCodingEntry'
import TailwindEntry from '../features/tailwind/TailwindEntry'
import TailwindOrientation from '../features/tailwind/TailwindOrientation'

export default function CoursePage() {
  const { courseId } = useParams()
  const sourceCourse = getCourse(courseId)
  const { locale, t } = useLocale()
  const { completedLessons, lastLesson, storageAvailable, checkpoints, projects } = useProgress()
  const c = useLearningCopy()
  const localizedSourceCourse = sourceCourse ? localizeCourse(sourceCourse, locale) : undefined
  usePageTitle(`${t('nav.learn')} ${localizedSourceCourse?.title ?? ''}`)
  if (!sourceCourse) return <Navigate to="/learn" replace/>
  const course = localizedSourceCourse!
  const courseLessons = getCourseLessons(course.id).map(lesson => localizeLesson(lesson, locale))
  const courseModules = getCourseModules(course.id).map(module => localizeModule(module, locale))
  const completed = courseLessons.filter(lesson => completedLessons.includes(lesson.id)).length
  const last = courseLessons.find(lesson => lesson.id === lastLesson)
  const next = last && !completedLessons.includes(last.id) ? last : courseLessons.find(lesson => !completedLessons.includes(lesson.id))
  const passed = checkpoints[course.id]?.passed
  const reviewed = passed && projects[course.id]?.completed
  const nextCourse = getNextCourse(course.id)
  const destination = reviewed ? nextCourse ? '/learn/' + nextCourse.id : '/learn' : passed ? '/projects/' + course.id : next ? lessonPath(next) : '/learn/' + course.id + '/checkpoint'
  const actionLabel = reviewed ? c('Continue the journey', 'Lanjutkan jalur belajar') : passed ? c('Open stage project', 'Buka proyek tahap ini') : !next ? c('Open the knowledge check', 'Mulai cek pemahaman') : completed || last ? t('course.continueLearning') : t('course.startFirst')
  const totalMinutes = courseLessons.reduce((total, lesson) => total + lesson.minutes, 0)
  const stage = getStage(course.id)
  return <div className={`course-page page-width course-page-${course.id}`}>
    <div className="course-journey-context"><TextLink tone="muted" to="/learn">{c('My learning path', 'Jalur belajarku')}</TextLink><span>{course.path === 'companion' ? course.id === 'tailwind' ? c('Companion path · after CSS foundations', 'Jalur pendamping · setelah fondasi CSS') : c('Companion path · after browser foundations', 'Jalur pendamping · setelah fondasi browser') : `${c('Stage', 'Tahap')} ${journey.findIndex(item => item.courseId === course.id) + 1} / ${journey.length}`}</span><p>{stage ? localizeJourneyStage(stage, locale).outcome : null}</p></div>
    <header className="course-header"><div><p className="eyebrow">{course.eyebrow}</p><h1>{course.title}<br/><span className="serif-emphasis">{t('course.headingEmphasis')}</span></h1><p className="section-description">{course.description}</p><div className="course-facts"><span>{courseModules.length} {t('common.modules')}</span><span>{courseLessons.length} {t('common.lessons')}</span><span><Clock3 size={14} aria-hidden="true"/>{t('course.aboutHours', { hours: Math.max(1, Math.round(totalMinutes / 60)) })}</span></div><p className="quiet-note">{t('course.startingPoint', { prerequisite: course.prerequisite })}</p></div><div className="course-progress"><span className="eyebrow">{t('course.progress', { course: course.title })}</span><p className="course-progress-count"><strong>{completed}</strong><span> / {courseLessons.length} {t('common.lessons')}</span></p><progress value={completed} max={courseLessons.length} aria-label={`${course.title} ${t('common.complete')}`}/><p>{reviewed ? c('Your knowledge check and project are reviewed. Revisit a lesson or keep going.', 'Cek pemahaman dan proyekmu sudah ditinjau. Ulangi pelajaran atau lanjutkan belajar.') : passed ? c('You passed the knowledge check. Put what you learned into your stage project.', 'Kamu lulus cek pemahaman. Terapkan yang sudah dipelajari di proyek tahap ini.') : completed === courseLessons.length ? t('course.finished') : next ? completed ? t('course.upNext', { title: next.title }) : t('course.beginWith', { title: next.title }) : t('course.chooseLesson')}</p><Link className="button primary" to={destination}>{actionLabel}<ArrowRight size={16}/></Link><span className="quiet-note">{storageAvailable ? t('course.saved') : t('course.storageUnavailable')}</span></div></header>
    {course.id === 'ai-coding' && <AiCodingOrientation/>}
    {course.id === 'tailwind' && <TailwindOrientation/>}
    <section className="curriculum" aria-labelledby="curriculum-title"><div className="section-heading"><div><p className="eyebrow">{t('course.roadmap')}</p><h2 id="curriculum-title">{t('course.roadmapHeading')}</h2></div><span className="quiet-note">{t('course.roadmapLead')}</span></div>{courseModules.map(module => { const moduleLessons = getModuleLessons(module.id).map(lesson => localizeLesson(lesson, locale)); const moduleCompleted = moduleLessons.filter(lesson => completedLessons.includes(lesson.id)).length; return <section className="module-row" id={module.id} key={module.id}><div className="module-description"><span className="number-label">{module.number}</span><h3>{module.title}</h3><p>{module.description}</p><span className="module-completion">{moduleCompleted === moduleLessons.length ? <CheckCircle2 size={14}/> : null}{moduleCompleted} / {moduleLessons.length} {t('common.complete')}</span></div><ol className="module-lessons">{moduleLessons.map(lesson => { const done = completedLessons.includes(lesson.id); const current = !done && lesson.id === lastLesson; return <li key={lesson.id}><Link to={lessonPath(lesson)} className={done ? 'is-complete' : current ? 'is-current' : ''}><span className={`lesson-status ${done ? 'complete' : current ? 'in-progress' : ''}`}>{done ? <Check size={14}/> : current ? <Play size={11}/> : <span/>}</span><span className="module-lesson-name">{lesson.title}{current && <small>{t('course.inProgress')}</small>}</span><span className="lesson-duration">{lesson.minutes} {t('common.min')}</span><ArrowRight size={15}/></Link></li> })}</ol></section> })}</section>
    <StageMilestone courseId={course.id}/>
    {['css', 'react', 'nextjs'].includes(course.id) && <TailwindEntry/>}
    {['browser', 'react', 'nextjs'].includes(course.id) && <AiCodingEntry/>}
    <div className="course-outro"><p>{t('course.switchContext')}</p><TextLink to="/learn">{t('course.browsePaths')} <ArrowRight size={15}/></TextLink></div>
  </div>
}
