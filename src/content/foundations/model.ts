import type { Concept, Course, CourseModule, Lesson } from '../types'

export interface FoundationSeed {
  id: string
  title: string
  idea: string
  explain: string
  code: string
  practice: string
  question: string
  options: [string, string, string]
  answer: string
  reason: string
  hint: string
  flow: [string, string, string]
  recap: [string, string]
  lab?: Lesson['lab']
  language?: Lesson['language']
}

export function foundation(course: Course, seeds: FoundationSeed[]) {
  const module: CourseModule = { id: `${course.id}-essentials`, courseId: course.id, title: `${course.title} essentials`, description: course.description, number: '01' }
  const lessons: Lesson[] = seeds.map((seed, index) => ({
    id: seed.id, courseId: course.id, moduleId: module.id, title: seed.title,
    minutes: 8, description: seed.idea, explanation: [seed.idea, seed.explain],
    code: seed.code, inspectSymbols: [], language: seed.language ?? 'javascript', lab: seed.lab ?? 'console', practice: seed.practice,
    visual: { title: seed.title, description: 'Follow each step, then try changing the example.',
      nodes: seed.flow.map((label, i) => ({ id: `step-${i}`, label, detail: [seed.idea, seed.explain, seed.reason][i] })),
      edges: [{ from: 'step-0', to: 'step-1' }, { from: 'step-1', to: 'step-2' }] },
    challenge: { id: `${seed.id}-check`, title: `Check: ${seed.title}`, topic: course.title, kind: 'choice', difficulty: 'Beginner', language: seed.language ?? 'javascript', code: seed.code, prompt: seed.question, options: [...seed.options.slice(index % 3), ...seed.options.slice(0, index % 3)], answer: seed.answer, explanation: seed.reason, hint: seed.hint },
    recap: seed.recap, relatedConcepts: [`concept-${seed.id}`],
  }))
  const concepts: Concept[] = lessons.map(lesson => ({ id: `concept-${lesson.id}`, courseId: course.id, title: lesson.title, category: course.title, description: lesson.description, code: lesson.code, lessonId: lesson.id, visual: lesson.visual, language: lesson.language }))
  return { course, module, lessons, concepts }
}
