import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import { getCourse } from '../content/runtime/catalog'
import { getStage } from '../content/runtime/catalog'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/runtime/localize'
import { localizeJourneyStage } from '../content/runtime/localize'
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
  usePageTitle(`${course?.title ?? ''} · ${c('Readiness check', 'Cek pemahaman')}`)
  if (!course || !stage) return <Navigate to="/learn" replace/>
  const passed = checkpoints[course.id]?.passed
  return <div className="page-width journey-page checkpoint-page">
    <TextLink to={`/learn/${course.id}`}><ArrowLeft size={14}/>{course.title}</TextLink>
    <header className="journey-heading"><p className="eyebrow">{course.title} / {c('Knowledge check', 'Cek pemahaman')}</p><h1>{c('Connect what you learned', 'Gunakan yang sudah kamu pelajari')}</h1><p className="page-lead">{stage.outcome}</p></header>
    {passed && <div className="checkpoint-passed"><p>{c('You passed this check. Review it again any time, or put the ideas to work in your project.', 'Kamu sudah lolos cek ini. Kamu bisa mengulangnya kapan saja atau langsung memakai idenya di proyek.')}</p><Link className="button primary" to={`/projects/${course.id}`}>{c('Open stage project', 'Buka proyek tahap ini')}<ArrowRight size={16}/></Link></div>}
    <CheckpointQuiz key={course.id} questions={stage.checkpoint} onComplete={(score, total) => saveCheckpoint(course.id, score, total)}/>
    <div className="stage-bridge"><p>{stage.bridge}</p><TextLink to={`/projects/${course.id}`}>{c('See the project brief', 'Lihat panduan proyek')}<ArrowRight size={14}/></TextLink></div>
  </div>
}
