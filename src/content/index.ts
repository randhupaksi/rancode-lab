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

export type { Challenge, Concept, Course, CourseModule, Lesson } from './types'

export const courses: Course[] = [
  { id: 'typescript', title: 'TypeScript', eyebrow: 'Make your JavaScript intentions clear', description: 'Build a reliable mental model for types, data, and real application code.', prerequisite: 'JavaScript basics' },
  { id: 'react', title: 'React', eyebrow: 'Build interfaces from clear parts', description: 'Understand components, state, effects, and the decisions behind a responsive UI.', prerequisite: 'JavaScript + TypeScript basics' },
  { id: 'nextjs', title: 'Next.js', eyebrow: 'Build complete web experiences', description: 'Learn routes, rendering boundaries, data flow, and dependable route experiences.', prerequisite: 'React foundations' },
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

export const modules: CourseModule[] = [...typeScriptModules.map(module => ({ ...module, courseId: 'typescript' })), ...frameworkModules]
export const lessons: Lesson[] = [...[...gettingStarted, ...typeSystem, ...functions, ...structures, ...advancedTypes, ...generics, ...realWorld].map(lesson => ({ ...lesson, courseId: 'typescript' })), ...frameworkLessons]
const lessonById = new Map(lessons.map(lesson => [lesson.id, lesson]))
export const concepts: Concept[] = [...conceptEntries.map(concept => ({ ...concept, courseId: 'typescript', visual: lessonById.get(concept.lessonId)?.visual })), ...frameworkConcepts]
export const challenges: Challenge[] = lessons.map(lesson => lesson.challenge)

export function getLesson(id: string | undefined): Lesson | undefined { return id ? lessonById.get(id) : undefined }
export function getCourse(id: string | undefined): Course | undefined { return courses.find(course => course.id === id) }
export function getModuleLessons(id: string): Lesson[] { return lessons.filter(lesson => lesson.moduleId === id) }
export function getCourseModules(id: string): CourseModule[] { return modules.filter(module => module.courseId === id) }
export function getCourseLessons(id: string): Lesson[] { return lessons.filter(lesson => lesson.courseId === id) }
export function lessonPath(lesson: Lesson): string { return `/learn/${lesson.courseId ?? 'typescript'}/${lesson.id}` }
export function getNextCourse(id: string | undefined): Course | undefined { const index = courses.findIndex(course => course.id === id); return index >= 0 ? courses[index + 1] : undefined }
export function getLessonForChallenge(id: string): Lesson | undefined { return lessons.find(lesson => lesson.challenge.id === id) }
