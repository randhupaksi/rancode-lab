import { ArrowRight, Check, Flag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCourse, getCourseLessons, lessons } from '../content'
import { journey } from '../content/journey'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { recommendNext } from '../features/journey/recommendation'

export default function LearningPathPage() {
  const c = useLearningCopy()
  usePageTitle(c('Your frontend learning path', 'Jalur belajar frontend-mu'))
  const progress = useProgress()
  const next = recommendNext(progress)
  const startIndex = Math.max(0, journey.findIndex(stage => stage.courseId === progress.learningProfile?.startCourseId))
  const completedStages = journey.filter(stage => progress.checkpoints[stage.courseId]?.passed && progress.projects[stage.courseId]?.completed).length
  const completedLessons = lessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length
  return <div className="page-width journey-page">
    <header className="journey-heading journey-hub-heading"><div><p className="eyebrow">{c('The frontend learning path', 'Jalur belajar frontend')}</p><h1>{c('From your first idea', 'Dari ide pertamamu')}<br/><span className="serif-emphasis">{c('to an app of your own.', 'sampai aplikasi buatanmu.')}</span></h1><p className="page-lead">{c('Build your foundations, connect the ideas, and make something at every stage.', 'Bangun fondasi, hubungkan ide-idenya, dan buat sesuatu di setiap tahap.')}</p></div><div className="journey-progress-summary"><strong>{completedStages}<span> / {journey.length}</span></strong><p>{c('stages reviewed', 'tahap sudah direview')}</p><progress value={completedStages} max={journey.length} aria-label={c('Stages completed', 'Tahap selesai')}/><small>{completedLessons} {c('lessons completed', 'pelajaran selesai')}</small></div></header>
    <section className="journey-next" aria-labelledby="next-step-heading"><div><p className="eyebrow">{progress.learningProfile ? c('Your next step', 'Langkah berikutnya') : c('New here?', 'Baru mulai?')}</p><h2 id="next-step-heading">{progress.learningProfile ? next.kind === 'finished' ? c('Your chosen path is complete.', 'Jalur pilihanmu sudah selesai.') : next.title : c('Find a comfortable starting point.', 'Temukan titik mulai yang pas.')}</h2><p>{progress.learningProfile ? next.kind === 'finished' ? c('Revisit a project or explore stages you skipped.', 'Tinjau proyek atau jelajahi tahap yang kamu lewati.') : `${getCourse(next.courseId)?.title} · ${c('One focused step at a time.', 'Satu langkah terarah setiap saat.')}` : c('Start from zero or use a short readiness check to join further along.', 'Mulai dari nol atau gunakan cek kesiapan singkat untuk masuk di tahap lanjutan.')}</p></div><div className="journey-next-actions"><Link className="button primary" to={progress.learningProfile ? next.url : '/start'}>{progress.learningProfile ? next.kind === 'finished' ? c('Review capstone', 'Tinjau proyek akhir') : c('Continue learning', 'Lanjut belajar') : c('Find my starting point', 'Temukan titik mulainya')}<ArrowRight size={16}/></Link>{progress.learningProfile && <Link className="text-link" to="/start">{c('Change starting point', 'Ganti titik awal')}</Link>}</div></section>
    <div className="journey-map-heading"><div><h2>{c('Your journey, step by step', 'Perjalananmu, selangkah demi selangkah')}</h2><p className="muted">{c('Learn → check understanding → build a project. Every stage stays open.', 'Belajar → cek pemahaman → buat proyek. Semua tahap tetap terbuka.')}</p></div><Link className="text-link" to="/projects">{c('View all projects', 'Lihat semua proyek')}<ArrowRight size={15}/></Link></div>
    <ol className="journey-map">{journey.map((stage, index) => {
      const course = getCourse(stage.courseId)!
      const courseLessons = getCourseLessons(course.id)
      const learned = courseLessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length
      const checked = progress.checkpoints[course.id]?.passed
      const built = progress.projects[course.id]?.completed
      const done = Boolean(checked && built)
      const current = next.kind !== 'finished' && course.id === next.courseId && Boolean(progress.learningProfile)
      return <li className={`journey-stage ${current ? 'is-current' : ''} ${done ? 'is-complete' : ''}`} key={course.id}>
        <span className="journey-stage-marker" aria-label={`${c('Stage', 'Tahap')} ${index + 1}`}>{done ? <Check size={18}/> : String(index + 1).padStart(2, '0')}</span>
        <div className="journey-stage-body"><div className="journey-stage-top"><span className="eyebrow">{index < 2 ? c('Get oriented', 'Mulai mengenal') : index < 6 ? c('Build your foundations', 'Bangun fondasi') : c('Build complete interfaces', 'Bangun antarmuka utuh')}</span>{done ? <span className="stage-status">{c('Stage complete', 'Tahap selesai')}</span> : current ? <span className="stage-status">{c('Recommended next', 'Disarankan berikutnya')}</span> : index < startIndex ? <span className="quiet-note">{c('Before your chosen starting point', 'Sebelum titik awal pilihanmu')}</span> : null}</div>
          <h3><Link to={`/learn/${course.id}`}>{['react', 'typescript', 'nextjs'].includes(course.id) && <img className="journey-course-logo" src={`/logos/${course.id}.svg`} alt=""/>}{course.title}</Link></h3><p>{stage.outcome}</p>
          <div className="stage-evidence"><span>{learned}/{courseLessons.length} {c('lessons', 'pelajaran')}</span><span>{checked ? '✓ ' : ''}{c('Checkpoint', 'Checkpoint')}{checked ? c(' passed', ' lulus') : ''}</span><span>{built ? '✓ ' : ''}{c('Project', 'Proyek')}{built ? c(' reviewed', ' direview') : ''}</span></div>
          <div className="stage-actions"><Link className={current ? 'button secondary small' : 'text-link'} to={`/learn/${course.id}`}>{c('Open stage', 'Buka tahap')}<ArrowRight size={14}/></Link><Link className="text-link stage-project-link" to={`/projects/${course.id}`}><Flag size={13}/>{stage.project.title}</Link></div>
        </div>
      </li>
    })}</ol>
    <p className="journey-footnote quiet-note">{c('Lesson completion, checkpoint results, and project reviews are tracked separately. Skipped stages are not marked complete.', 'Pelajaran selesai, hasil checkpoint, dan review proyek dicatat terpisah. Tahap yang dilewati tidak ditandai selesai.')}</p>
  </div>
}
