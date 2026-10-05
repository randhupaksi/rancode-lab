import { ArrowRight, CheckCircle2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStage } from '../../content/runtime/catalog'
import { useProgress } from '../progress/ProgressProvider'
import { useLearningCopy } from './useLearningCopy'
import { useLocale } from '../locale/LocaleProvider'
import { localizeJourneyStage } from '../../content/runtime/localize'

export default function StageMilestone({ courseId }: { courseId: string }) {
  const stage = getStage(courseId)
  const { locale } = useLocale()
  const { checkpoints, projects } = useProgress()
  const c = useLearningCopy()
  if (!stage) return null
  const localizedStage = localizeJourneyStage(stage, locale)
  return <section className="stage-milestone"><div><span className="eyebrow">{c('Finish this stage', 'Selesaikan tahap ini')}</span><h2>{c('Use what you have learned', 'Gunakan yang sudah kamu pelajari')}</h2><p>{localizedStage.bridge}</p></div><div className="milestone-actions"><Link to={`/learn/${courseId}/checkpoint`}><span>{checkpoints[courseId]?.passed ? <CheckCircle2 size={17}/> : '01'}<strong>{c('Check your understanding', 'Cek pemahamanmu')}</strong></span><ArrowRight size={16}/></Link><Link to={`/projects/${courseId}`}><span>{projects[courseId]?.completed ? <CheckCircle2 size={17}/> : '02'}<strong>{localizedStage.project.title}</strong></span><ArrowRight size={16}/></Link></div></section>
}
