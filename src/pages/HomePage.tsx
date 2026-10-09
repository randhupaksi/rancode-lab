import { ArrowDown, ArrowRight, BookOpen, Layers3 } from 'lucide-react'
import { Link } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import HomeDemo from '../features/home/BeginnerDemo'
import HomeLearningTracks from '../features/home/HomeLearningTracks'
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
  const nextTitle = next.kind === 'finished' ? c('Learning dashboard', 'Ringkasan belajar') : next.kind === 'checkpoint' ? c('Stage knowledge check', 'Cek pemahaman tahap ini') : next.kind === 'lesson' && nextLesson ? (locale === 'id' ? nextLesson.titleId : nextLesson.title) : next.kind === 'project' && nextStage ? (locale === 'id' ? nextStage.project.titleId : nextStage.project.title) : next.title
  const resume = learningProfile ? { url: next.url, title: nextTitle } : last ? { url: lessonPath(last), title: locale === 'id' ? last.titleId : last.title } : null
  const previews = [
    { range: '01–02', courseId: 'logic', title: c('Find your foundations', 'Kenali fondasinya'), description: c('Logic, problem solving, web basics, and the tools you need.', 'Logika, dasar web, dan alat yang kamu perlukan.') },
    { range: '03–06', courseId: 'html', title: c('Build your first website', 'Buat website pertamamu'), description: c('HTML, CSS, JavaScript, and browser interactions.', 'HTML, CSS, JavaScript, dan interaksi di browser.') },
    { range: '07–09', courseId: 'react', title: c('Build a complete application', 'Bangun aplikasi yang utuh'), description: c('React components, TypeScript contracts, and Next.js routes.', 'Components React, kontrak TypeScript, dan routes Next.js.') },
  ]
  const learningSteps = [
    { title: c('Get the idea', 'Pahami idenya'), body: c('A short explanation and visual model to make the concept click.', 'Penjelasan singkat dan visual biar konsepnya lebih kebayang.') },
    { title: c('Try it yourself', 'Coba langsung'), body: c('Change a value and see how the result changes.', 'Ubah satu nilai, lalu lihat bagaimana hasilnya berubah.') },
    { title: c('Check what clicked', 'Cek pemahamanmu'), body: c('Try a quick question before moving to the next step.', 'Jawab pertanyaan singkat sebelum lanjut ke langkah berikutnya.') },
  ]
  const completed = lessons.filter(lesson => completedLessons.includes(lesson.id)).length
  return <div className="home-page page-width">
    <section className="home-intro" aria-labelledby="home-heading">
      <p className="eyebrow"><span className="small-rule" aria-hidden="true"/>{t('home.eyebrow')}<span className="small-rule" aria-hidden="true"/></p>
      <h1 id="home-heading">{t('home.heading')}<br/>{t('home.headingEmphasis').split(' ')[0]} <span className="serif-emphasis">{t('home.headingEmphasis').split(' ').slice(1).join(' ')}</span></h1>
      <p className="home-hero-lead">{c('At Rancode Lab, you learn programming by trying ideas as you go. Start with logic and web fundamentals, then turn what you learn into projects of your own.', 'Di Rancode Lab, kamu belajar coding sambil langsung mencoba. Mulai dari logika dan dasar web, lalu kembangkan idemu lewat proyek yang kamu bangun sendiri.')}</p>
      <div className="home-intro-actions">
        <Link className="button primary" to={learningProfile ? next.url : '/start'}>{learningProfile ? t('course.continueLearning') : c('Choose where to start', 'Pilih titik awal')}<ArrowRight size={16}/></Link>
        <Link className="button secondary" to="/learn">{c('Explore the learning path', 'Lihat jalur belajar')}<Layers3 size={15}/></Link>
      </div>
      {learningProfile && <p className="home-next-step">{c('Next up:', 'Berikutnya:')} <span>{nextTitle}</span></p>}
      <span className="quiet-note">{t('home.free')}</span>
    </section>
    <div className="demo-prelude"><span><span className="number-label">01 /</span> {t('home.change')}</span><span>{t('home.tryBelow')} <ArrowDown size={13}/></span></div>
    <HomeDemo/>
    {resume && <Link className="resume-strip" to={resume.url}><div><span className="eyebrow">{t('home.resume')}</span><strong>{resume.title}</strong></div><span>{t('home.lessonsComplete', { completed, total: lessons.length })} <ArrowRight size={18}/></span></Link>}
    <section className="home-course">
      <div className="course-intro"><span className="eyebrow">{t('home.stack')}</span><h2>{t('home.fromTypes')}<br/>{t('home.toApps')}</h2><p>{t('home.stackLead')}</p><TextLink to="/learn">{t('home.everyPath')} <ArrowRight size={16}/></TextLink><div className="course-facts"><span><BookOpen size={15}/>{lessons.length} {t('home.focusedLessons')}</span><span><Layers3 size={15}/>{courseCount} {t('home.connectedPaths')}</span></div></div>
      <div className="course-roadmap"><div className="course-preview">{previews.map(preview => <Link key={preview.courseId} to={`/learn/${preview.courseId}`}><span className="number-label">{preview.range}</span><div><h3>{preview.title}</h3><p>{preview.description}</p></div><ArrowRight size={17} aria-hidden="true"/></Link>)}</div><TextLink className="course-preview-rest" to="/explore">{t('home.browseConcepts')} <ArrowRight size={14} aria-hidden="true"/></TextLink></div>
    </section>
    <HomeLearningTracks/>
    <section className="home-closing-cta" aria-labelledby="learning-rhythm-title">
      <div className="home-closing-copy">
        <span className="eyebrow">{c('A rhythm that makes coding click', 'Belajar coding selangkah demi selangkah')}</span>
        <h2 id="learning-rhythm-title">{c('One idea at a time, Then try it yourself.', 'Satu konsep dulu, Lalu coba sendiri')}</h2>
        <p>{c('Follow a clear explanation, change the example code, and see what happens. Move on when it clicks.', 'Ikuti penjelasannya, ubah contoh kodenya, lalu lihat hasilnya. Kalau sudah paham, lanjut ke langkah berikutnya.')}</p>
        <Link className="button primary" to={learningProfile ? next.url : '/start'}>
          {learningProfile ? t('course.continueLearning') : c('Choose where to start', 'Pilih titik awal')}
          <ArrowRight size={16} aria-hidden="true"/>
        </Link>
      </div>
      <ol className="home-closing-steps">
        {learningSteps.map((step, index) => <li key={step.title}>
          <span className="rhythm-number" aria-hidden="true">0{index + 1}</span>
          <div><h3>{step.title}</h3><p>{step.body}</p></div>
        </li>)}
      </ol>
    </section>
  </div>
}
