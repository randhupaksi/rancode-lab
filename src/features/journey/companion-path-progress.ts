import { getCourseLessons, lessonPath } from '../../content/navigation'
import type { Progress } from '../progress/model'

type PathProgress = Pick<Progress, 'completedLessons' | 'lastLesson' | 'checkpoints' | 'projects'>

export function getCompanionPathProgress(courseId: string, progress: PathProgress) {
  const lessons = getCourseLessons(courseId)
  const completed = lessons.filter(lesson => progress.completedLessons.includes(lesson.id)).length
  const last = lessons.find(lesson => lesson.id === progress.lastLesson && !progress.completedLessons.includes(lesson.id))
  const next = last ?? lessons.find(lesson => !progress.completedLessons.includes(lesson.id))
  const checkpointPassed = Boolean(progress.checkpoints[courseId]?.passed)
  const projectCompleted = Boolean(progress.projects[courseId]?.completed)
  const reviewed = checkpointPassed && projectCompleted
  const destination = reviewed ? `/projects/${courseId}`
    : completed === lessons.length ? progress.checkpoints[courseId]?.passed ? `/projects/${courseId}` : `/learn/${courseId}/checkpoint`
      : completed || last ? next ? lessonPath(next) : `/learn/${courseId}` : `/learn/${courseId}`

  return { completed, total: lessons.length, checkpointPassed, projectCompleted, reviewed, started: Boolean(completed || last), destination }
}
