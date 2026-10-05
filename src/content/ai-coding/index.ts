import type { Challenge, Concept, Course, CourseModule, Lesson } from '../types'
import data from './data.json'

export const aiCodingCourse: Course = {
  id: 'ai-coding', title: 'Vibe Coding', path: 'companion',
  eyebrow: 'Build thoughtfully with an AI coding agent',
  description: 'Turn an idea into a small app with clear prompts, deliberate design, and a review you can explain.',
  prerequisite: 'HTML, CSS, JavaScript, and browser basics for the build exercises',
}
export const aiCodingModules: CourseModule[] = data.modules
export const aiCodingLessons: Lesson[] = data.lessons.map((seed, index) => {
  const options = [...seed.options.slice(index % 3), ...seed.options.slice(0, index % 3)]
  return {
    id: seed.id, courseId: aiCodingCourse.id, moduleId: seed.moduleId, title: seed.title,
    minutes: seed.minutes, description: seed.summary, explanation: seed.explanation,
    practice: seed.practice, promptExample: seed.example,
    code: '', inspectSymbols: [], language: 'text', lab: 'read',
    visual: {
      title: seed.title, description: seed.summary,
      nodes: seed.flow.map((label, i) => ({ id: 'step-' + i, label, detail: [seed.summary, seed.explanation[0], seed.reason][i] })),
      edges: [{ from: 'step-0', to: 'step-1' }, { from: 'step-1', to: 'step-2' }],
    },
    challenge: {
      id: seed.id + '-check', title: 'Check: ' + seed.title,
      topic: data.modules.find(module => module.id === seed.moduleId)!.title,
      kind: 'choice', language: 'text', code: '', difficulty: seed.difficulty as Challenge['difficulty'],
      prompt: seed.question, options, answer: seed.answer, hint: seed.hint, explanation: seed.reason,
    },
    recap: [seed.summary, seed.reason], relatedConcepts: ['concept-' + seed.id],
  }
})
export const aiCodingConcepts: Concept[] = aiCodingLessons.map(lesson => ({
  id: 'concept-' + lesson.id, courseId: aiCodingCourse.id,
  title: lesson.title, description: lesson.description, category: aiCodingModules.find(module => module.id === lesson.moduleId)!.title,
  code: '', promptExample: lesson.promptExample, language: 'text', lessonId: lesson.id, visual: lesson.visual,
}))

