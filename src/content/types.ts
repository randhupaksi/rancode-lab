export interface CanvasNode {
  id: string
  label: string
  detail: string
  tone?: 'type' | 'value' | 'neutral' | 'error'
}

export interface ConceptVisual {
  title: string
  description: string
  nodes: CanvasNode[]
  edges: { from: string; to: string; label?: string }[]
}

export interface Challenge {
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'text'
  id: string
  title: string
  topic: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  kind: 'choice' | 'fill' | 'fix'
  prompt: string
  code: string
  options?: string[]
  answer: string
  acceptedAnswers?: string[]
  explanation: string
  hint: string
  solution?: string
  expectedTypes?: Record<string, string>
  /** Type-only assertions appended during grading; never executed or displayed as learner code. */
  validationCode?: string
}

export interface Lesson {
  lab?: 'console' | 'web' | 'read'
  language?: 'javascript' | 'typescript' | 'html' | 'css' | 'text'
  practice?: string
  id: string
  title: string
  moduleId: string
  courseId?: string
  description: string
  minutes: number
  explanation: string[]
  code: string
  inspectSymbols: string[]
  visual: ConceptVisual
  challenge: Challenge
  recap: string[]
  relatedConcepts: string[]
  comparison?: { before: string; after: string; beforeLabel: string; afterLabel: string }
  steps?: { line: number; label: string; value: string; explanation: string }[]
}

export interface CourseModule {
  id: string
  courseId?: string
  title: string
  description: string
  number: string
}

export interface Concept {
  language?: Lesson['language']
  id: string
  title: string
  category: string
  description: string
  code: string
  lessonId: string
  courseId?: string
  visual?: ConceptVisual
}

export interface Course {
  id: string
  title: string
  eyebrow: string
  description: string
  prerequisite: string
}
