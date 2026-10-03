import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCourse } from '../content'
import { journey } from '../content/journey'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/localize'
import { localizeJourneyStage } from '../content/journey-localize'

export default function ProjectsPage() {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const { projects } = useProgress()
  usePageTitle(c('Your learning projects', 'Proyek belajarmu'))
  return <div className="page-width journey-page"><header className="journey-heading"><p className="eyebrow">{c('Put it into practice', 'Terapkan dalam praktik')}</p><h1>{c('Something to show for every stage.', 'Ada hasil nyata di setiap tahap.')}</h1><p className="page-lead">{c('Build a small project, record what you checked, and connect it to the next stage. Drafts stay in this browser.', 'Buat proyek kecil, catat yang sudah diperiksa, lalu hubungkan dengan tahap berikutnya. Draft tersimpan di browser ini.')}</p></header><div className="project-index">{journey.map((sourceStage, index) => { const stage = localizeJourneyStage(sourceStage, locale); const course = getCourse(stage.courseId); return <Link className="project-index-row" key={stage.courseId} to={`/projects/${stage.courseId}`}><span className="number-label">{String(index + 1).padStart(2, '0')}</span><div><span className="eyebrow">{course ? localizeCourse(course, locale).title : ''}</span><h2>{stage.project.title}</h2><p>{stage.project.brief}</p></div><span className="project-index-state">{projects[stage.courseId]?.completed ? c('Reviewed', 'Sudah direview') : projects[stage.courseId] ? c('Draft saved', 'Draft tersimpan') : c('Start project', 'Mulai proyek')}<ArrowRight size={16}/></span></Link>})}</div><Link className="text-link" to="/learn">{c('Back to my learning path', 'Kembali ke jalur belajarku')}<ArrowRight size={14}/></Link></div>
}
