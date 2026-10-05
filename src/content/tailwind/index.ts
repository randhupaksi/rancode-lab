import type { Challenge, Concept, Course, CourseModule, Lesson } from '../types'
import data from './data.json'

export const tailwindCourse: Course = {
  id: 'tailwind', title: 'Tailwind CSS', path: 'companion',
  eyebrow: 'Turn your CSS foundations into a clear interface',
  description: 'Install Tailwind, understand its utilities, and build responsive pages with a visual system you can explain.',
  prerequisite: 'HTML and CSS foundations; React and Next.js basics for the framework examples',
}
export const tailwindModules: CourseModule[] = data.modules
export const tailwindLessons: Lesson[] = data.lessons.map((seed, index) => {
  const options = [...seed.options.slice(index % 3), ...seed.options.slice(0, index % 3)]
  return {
    id: seed.id, courseId: tailwindCourse.id, moduleId: seed.moduleId, title: seed.title,
    minutes: seed.minutes, description: seed.summary, explanation: seed.explanation,
    practice: seed.practice, code: seed.code, inspectSymbols: [],
    language: seed.language as Lesson['language'], lab: seed.lab as Lesson['lab'],
    visual: {
      title: seed.title, description: seed.summary,
      nodes: seed.flow.map((label, i) => ({ id: 'step-' + i, label, detail: [seed.summary, seed.explanation[1], seed.reason][i] })),
      edges: [{ from: 'step-0', to: 'step-1' }, { from: 'step-1', to: 'step-2' }],
    },
    challenge: {
      id: seed.id + '-check', title: 'Check: ' + seed.title,
      topic: data.modules.find(module => module.id === seed.moduleId)!.title,
      kind: 'choice', language: seed.language as Challenge['language'], code: seed.code,
      difficulty: seed.difficulty as Challenge['difficulty'],
      prompt: seed.question, options, answer: seed.answer, hint: seed.hint, explanation: seed.reason,
    },
    recap: [seed.summary, seed.reason], relatedConcepts: ['concept-' + seed.id],
  }
})
export const tailwindConcepts: Concept[] = tailwindLessons.map(lesson => ({
  id: 'concept-' + lesson.id, courseId: tailwindCourse.id,
  title: lesson.title, description: lesson.description,
  category: tailwindModules.find(module => module.id === lesson.moduleId)!.title,
  code: lesson.code, language: lesson.language, lessonId: lesson.id, visual: lesson.visual,
}))
