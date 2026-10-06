import { ArrowRight, Braces, Blocks, Check, Flag, PanelsTopLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import { getCourse, getCourseLessons, lessons } from '../content/runtime/catalog'
import { journey } from '../content/runtime/catalog'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { getCompanionPathProgress } from '../features/journey/companion-path-progress'
import { recommendNext } from '../features/journey/recommendation'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse, localizeLesson } from '../content/runtime/localize'
import { localizeJourneyStage } from '../content/runtime/localize'

export default function LearningPathPage() {
  const c = useLearningCopy()
  const { locale } = useLocale()
  usePageTitle(c('Your frontend learning path', 'Jalur belajar frontend-mu'))
  const progress = useProgress()
  const next = recommendNext(progress)
  const startIndex = Math.max(0, journey.findIndex(stage => stage.courseId === progress.learningProfile?.startCourseId))
  const completedStages = journey.filter(stage => progress.checkpoints[stage.courseId]?.passed && progress.projects[stage.courseId]?.completed).length
  const completedLessons = lessons.filter(lesson => getCourse(lesson.courseId)?.path !== 'companion' && progress.completedLessons.includes(lesson.id)).length
  const localizedStages = journey.map(stage => localizeJourneyStage(stage, locale))
  const extendedStages = [
    {
      courseId: 'tailwind',
      progress: getCompanionPathProgress('tailwind', progress),
      timing: c('After HTML and CSS', 'Setelah HTML dan CSS'),
      description: c('Learn from setup to responsive layouts, themes, and reusable components.', 'Pelajari dari instalasi sampai layout responsif, tema, dan komponen yang bisa dipakai ulang.'),
    },
    {
      courseId: 'ai-coding',
      progress: getCompanionPathProgress('ai-coding', progress),
      timing: c('Build exercises after web basics', 'Latihan setelah dasar web'),
      description: c('Practice writing clear prompts, guiding an AI coding agent, and reviewing the app it builds.', 'Latih prompt yang jelas, arahkan AI coding agent, lalu tinjau aplikasi yang dihasilkan.'),
    },
  ]
  const recommendedTitle = (() => {
    if (next.kind === 'finished') return c('Your learning path', 'Jalur belajarmu')
    if (next.kind === 'checkpoint') return c('Stage knowledge check', 'Cek pemahaman tahap ini')
    if (next.kind === 'project') return localizedStages.find(stage => stage.courseId === next.courseId)?.project.title ?? next.title
    const lessonId = next.url.split('/').at(-1)
    const lesson = lessons.find(item => item.id === lessonId)
    return lesson ? localizeLesson(lesson, locale).title : next.title
  })()
  return <div className="page-width journey-page">
    <header className="journey-heading journey-hub-heading"><div><p className="eyebrow">{c('The frontend learning path', 'Jalur belajar frontend')}</p><h1>{c('From your first idea', 'Dari ide pertamamu')}<br/><span className="serif-emphasis">{c('to an app of your own', 'sampai aplikasi buatanmu')}</span></h1><p className="page-lead">{c('Build your foundations, connect the ideas, and make something at every stage.', 'Bangun fondasi, hubungkan ide-idenya, dan buat sesuatu di setiap tahap.')}</p></div><div className="journey-progress-summary"><strong>{completedStages}<span> / {journey.length}</span></strong><p>{c('main stages completed', 'tahap utama selesai')}</p><progress value={completedStages} max={journey.length} aria-label={c('Main stages completed', 'Tahap utama selesai')}/><small>{completedLessons} {c('lessons completed', 'pelajaran selesai')}</small></div></header>
    <section className="journey-next" aria-labelledby="next-step-heading"><div><p className="eyebrow">{progress.learningProfile ? c('Your next step', 'Langkah berikutnya') : c('New here?', 'Baru mulai?')}</p><h2 id="next-step-heading">{progress.learningProfile ? next.kind === 'finished' ? c('You have finished this path', 'Kamu sudah menuntaskan jalur ini') : recommendedTitle : c('Find a comfortable starting point', 'Temukan titik mulai yang pas')}</h2><p>{progress.learningProfile ? next.kind === 'finished' ? c('Revisit a project or explore stages you skipped.', 'Tinjau proyek atau jelajahi tahap yang kamu lewati.') : `${localizeCourse(getCourse(next.courseId)!, locale).title} · ${c('One clear step at a time.', 'Satu langkah dulu, lalu lanjut.')}` : c('Start from zero or use a short readiness check to join further along.', 'Mulai dari nol atau gunakan cek kesiapan singkat untuk masuk di tahap lanjutan.')}</p></div><div className="journey-next-actions"><Link className="button primary" to={progress.learningProfile ? next.url : '/start'}>{progress.learningProfile ? next.kind === 'finished' ? c('Review capstone', 'Tinjau proyek akhir') : c('Continue learning', 'Lanjut belajar') : c('Choose where to start', 'Pilih titik awal')}<ArrowRight size={16}/></Link>{progress.learningProfile && <TextLink to="/start">{c('Change starting point', 'Ganti titik awal')}</TextLink>}</div></section>
    <div className="journey-map-heading"><div><h2>{c('Your journey, step by step', 'Perjalananmu, selangkah demi selangkah')}</h2><p className="muted">{c('Steps 01–09 make up the main path. Steps 10–11 build on those foundations with Tailwind and Vibe Coding.', 'Tahap 01–09 membentuk jalur utama. Tahap 10–11 melanjutkannya dengan Tailwind dan Vibe Coding setelah fondasinya.')}</p></div><TextLink to="/projects">{c('View all projects', 'Lihat semua proyek')}<ArrowRight size={15}/></TextLink></div>
    <ol className="journey-map">{localizedStages.map((stage, index) => {
      const course = localizeCourse(getCourse(stage.courseId)!, locale)
      const courseLessons = getCourseLessons(course.id)
      const learned = courseLessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length
      const checked = progress.checkpoints[course.id]?.passed
      const built = progress.projects[course.id]?.completed
      const done = Boolean(checked && built)
      const current = next.kind !== 'finished' && course.id === next.courseId && Boolean(progress.learningProfile)
      return <li className={`journey-stage ${current ? 'is-current' : ''} ${done ? 'is-complete' : ''}`} key={course.id}>
        <span className="journey-stage-marker" aria-label={`${c('Stage', 'Tahap')} ${index + 1}`}>{done ? <Check size={18}/> : String(index + 1).padStart(2, '0')}</span>
        <div className="journey-stage-body"><div className="journey-stage-top"><span className="eyebrow">{index < 2 ? c('Get oriented', 'Mulai mengenal') : index < 6 ? c('Build your foundations', 'Bangun fondasi') : c('Build complete interfaces', 'Bangun antarmuka utuh')}</span>{done ? <span className="stage-status">{c('Stage complete', 'Tahap selesai')}</span> : current ? <span className="stage-status">{c('Recommended next', 'Disarankan berikutnya')}</span> : index < startIndex ? <span className="quiet-note">{c('Before your chosen starting point', 'Sebelum titik awal pilihanmu')}</span> : null}</div>
          <h3><Link to={`/learn/${course.id}`}>{course.id === 'react' ? <Blocks className="journey-course-icon" aria-hidden="true"/> : course.id === 'typescript' ? <Braces className="journey-course-icon" aria-hidden="true"/> : course.id === 'nextjs' ? <PanelsTopLeft className="journey-course-icon" aria-hidden="true"/> : null}{course.title}</Link></h3><p>{stage.outcome}</p>
          <div className="stage-evidence"><span>{learned}/{courseLessons.length} {c('lessons', 'pelajaran')}</span><span>{checked ? '✓ ' : ''}{c('Knowledge check', 'Cek pemahaman')}{checked ? c(' passed', ' selesai') : ''}</span><span>{built ? '✓ ' : ''}{c('Project', 'Proyek')}{built ? c(' reviewed', ' ditinjau') : ''}</span></div>
          <div className="stage-actions">{current ? <Link className="button secondary small" to={`/learn/${course.id}`}>{c('Open stage', 'Buka tahap')}<ArrowRight size={14}/></Link> : <TextLink to={`/learn/${course.id}`}>{c('Open stage', 'Buka tahap')}<ArrowRight size={14}/></TextLink>}<TextLink className="stage-project-link" to={`/projects/${course.id}`}><Flag size={13}/>{stage.project.title}</TextLink></div>
        </div>
      </li>
    })}
      {extendedStages.map((path, index) => {
        const course = localizeCourse(getCourse(path.courseId)!, locale)
        const number = journey.length + index + 1
        const { completed, total, started, checkpointPassed, reviewed, destination } = path.progress
        const action = reviewed ? c('Review your project', 'Tinjau proyekmu')
          : completed === total ? checkpointPassed ? c('Review your project', 'Tinjau proyekmu') : c('Take the knowledge check', 'Cek pemahamanmu')
            : started ? c('Continue this path', 'Lanjutkan jalur ini') : c('Explore this path', 'Jelajahi jalur ini')
        return <li className="journey-stage journey-stage-extended" key={path.courseId}>
          <span className="journey-stage-marker" aria-label={`${c('Stage', 'Tahap')} ${number}`}>{String(number).padStart(2, '0')}</span>
          <div className="journey-stage-body">
            <div className="journey-stage-top"><span className="eyebrow">{c('Continue learning', 'Lanjut belajar')}</span><span className="stage-status">{path.timing}</span></div>
            <h3><Link to={`/learn/${course.id}`}>{course.title}</Link></h3>
            <p>{path.description}</p>
            <div className="stage-evidence"><span>{completed ? `${completed}/${total} ${c('lessons completed', 'pelajaran selesai')}` : `${total} ${c('lessons · 1 practical project', 'pelajaran · 1 proyek praktik')}`}</span></div>
            <div className="stage-actions"><TextLink to={destination}>{action}<ArrowRight size={14}/></TextLink></div>
          </div>
        </li>
      })}
    </ol>
    <p className="journey-footnote quiet-note">{c('Lesson completion, knowledge checks, and project reviews are tracked separately. Skipped stages are not marked complete.', 'Progres pelajaran, cek pemahaman, dan tinjauan proyek dicatat terpisah. Tahap yang dilewati tidak ikut ditandai selesai.')}</p>
  </div>
}
