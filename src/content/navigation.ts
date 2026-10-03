import data from '../generated/navigation.json'

// Navigation consumers must not import the full curriculum through this boundary.
export const { lessons, journey, courseCount } = data
export type LessonSummary = (typeof lessons)[number]
const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]))
const lessonsByCourse = new Map<string, LessonSummary[]>()
for (const lesson of lessons) {
  const group = lessonsByCourse.get(lesson.courseId) ?? []
  group.push(lesson)
  lessonsByCourse.set(lesson.courseId, group)
}
export function getLesson(id: string | undefined) { return id ? lessonById.get(id) : undefined }
export function getCourseLessons(id: string) { return lessonsByCourse.get(id) ?? [] }
export function lessonPath(lesson: LessonSummary) { return `/learn/${lesson.courseId}/${lesson.id}` }
