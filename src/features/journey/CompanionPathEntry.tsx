import { useId } from 'react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getCourseLessons, lessonPath } from '../../content/navigation'
import { useProgress } from '../progress/ProgressProvider'
import { useLearningCopy } from './useLearningCopy'
import './companion-path.css'

interface Props { courseId: string; courseName: string; title: string; description: string; prerequisite: string }
export default function CompanionPathEntry({ courseId, courseName, title, description, prerequisite }: Props) {
  const c = useLearningCopy()
  const id = useId()
  const { completedLessons, lastLesson, checkpoints, projects } = useProgress()
  const lessons = getCourseLessons(courseId)
  const completed = lessons.filter(lesson => completedLessons.includes(lesson.id)).length
  const last = lessons.find(lesson => lesson.id === lastLesson && !completedLessons.includes(lesson.id))
  const next = last ?? lessons.find(lesson => !completedLessons.includes(lesson.id))
  const reviewed = checkpoints[courseId]?.passed && projects[courseId]?.completed
  const destination = reviewed ? '/projects/' + courseId
    : completed === lessons.length ? checkpoints[courseId]?.passed ? '/projects/' + courseId : '/learn/' + courseId + '/checkpoint'
      : completed || last ? next ? lessonPath(next) : '/learn/' + courseId : '/learn/' + courseId
  return <section className="companion-entry" aria-labelledby={id}>
    <div><p className="eyebrow">{c('A companion learning path', 'Jalur belajar pendamping')}</p><h2 id={id}>{title}</h2><p>{description}</p><p className="quiet-note">{prerequisite}</p></div>
    <div className="companion-entry-actions"><span className="quiet-note">{completed ? completed + '/' + lessons.length + ' ' + c('lessons completed', 'pelajaran selesai') : lessons.length + ' ' + c('lessons · 1 practice project', 'pelajaran · 1 proyek praktik')}</span><Link className="button secondary" to={destination}>{reviewed ? c('Review your project', 'Tinjau proyekmu') : (completed || last ? c('Continue ', 'Lanjut ') : c('Explore ', 'Lihat ')) + courseName}<ArrowRight size={15} aria-hidden="true"/></Link></div>
  </section>
}
