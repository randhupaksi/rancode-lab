import { ArrowDown, ArrowRight, BookOpen, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import HomeDemo from '../features/home/HomeDemo'
import { courses, lessons, getLesson, lessonPath } from '../content'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/localize'

export default function HomePage() {
  const { locale, t } = useLocale()
  usePageTitle(t('home.heading'))
  const { lastLesson, completedLessons } = useProgress()
  const last = lastLesson ? getLesson(lastLesson) : undefined
  const completed = lessons.filter(lesson => completedLessons.includes(lesson.id)).length
  return <div className="home-page page-width">
    <section className="home-intro">
      <div><p className="eyebrow"><span className="small-rule"/> {t('home.eyebrow')}</p><h1>{t('home.heading')}<br/>{t('home.headingEmphasis').split(' ')[0]} <span className="serif-emphasis">{t('home.headingEmphasis').split(' ').slice(1).join(' ')}</span></h1></div>
      <div className="home-intro-copy"><p>{t('home.lead')}</p><Link className="button primary" to={last ? lessonPath(last) : '/learn'} >{last ? t('course.continueLearning') : t('home.explorePaths')}<ArrowRight size={16}/></Link><span className="quiet-note">{t('home.free')}</span></div>
    </section>
    <div className="demo-prelude"><span><span className="number-label">01 /</span> {t('home.change')}</span><span>{t('home.tryBelow')} <ArrowDown size={13}/></span></div>
    <HomeDemo/>
    {last && <Link className="resume-strip" to={lessonPath(last)}><div><span className="eyebrow">{t('home.resume')}</span><strong>{last.title}</strong></div><span>{t('home.lessonsComplete', { completed, total: lessons.length })} <ArrowRight size={18}/></span></Link>}
    <section className="home-course">
      <div className="course-intro"><span className="eyebrow">{t('home.stack')}</span><h2>{t('home.fromTypes')}<br/>{t('home.toApps')}</h2><p>{t('home.stackLead')}</p><Link className="text-link" to="/learn">{t('home.everyPath')} <ArrowRight size={16}/></Link><div className="course-facts"><span><BookOpen size={15}/>{lessons.length} {t('home.focusedLessons')}</span><span><Layers3 size={15}/>{courses.length} {t('home.connectedPaths')}</span></div></div>
      <div className="course-preview">{courses.map((rawCourse, index) => { const course = localizeCourse(rawCourse, locale); return <Link key={course.id} to={`/learn/${course.id}`}><span className="number-label">0{index + 1}</span><div><h3>{course.title}</h3><p>{course.description}</p></div><ArrowRight size={17}/></Link> })}<Link className="course-preview-rest" to="/explore">{t('home.browseConcepts')} <ArrowRight size={14}/></Link></div>
    </section>
    <section className="learning-rhythm"><span className="eyebrow">{t('home.rhythm')}</span><div>{[['home.seeIdea', 'home.seeIdeaBody'], ['home.changeTitle', 'home.changeBody'], ['home.ownTitle', 'home.ownBody']].map(([title, body], i) => <article key={title}><span className="rhythm-number">0{i + 1}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div></section>
  </div>
}
