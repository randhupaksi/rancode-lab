import { getCourseLessons, getLesson, lessonPath } from '../../content'
import { journey } from '../../content/journey'

interface LearnerProgress {
  completedLessons: string[]
  lastLesson: string | null
  learningProfile: { startCourseId: string } | null
  checkpoints: Record<string, { passed: boolean }>
  projects: Record<string, { completed: boolean }>
}
export function recommendNext(progress: LearnerProgress) {
  const start = Math.max(0, journey.findIndex(stage => stage.courseId === progress.learningProfile?.startCourseId))
  const activeStages = journey.slice(start)
  const stage = activeStages.find(item => !progress.checkpoints[item.courseId]?.passed || !progress.projects[item.courseId]?.completed)
  if (!stage) return { kind: 'finished' as const, courseId: 'nextjs', title: 'Learning dashboard', url: '/projects/nextjs' }
  const courseLessons = getCourseLessons(stage.courseId)
  const last = getLesson(progress.lastLesson ?? undefined)
  const unfinished = last?.courseId === stage.courseId && !progress.completedLessons.includes(last.id) ? last : courseLessons.find(lesson => !progress.completedLessons.includes(lesson.id))
  // A passed checkpoint permits experienced learners to move directly to the project.
  if (unfinished && !progress.checkpoints[stage.courseId]?.passed) return { kind: 'lesson' as const, courseId: stage.courseId, title: unfinished.title, url: lessonPath(unfinished) }
  if (!progress.checkpoints[stage.courseId]?.passed) return { kind: 'checkpoint' as const, courseId: stage.courseId, title: 'Checkpoint', url: `/learn/${stage.courseId}/checkpoint` }
  return { kind: 'project' as const, courseId: stage.courseId, title: stage.project.title, url: `/projects/${stage.courseId}` }
}
