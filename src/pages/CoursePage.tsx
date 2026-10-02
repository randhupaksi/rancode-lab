import { ArrowRight, Check, CheckCircle2, Clock3, Play } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getCourse, getCourseLessons, getCourseModules, getModuleLessons, lessonPath } from '../content'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse, localizeModule } from '../content/localize'

export default function CoursePage() {
  const { courseId } = useParams()
  const sourceCourse = getCourse(courseId)
  const { locale, t } = useLocale()
  const { completedLessons, lastLesson, storageAvailable } = useProgress()
  if (!sourceCourse) return <Navigate to="/learn" replace/>
  const course = localizeCourse(sourceCourse, locale)
  usePageTitle(`Learn ${course.title}`)
  const courseLessons = getCourseLessons(course.id)
  const courseModules = getCourseModules(course.id).map(module => localizeModule(module, locale))
  const completed = courseLessons.filter(lesson => completedLessons.includes(lesson.id)).length
  const last = courseLessons.find(lesson => lesson.id === lastLesson)
  const next = last && !completedLessons.includes(last.id) ? last : courseLessons.find(lesson => !completedLessons.includes(lesson.id))
  const totalMinutes = courseLessons.reduce((total, lesson) => total + lesson.minutes, 0)
  return <div className={`course-page page-width course-page-${course.id}`}>
    <header className="course-header"><div><p className="eyebrow">{course.eyebrow}</p><h1>{course.title}.<br/><span className="serif-emphasis">{t('course.headingEmphasis')}</span></h1><p className="section-description">{course.description}</p><div className="course-facts"><span>{courseModules.length} {t('common.modules')}</span><span>{courseLessons.length} {t('common.lessons')}</span><span><Clock3 size={14} aria-hidden="true"/>{t('course.aboutHours', { hours: Math.max(1, Math.round(totalMinutes / 60)) })}</span></div><p className="quiet-note">{t('course.startingPoint', { prerequisite: course.prerequisite })}</p></div><div className="course-progress"><span className="eyebrow">{t('course.progress', { course: course.title })}</span><p className="course-progress-count"><strong>{completed}</strong><span> / {courseLessons.length} {t('common.lessons')}</span></p><progress value={completed} max={courseLessons.length} aria-label={`${course.title} ${t('common.complete')}`}/><p>{completed === courseLessons.length ? t('course.finished') : next ? completed ? t('course.upNext', { title: next.title }) : t('course.beginWith', { title: next.title }) : t('course.chooseLesson')}</p><Link className="button primary" to={next ? lessonPath(next) : '/challenges'}>{completed === courseLessons.length ? t('course.keepPracticing') : completed || last ? t('course.continueLearning') : t('course.startFirst')}<ArrowRight size={16}/></Link><span className="quiet-note">{storageAvailable ? t('course.saved') : t('course.storageUnavailable')}</span></div></header>
    <section className="curriculum" aria-labelledby="curriculum-title"><div className="section-heading"><div><p className="eyebrow">{t('course.roadmap')}</p><h2 id="curriculum-title">{t('course.roadmapHeading')}</h2></div><span className="quiet-note">{t('course.roadmapLead')}</span></div>{courseModules.map(module => { const moduleLessons = getModuleLessons(module.id); const moduleCompleted = moduleLessons.filter(lesson => completedLessons.includes(lesson.id)).length; return <section className="module-row" id={module.id} key={module.id}><div className="module-description"><span className="number-label">{module.number}</span><h3>{module.title}</h3><p>{module.description}</p><span className="module-completion">{moduleCompleted === moduleLessons.length ? <CheckCircle2 size={14}/> : null}{moduleCompleted} / {moduleLessons.length} {t('common.complete')}</span></div><ol className="module-lessons">{moduleLessons.map(lesson => { const done = completedLessons.includes(lesson.id); const current = !done && lesson.id === lastLesson; return <li key={lesson.id}><Link to={lessonPath(lesson)} className={done ? 'is-complete' : current ? 'is-current' : ''}><span className={`lesson-status ${done ? 'complete' : current ? 'in-progress' : ''}`}>{done ? <Check size={14}/> : current ? <Play size={11}/> : <span/>}</span><span className="module-lesson-name">{lesson.title}{current && <small>{t('course.inProgress')}</small>}</span><span className="lesson-duration">{lesson.minutes} {t('common.min')}</span><ArrowRight size={15}/></Link></li> })}</ol></section> })}</section>
    <div className="course-outro"><p>{t('course.switchContext')}</p><Link className="text-link" to="/learn">{t('course.browsePaths')} <ArrowRight size={15}/></Link></div>
  </div>
}
