import type { Challenge, Concept, CourseModule, Lesson } from './types'
import { flow, node } from './visuals'
import { reactExamples } from './react-examples'
import { nextExamples } from './next-examples'

import type { Seed } from './framework/seed'
import { frameworkPractice } from './framework/practice'
import { frameworkDistractors } from './framework/distractors'
import { reactSeeds } from './framework/react-seeds'
import { nextSeeds } from './framework/next-seeds'
import { reactExpansionSeeds } from './framework/react-expansion'
import { nextExpansionSeeds } from './framework/next-expansion'

function graph(title: string, input: string, output: string) {
  return flow(
    title,
    'Follow the information through the pattern. Select a node to read its role.',
    [
      node('input', input, 'A value enters this part of the pattern.', 'value'),
      node('logic', title, 'This focused piece decides how to use that value.'),
      node('output', output, 'A new value or view is ready for the next step.', 'type'),
    ],
    [
      { from: 'input', to: 'logic', label: 'passes data' },
      { from: 'logic', to: 'output', label: 'returns' },
    ],
  )
}

function makeLessons(courseId: string, seeds: Seed[]): Lesson[] {
  return seeds.map((seed, index) => {
    const symbols =
      courseId === 'react'
        ? seed.symbols.filter(symbol =>
            ['const', 'let', 'function'].some(keyword =>
              seed.code.includes(`${keyword} ${symbol}`),
            ),
          )
        : seed.symbols
    const code =
      courseId === 'react' && !seed.code.includes('console.log')
        ? seed.code + '\nconsole.log(' + symbols.at(-1) + ');'
        : seed.code
    const authoredOptions = [seed.answer, ...frameworkDistractors[seed.id]]
    const options = [...authoredOptions.slice(index % 3), ...authoredOptions.slice(0, index % 3)]
    const challenge: Challenge = {
      language: courseId === 'react' ? 'javascript' : 'typescript',
      id: `${seed.id}-check`,
      title: `Check: ${seed.title}`,
      topic: seed.topic,
      difficulty: 'Beginner',
      kind: 'choice',
      prompt: seed.question,
      code,
      options,
      answer: seed.answer,
      hint: seed.recap[0],
      explanation: seed.description,
    }
    const comparison =
      courseId === 'react'
        ? {
            beforeLabel: 'The model',
            before: code,
            afterLabel: 'In a React component',
            after: reactExamples[seed.id] ?? seed.code,
          }
        : {
            beforeLabel: 'The model',
            before: code,
            afterLabel: 'In a local Next.js project',
            after: nextExamples[seed.id],
          }
    return {
      id: seed.id,
      courseId,
      title: seed.title,
      moduleId: seed.moduleId,
      minutes: seed.minutes,
      description: seed.description,
      language: courseId === 'react' ? 'javascript' : 'typescript',
      practice: frameworkPractice[seed.id],
      explanation: [
        seed.description,
        courseId === 'react'
          ? 'The editable example uses plain JavaScript to focus on the data and behavior. Read the component comparison to connect that model to React. TypeScript is introduced in the next stage.'
          : 'The editable example focuses on the underlying JavaScript and TypeScript model. The comparison connects it to a Next.js route.',
      ],
      code,
      inspectSymbols: symbols,
      visual: graph(seed.title, symbols[0] ?? 'input', symbols.at(-1) ?? 'result'),
      challenge,
      recap: seed.recap,
      relatedConcepts: [`${courseId}-${seed.id}`],
      comparison,
    }
  })
}

export const frameworkModules: CourseModule[] = [
  {
    id: 'react-foundations',
    courseId: 'react',
    number: '01',
    title: 'React Foundations',
    description: 'Build a clear model of components, JSX, and props.',
  },
  {
    id: 'react-state',
    courseId: 'react',
    number: '02',
    title: 'State & Interaction',
    description: 'Model changing UI, events, and lists.',
  },
  {
    id: 'react-effects',
    courseId: 'react',
    number: '03',
    title: 'Thinking Beyond Render',
    description: 'Connect external systems, reusable logic, and composition.',
  },
  {
    id: 'react-composition',
    courseId: 'react',
    number: '04',
    title: 'Sharing & Structuring State',
    description: 'Coordinate related components, shared values, and complex transitions.',
  },
  {
    id: 'react-performance',
    courseId: 'react',
    number: '05',
    title: 'Responsive, Accessible UI',
    description: 'Keep interactions fast, focused, and usable for everyone.',
  },
  {
    id: 'react-practice',
    courseId: 'react',
    number: '06',
    title: 'Reliable React Features',
    description: 'Handle forms, requests, recovery, testing, and feature boundaries.',
  },
  {
    id: 'next-routing',
    courseId: 'nextjs',
    number: '01',
    title: 'Routes & Layouts',
    description: 'Use the App Router to shape navigation and nested UI.',
  },
  {
    id: 'next-rendering',
    courseId: 'nextjs',
    number: '02',
    title: 'Rendering & Data',
    description: 'Choose server and client boundaries, then fetch data deliberately.',
  },
  {
    id: 'next-experience',
    courseId: 'nextjs',
    number: '03',
    title: 'Reliable Route Experiences',
    description: 'Design loading, error, metadata, and HTTP route behavior.',
  },
  {
    id: 'next-mutations',
    courseId: 'nextjs',
    number: '04',
    title: 'Forms & Server Mutations',
    description: 'Validate writes, refresh changed data, and enforce server boundaries.',
  },
  {
    id: 'next-optimization',
    courseId: 'nextjs',
    number: '05',
    title: 'Fast, Discoverable Routes',
    description: 'Shape bundle size, client boundaries, metadata, and user-facing performance.',
  },
  {
    id: 'next-production',
    courseId: 'nextjs',
    number: '06',
    title: 'Production-Ready Applications',
    description: 'Configure, observe, protect, and review complete route experiences.',
  },
]
export const frameworkLessons = [
  ...makeLessons('react', [...reactSeeds, ...reactExpansionSeeds]),
  ...makeLessons('nextjs', [...nextSeeds, ...nextExpansionSeeds]),
]
export const frameworkConcepts: Concept[] = frameworkLessons.map(lesson => ({
  id: `${lesson.courseId}-${lesson.id}`,
  courseId: lesson.courseId,
  title: lesson.title,
  category: lesson.challenge.topic,
  description: lesson.description,
  code: lesson.code,
  lessonId: lesson.id,
  visual: lesson.visual,
  language: lesson.language,
}))
