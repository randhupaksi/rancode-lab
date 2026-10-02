import { ArrowRight, BookOpen, Clock3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { courses, getCourseLessons, getCourseModules, lessonPath } from '../content'
import { localizeCourse } from '../content/localize'
import { useLocale } from '../features/locale/LocaleProvider'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'

export default function CourseHubPage() {
  const { locale, t } = useLocale()
  usePageTitle(t('nav.learn'))
  const { completedLessons } = useProgress()
  return <div className="page-width course-hub-page">
    <header className="course-hub-header"><p className="eyebrow">{t('hub.eyebrow')}</p><h1 className="page-heading">{t('hub.heading')}<br/><span className="serif-emphasis">{t('hub.headingEmphasis')}</span></h1><p className="page-lead">{t('hub.lead')}</p></header>
    <nav className="path-sequence" aria-label={t('hub.sequence')}><span className="eyebrow">{t('hub.sequence')}</span>{courses.map((course, index) => <span className="path-sequence-item" key={course.id}><Link to={`/learn/${course.id}`}>{course.title}</Link>{index < courses.length - 1 && <ArrowRight size={14} aria-hidden="true"/>}</span>)}</nav>
    <section className="course-path-grid" aria-label={t('hub.availablePaths')}>{courses.map((rawCourse, index) => {
      const course = localizeCourse(rawCourse, locale)
      const courseLessons = getCourseLessons(course.id)
      const courseModules = getCourseModules(course.id)
      const completed = courseLessons.filter(lesson => completedLessons.includes(lesson.id)).length
      const next = courseLessons.find(lesson => !completedLessons.includes(lesson.id)) ?? courseLessons[0]
      return <article className={`course-path-card course-${course.id}`} key={course.id}><div className="course-path-top"><img className="course-logo" src={`/logos/${course.id}.svg`} alt=""/><span className="number-label">0{index + 1} / {t('common.path').toUpperCase()}</span></div><p className="eyebrow">{index === 0 ? t('hub.startingPoint') : t('hub.buildsOn', { prerequisite: course.prerequisite })}</p><h2>{course.title}</h2><p>{course.description}</p><div className="course-path-meta"><span><BookOpen size={14}/>{courseModules.length} {t('common.modules')} · {courseLessons.length} {t('common.lessons')}</span><span><Clock3 size={14}/>{course.prerequisite}</span></div><div className="course-path-progress"><span>{completed}/{courseLessons.length} {t('common.complete')}</span><progress max={courseLessons.length} value={completed} aria-label={`${course.title} progress`}/></div><Link className="button secondary" to={`/learn/${course.id}`}>{completed ? t('hub.continuePath') : index === 0 ? t('hub.startHere') : t('hub.viewPath')}<ArrowRight size={15}/></Link>{next && <Link className="path-next" to={lessonPath(next)}>{t('hub.upNext', { title: next.title })}<ArrowRight size={13}/></Link>}</article>
    })}</section>
  </div>
}
