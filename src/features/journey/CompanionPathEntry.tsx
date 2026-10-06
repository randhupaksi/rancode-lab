import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProgress } from '../progress/ProgressProvider'
import { useLearningCopy } from './useLearningCopy'
import { getCompanionPathProgress } from './companion-path-progress'
import './companion-path.css'

interface Props { courseId: string; courseName: string; title: string; description: string; prerequisite: string }
export default function CompanionPathEntry({ courseId, courseName, title, description, prerequisite }: Props) {
  const c = useLearningCopy()
  const id = useId()
  const progressContext = useProgress()
  const progress = getCompanionPathProgress(courseId, progressContext)
  const { completed, total, reviewed, started, destination } = progress
  return <section className="companion-entry" aria-labelledby={id}>
    <div><p className="eyebrow">{c('A companion learning path', 'Jalur belajar pendamping')}</p><h2 id={id}>{title}</h2><p>{description}</p><p className="quiet-note">{prerequisite}</p></div>
    <div className="companion-entry-actions"><span className="quiet-note">{completed ? completed + '/' + total + ' ' + c('lessons completed', 'pelajaran selesai') : total + ' ' + c('lessons · 1 practice project', 'pelajaran · 1 proyek praktik')}</span><Link className="button secondary" to={destination}>{reviewed ? c('Review your project', 'Tinjau proyekmu') : (started ? c('Continue ', 'Lanjut ') : c('Explore ', 'Lihat ')) + courseName}<ArrowRight size={15} aria-hidden="true"/></Link></div>
  </section>
}
