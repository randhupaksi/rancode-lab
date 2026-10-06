import { lazy, Suspense } from 'react'
import type { Lesson } from '../../content/runtime/catalog'
import CodeBlock from '../ui/CodeBlock'
import { SectionLoadingSkeleton } from '../ui/LoadingSkeleton'
import LazyLab from './LazyLab'
import { useLearningCopy } from '../../features/journey/useLearningCopy'
const WebLab = lazy(() => import('./WebLab'))
const TailwindLab = lazy(() => import('./TailwindLab'))
const ConsoleLab = lazy(() => import('./ConsoleLab'))
const PromptWorkshop = lazy(() => import('../../features/ai-coding/PromptWorkshop'))

export default function LessonLab({ lesson }: { lesson: Lesson }) {
  const c = useLearningCopy()
  if (lesson.promptExample) return <Suspense fallback={<SectionLoadingSkeleton variant="prompt" label={c('Opening the prompt workspace…', 'Menyiapkan ruang prompt…')}/>}><PromptWorkshop key={lesson.promptExample} lessonId={lesson.id} example={lesson.promptExample}/></Suspense>
  if (lesson.lab === 'read') return <CodeBlock code={lesson.code} language={lesson.language ?? 'text'}/>
  const variant = lesson.lab === 'web' || lesson.lab === 'tailwind' ? 'preview' : 'code'
  return <Suspense fallback={<SectionLoadingSkeleton variant={variant} label={c('Loading the editor…', 'Menyiapkan editor…')}/>}>
    {lesson.lab === 'tailwind' ? <TailwindLab key={lesson.id} initialCode={lesson.code}/> : lesson.lab === 'web' ? <WebLab initialCode={lesson.code}/> : lesson.language === 'javascript' ? <ConsoleLab initialCode={lesson.code}/> : <LazyLab initialCode={lesson.code} symbols={lesson.inspectSymbols} title={`${lesson.title} · ${c('experiment', 'latihan')}`}/>}
  </Suspense>
}
