import type { Concept, CourseModule, Lesson } from '../types'

type Options = Pick<Lesson, 'lab' | 'language' | 'comparison'> & { minutes?: number }
export interface Topic {
  id: string
  title: string
  explanation: string
  code: string
  practice: string
  question: string
  answers: [string, string, string]
  reason: string
  flow: [string, string, string]
  options?: Options
}
export interface ModuleDraft { id: string; title: string; description: string; topics: Topic[] }

/** The first authored answer is correct; displayed positions rotate per lesson. */
export function topic(id: string, title: string, explanation: string, code: string, practice: string, question: string, answers: Topic['answers'], reason: string, flow: Topic['flow'], options?: Options): Topic {
  return { id, title, explanation, code, practice, question, answers, reason, flow, options }
}

export function expandCourse(courseId: string, drafts: ModuleDraft[], defaults: Options = {}) {
  const modules: CourseModule[] = drafts.map((draft, index) => ({ id: draft.id, courseId, title: draft.title, description: draft.description, number: String(index + 1).padStart(2, '0') }))
  const lessons: Lesson[] = drafts.flatMap(draft => draft.topics.map((item, index) => {
    const options = { ...defaults, ...item.options }
    const explanation = item.explanation.split('\n\n')
    const language = options.language ?? 'javascript'
    const lab = options.lab ?? 'console'
    return {
      id: item.id, title: item.title, courseId, moduleId: draft.id, minutes: options.minutes ?? 10,
      description: explanation[0], explanation, code: item.code, inspectSymbols: [], language, lab, practice: item.practice,
      ...(options.comparison ? { comparison: options.comparison } : {}),
      visual: { title: item.title, description: 'Trace the example through these three decisions.', nodes: item.flow.map((label, i) => ({ id: `node-${i}`, label, detail: [explanation[0], explanation.slice(1).join(' ') || item.practice, item.reason][i] })), edges: [{ from: 'node-0', to: 'node-1' }, { from: 'node-1', to: 'node-2' }] },
      challenge: { id: `${item.id}-check`, title: `Apply: ${item.title}`, topic: draft.title, difficulty: 'Intermediate' as const, kind: 'choice' as const, language, code: item.code, prompt: item.question, options: [...item.answers.slice(index % 3), ...item.answers.slice(0, index % 3)], answer: item.answers[0], explanation: item.reason, hint: `Follow the ${item.flow[1]} step and compare it with the result. ${item.practice}` },
      recap: [explanation[0], item.reason], relatedConcepts: [`concept-${item.id}`],
    }
  }))
  const concepts: Concept[] = lessons.map(lesson => ({ id: `concept-${lesson.id}`, title: lesson.title, courseId, category: lesson.challenge.topic, description: lesson.description, code: lesson.code, lessonId: lesson.id, visual: lesson.visual, language: lesson.language }))
  return { modules, lessons, concepts }
}
