import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getCourse } from '../content'
import { getStage } from '../content/journey'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/localize'
import { localizeJourneyStage } from '../content/journey-localize'
import CheckpointQuiz from '../features/journey/CheckpointQuiz'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { useProgress } from '../features/progress/ProgressProvider'
import { usePageTitle } from '../hooks/usePageTitle'

export default function CheckpointPage() {
  const { courseId } = useParams()
  const { locale } = useLocale()
  const sourceCourse = getCourse(courseId)
  const sourceStage = getStage(courseId)
  const course = sourceCourse ? localizeCourse(sourceCourse, locale) : undefined
  const stage = sourceStage ? localizeJourneyStage(sourceStage, locale) : undefined
  const c = useLearningCopy()
  const { checkpoints, saveCheckpoint } = useProgress()
  usePageTitle(`${course?.title ?? ''} · Checkpoint`)
  if (!course || !stage) return <Navigate to="/learn" replace/>
  const passed = checkpoints[course.id]?.passed
  return <div className="page-width journey-page checkpoint-page">
    <Link className="text-link" to={`/learn/${course.id}`}><ArrowLeft size={14}/>{course.title}</Link>
    <header className="journey-heading"><p className="eyebrow">{course.title} / {c('Readiness checkpoint', 'Checkpoint kesiapan')}</p><h1>{c('Connect what you learned.', 'Hubungkan yang sudah kamu pelajari.')}</h1><p className="page-lead">{stage.outcome}</p></header>
    {passed && <div className="checkpoint-passed"><p>{c('Checkpoint passed. You can review it again or apply the ideas in your project.', 'Checkpoint sudah lulus. Kamu bisa mengulang atau menerapkannya pada proyek.')}</p><Link className="button primary" to={`/projects/${course.id}`}>{c('Open stage project', 'Buka proyek tahap ini')}<ArrowRight size={16}/></Link></div>}
    <CheckpointQuiz key={course.id} questions={stage.checkpoint} onComplete={(score, total) => saveCheckpoint(course.id, score, total)}/>
    <div className="stage-bridge"><p>{stage.bridge}</p><Link className="text-link" to={`/projects/${course.id}`}>{c('Explore the project brief', 'Lihat brief proyek')}<ArrowRight size={14}/></Link></div>
  </div>
}
