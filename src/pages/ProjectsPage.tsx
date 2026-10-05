import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import { getCourse } from '../content/runtime/catalog'
import { projectStages as journey } from '../content/runtime/catalog'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/runtime/localize'
import { localizeJourneyStage } from '../content/runtime/localize'

export default function ProjectsPage() {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const { projects } = useProgress()
  usePageTitle(c('Your learning projects', 'Proyek belajarmu'))
  return <div className="page-width journey-page"><header className="journey-heading"><p className="eyebrow">{c('Put it into practice', 'Terapkan dalam praktik')}</p><h1>{c('Something to show for every stage', 'Ada hasil nyata di setiap tahap')}</h1><p className="page-lead">{c('Build a small project, note what you checked, and connect it to the next stage. Your drafts stay in this browser.', 'Buat proyek kecil, catat hal yang sudah kamu periksa, lalu lanjut ke tahap berikutnya. Drafmu tersimpan di browser ini.')}</p></header><div className="project-index">{journey.map((sourceStage, index) => { const stage = localizeJourneyStage(sourceStage, locale); const course = getCourse(stage.courseId); return <Link className="project-index-row" key={stage.courseId} to={`/projects/${stage.courseId}`}><span className="number-label">{course?.path === 'companion' ? '+' : String(index + 1).padStart(2, '0')}</span><div><span className="eyebrow">{course ? localizeCourse(course, locale).title : ''}{course?.path === 'companion' ? ' · ' + c('Companion project', 'Proyek pendamping') : ''}</span><h2>{stage.project.title}</h2><p>{stage.project.brief}</p></div><span className="project-index-state">{projects[stage.courseId]?.completed ? c('Reviewed', 'Sudah ditinjau') : projects[stage.courseId] ? c('Draft saved', 'Draf tersimpan') : c('Start project', 'Mulai proyek')}<ArrowRight size={16}/></span></Link>})}</div><TextLink to="/learn">{c('Back to my learning path', 'Kembali ke jalur belajarku')}<ArrowRight size={14}/></TextLink></div>
}
