import { lazy, Suspense } from 'react'
import type { Lesson } from '../../content'
import CodeBlock from '../ui/CodeBlock'
import LazyLab from './LazyLab'
const WebLab = lazy(() => import('./WebLab'))
const ConsoleLab = lazy(() => import('./ConsoleLab'))

export default function LessonLab({ lesson }: { lesson: Lesson }) {
  if (lesson.lab === 'read') return <CodeBlock code={lesson.code} language={lesson.language ?? 'text'}/>
  return <Suspense fallback={<p role="status">Loading editor…</p>}>
    {lesson.lab === 'web' ? <WebLab initialCode={lesson.code}/> : lesson.language === 'javascript' ? <ConsoleLab initialCode={lesson.code}/> : <LazyLab initialCode={lesson.code} symbols={lesson.inspectSymbols} title={`${lesson.title} · experiment`}/>}
  </Suspense>
}
