import { ArrowDown, ArrowRight, BookOpen, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import HomeDemo from '../features/home/BeginnerDemo'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { recommendNext } from '../features/journey/recommendation'
import { courseCount, lessons, getLesson, lessonPath, journey } from '../content/navigation'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'

export default function HomePage() {
  const { locale, t } = useLocale()
  usePageTitle(t('home.heading'))
  const progress = useProgress()
  const { lastLesson, completedLessons, learningProfile } = progress
  const c = useLearningCopy()
  const next = recommendNext(progress)
  const last = lastLesson ? getLesson(lastLesson) : undefined
  const nextLesson = next.kind === 'lesson' ? getLesson(next.url.split('/').pop()) : undefined
  const nextStage = journey.find(stage => stage.courseId === next.courseId)
  const nextTitle = next.kind === 'finished' ? c('Learning dashboard', 'Ringkasan belajar') : next.kind === 'checkpoint' ? c('Stage checkpoint', 'Checkpoint tahap ini') : next.kind === 'lesson' && nextLesson ? (locale === 'id' ? nextLesson.titleId : nextLesson.title) : next.kind === 'project' && nextStage ? (locale === 'id' ? nextStage.project.titleId : nextStage.project.title) : next.title
  const resume = learningProfile ? { url: next.url, title: nextTitle } : last ? { url: lessonPath(last), title: locale === 'id' ? last.titleId : last.title } : null
  const previews = [
    { range: '01–02', courseId: 'logic', title: c('Find your foundations', 'Kenali fondasinya'), description: c('Logic, problem solving, the web, and your tools.', 'Logika, pemecahan masalah, web, dan tools yang kamu pakai.') },
    { range: '03–06', courseId: 'html', title: c('Build your first website', 'Buat website pertamamu'), description: c('HTML, CSS, JavaScript, and browser interactions.', 'HTML, CSS, JavaScript, dan interaksi di browser.') },
    { range: '07–09', courseId: 'react', title: c('Bring an application together', 'Rangkai aplikasi yang utuh'), description: c('React components, TypeScript contracts, and Next.js routes.', 'Components React, kontrak TypeScript, dan routes Next.js.') },
  ]
  const completed = lessons.filter(lesson => completedLessons.includes(lesson.id)).length
  return <div className="home-page page-width">
    <section className="home-intro">
      <div><p className="eyebrow"><span className="small-rule"/> {t('home.eyebrow')}</p><h1>{t('home.heading')}<br/>{t('home.headingEmphasis').split(' ')[0]} <span className="serif-emphasis">{t('home.headingEmphasis').split(' ').slice(1).join(' ')}</span></h1></div>
      <div className="home-intro-copy"><p>{t('home.lead')}</p><Link className="button primary" to={learningProfile ? next.url : '/start'} >{learningProfile ? t('course.continueLearning') : c('Find my starting point', 'Temukan titik mulainya')}<ArrowRight size={16}/></Link><span className="quiet-note">{t('home.free')}</span><Link className="text-link" to="/learn">{c('See the complete learning path', 'Lihat seluruh jalur belajar')}<ArrowRight size={14}/></Link></div>
    </section>
    <div className="demo-prelude"><span><span className="number-label">01 /</span> {t('home.change')}</span><span>{t('home.tryBelow')} <ArrowDown size={13}/></span></div>
    <HomeDemo/>
    {resume && <Link className="resume-strip" to={resume.url}><div><span className="eyebrow">{t('home.resume')}</span><strong>{resume.title}</strong></div><span>{t('home.lessonsComplete', { completed, total: lessons.length })} <ArrowRight size={18}/></span></Link>}
    <section className="home-course">
      <div className="course-intro"><span className="eyebrow">{t('home.stack')}</span><h2>{t('home.fromTypes')}<br/>{t('home.toApps')}</h2><p>{t('home.stackLead')}</p><Link className="text-link" to="/learn">{t('home.everyPath')} <ArrowRight size={16}/></Link><div className="course-facts"><span><BookOpen size={15}/>{lessons.length} {t('home.focusedLessons')}</span><span><Layers3 size={15}/>{courseCount} {t('home.connectedPaths')}</span></div></div>
      <div className="course-preview">{previews.map(preview => <Link key={preview.courseId} to={`/learn/${preview.courseId}`}><span className="number-label">{preview.range}</span><div><h3>{preview.title}</h3><p>{preview.description}</p></div><ArrowRight size={17}/></Link>)}<Link className="course-preview-rest" to="/explore">{t('home.browseConcepts')} <ArrowRight size={14}/></Link></div>
    </section>
    <section className="learning-rhythm"><span className="eyebrow">{t('home.rhythm')}</span><div>{[['home.seeIdea', 'home.seeIdeaBody'], ['home.changeTitle', 'home.changeBody'], ['home.ownTitle', 'home.ownBody']].map(([title, body], i) => <article key={title}><span className="rhythm-number">0{i + 1}</span><h3>{t(title)}</h3><p>{t(body)}</p></article>)}</div></section>
  </div>
}
