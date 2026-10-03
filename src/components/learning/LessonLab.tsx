import { lazy, Suspense } from 'react'
import type { Lesson } from '../../content'
import CodeBlock from '../ui/CodeBlock'
import LazyLab from './LazyLab'
import { useLearningCopy } from '../../features/journey/useLearningCopy'
const WebLab = lazy(() => import('./WebLab'))
const ConsoleLab = lazy(() => import('./ConsoleLab'))

export default function LessonLab({ lesson }: { lesson: Lesson }) {
  const c = useLearningCopy()
  if (lesson.lab === 'read') return <CodeBlock code={lesson.code} language={lesson.language ?? 'text'}/>
  return <Suspense fallback={<p role="status">{c('Loading the editor…', 'Menyiapkan editor…')}</p>}>
    {lesson.lab === 'web' ? <WebLab initialCode={lesson.code}/> : lesson.language === 'javascript' ? <ConsoleLab initialCode={lesson.code}/> : <LazyLab initialCode={lesson.code} symbols={lesson.inspectSymbols} title={`${lesson.title} · ${c('experiment', 'latihan')}`}/>}
  </Suspense>
}
