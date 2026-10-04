import type { Challenge, Concept, Course, CourseModule, Lesson } from './types'
import { gettingStarted } from './getting-started'
import { typeSystem } from './type-system'
import { functions } from './functions'
import { structures } from './structures'
import { advancedTypes } from './advanced-types'
import { generics } from './generics'
import { realWorld } from './real-world'
import { conceptEntries } from './concepts'
import { frameworkConcepts, frameworkLessons, frameworkModules } from './framework-courses'
import { foundationCourses, foundationModules, foundationLessons, foundationConcepts } from './foundations'
import { expansionModules, expansionLessons, expansionConcepts } from './expansion'
import { typeScriptPractice } from './typescript-practice'

export type { Challenge, Concept, Course, CourseModule, Lesson } from './types'

export const courses: Course[] = [
  ...foundationCourses,
  { id: 'react', title: 'React', eyebrow: 'Build interfaces from clear parts', description: 'Understand components, state, effects, and the decisions behind a responsive UI.', prerequisite: 'JavaScript and browser foundations' },
  { id: 'typescript', title: 'TypeScript', eyebrow: 'Make your JavaScript intentions clear', description: 'Build a reliable mental model for types, data, and real application code.', prerequisite: 'JavaScript basics' },
  { id: 'nextjs', title: 'Next.js', eyebrow: 'Build complete web experiences', description: 'Learn routes, rendering boundaries, data flow, and dependable route experiences.', prerequisite: 'React foundations and basic TypeScript' },
]

const typeScriptModules: CourseModule[] = [
  { id: 'getting-started', number: '01', title: 'Getting Started', description: 'Understand why types exist and write your first contract.' },
  { id: 'type-system', number: '02', title: 'The Type System', description: 'Explore values, inference, collections, and alternative types.' },
  { id: 'functions', number: '03', title: 'Functions', description: 'Connect inputs, behavior, and results with clear contracts.' },
  { id: 'structures', number: '04', title: 'Objects & Structures', description: 'Model reusable shapes and their relationships.' },
  { id: 'advanced-types', number: '05', title: 'Advanced Types', description: 'Narrow possibilities and derive types from existing models.' },
  { id: 'generics', number: '06', title: 'Generics', description: 'Preserve type relationships as your code becomes reusable.' },
  { id: 'real-world', number: '07', title: 'Real World TypeScript', description: 'Bring types to data boundaries, async code, and components.' },
]

const catalogModules: CourseModule[] = [...foundationModules, ...typeScriptModules.map(module => ({ ...module, courseId: 'typescript' })), ...frameworkModules]
const finalPracticeModule: Record<string, string> = { react: 'react-practice', typescript: 'real-world', nextjs: 'next-production' }
export const modules: CourseModule[] = courses.flatMap(course => {
  const ordered = catalogModules.filter(module => module.courseId === course.id)
  const additions = expansionModules.filter(module => module.courseId === course.id)
  const practiceIndex = ordered.findIndex(module => module.id === finalPracticeModule[course.id])
  ordered.splice(practiceIndex < 0 ? ordered.length : practiceIndex, 0, ...additions)
  return ordered.map((module, index) => ({ ...module, number: String(index + 1).padStart(2, '0') }))
})
const catalogLessons: Lesson[] = [...foundationLessons, ...[...gettingStarted, ...typeSystem, ...functions, ...structures, ...advancedTypes, ...generics, ...realWorld].map(lesson => ({ ...lesson, practice: typeScriptPractice[lesson.id], courseId: 'typescript' })), ...frameworkLessons, ...expansionLessons]
export const lessons: Lesson[] = courses.flatMap(course => modules.filter(module => module.courseId === course.id).flatMap(module => catalogLessons.filter(lesson => lesson.moduleId === module.id && lesson.courseId === course.id)))
const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]))
export const concepts: Concept[] = [...foundationConcepts, ...conceptEntries.map(concept => ({ ...concept, courseId: 'typescript', visual: lessonById.get(concept.lessonId)?.visual })), ...frameworkConcepts, ...expansionConcepts]
export const challenges: Challenge[] = lessons.map(lesson => lesson.challenge)

// Build indexes once for the immutable catalog instead of scanning it on every render.
function groupBy<T>(items: T[], key: (item: T) => string | undefined) {
  const groups = new Map<string, T[]>()
  for (const item of items) {
    const id = key(item)
    if (id === undefined) continue
    const group = groups.get(id) ?? []
    group.push(item)
    groups.set(id, group)
  }
  return groups
}
const courseById = new Map(courses.map(course => [course.id, course]))
const lessonsByModule = groupBy(lessons, lesson => lesson.moduleId)
const lessonsByCourse = groupBy(lessons, lesson => lesson.courseId)
const modulesByCourse = groupBy(modules, module => module.courseId)
const lessonByChallenge = new Map(lessons.map(lesson => [lesson.challenge.id, lesson]))

export function getLesson(id: string | undefined): Lesson | undefined { return id ? lessonById.get(id) : undefined }
export function getCourse(id: string | undefined): Course | undefined { return id ? courseById.get(id) : undefined }
export function getModuleLessons(id: string): readonly Lesson[] { return lessonsByModule.get(id) ?? [] }
export function getCourseModules(id: string): readonly CourseModule[] { return modulesByCourse.get(id) ?? [] }
export function getCourseLessons(id: string): readonly Lesson[] { return lessonsByCourse.get(id) ?? [] }
export function lessonPath(lesson: Lesson): string { return `/learn/${lesson.courseId ?? 'typescript'}/${lesson.id}` }
export function getNextCourse(id: string | undefined): Course | undefined { const index = courses.findIndex(course => course.id === id); return index >= 0 ? courses[index + 1] : undefined }
export function getLessonForChallenge(id: string): Lesson | undefined { return lessonByChallenge.get(id) }
