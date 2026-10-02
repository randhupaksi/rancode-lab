import { useState } from 'react'
import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCourse, getLesson } from '../content'
import LazyLab from '../components/learning/LazyLab'
import { usePageTitle } from '../hooks/usePageTitle'
import SelectField from '../components/ui/SelectField'
import { useLocale } from '../features/locale/LocaleProvider'
const examples = [
  { id: 'inference', label: 'Type inference', symbols: ['message', 'count'], code: '// Change a value and inspect its type.\nlet message = "Hello, UnderCode!";\nlet count = 3;\n\nconsole.log(message);\nconsole.log(count * 2);' },
  { id: 'unions', label: 'Unions & narrowing', symbols: ['format'], code: 'function format(value: string | number): string {\n  if (typeof value === "number") {\n    return value.toFixed(2);\n  }\n  return value.toUpperCase();\n}\n\nconsole.log(format(42));\nconsole.log(format("hello"));' },
  { id: 'generics', label: 'Generics', symbols: ['first', 'name', 'score'], code: 'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}\n\nconst name = first(["Ada", "Linus"]);\nconst score = first([98, 87, 92]);\nconsole.log(name, score);' },
  { id: 'async', label: 'Async functions', symbols: ['greet'], code: 'async function greet(name: string): Promise<string> {\n  return `Hello, ${name}!`;\n}\n\nconst message = await greet("Ada");\nconsole.log(message);' },
]
function PlaygroundWorkspace({ lessonId }: { lessonId?: string }) {
  const { t } = useLocale()
  const lesson = getLesson(lessonId)
  const starters = lesson ? [{ id: lesson.id, label: lesson.title, symbols: lesson.inspectSymbols, code: lesson.code }, ...examples] : examples
  const [selected, setSelected] = useState(0)
  const [pending, setPending] = useState<number | null>(null)
  const example = starters[selected]
  const course = lesson ? getCourse(lesson.courseId) : undefined
  return <div className="page-width playground-page"><header className="playground-header"><div><p className="eyebrow"><FlaskConical size={14}/> {t('play.eyebrow')}</p><h1 className="page-heading">{t('play.heading')}</h1><p className="page-lead">{t('play.lead')}</p></div><Link className="text-link" to="/cheat-sheet">{t('play.cheat')}<ArrowUpRight size={15}/></Link></header><div className="playground-toolbar"><SelectField id="playground-example" label={t('play.start')} value={String(pending ?? selected)} onValueChange={value => setPending(Number(value))} options={starters.map((item, i) => ({ value: String(i), label: item.label }))}/><span>{course?.title ?? 'TypeScript'} · {t('play.workspace')}</span></div>{pending !== null && <div className="example-confirm" role="status"><p>{t('play.load', { title: starters[pending].label })}</p><button className="button secondary small" onClick={() => { setSelected(pending); setPending(null) }}>{t('play.loadButton')}</button><button className="button ghost small" onClick={() => setPending(null)}>{t('play.keep')}</button></div>}<LazyLab key={example.id} initialCode={example.code} symbols={example.symbols} title="experiment.ts"/><div className="playground-notes"><p><strong>A real type checker.</strong> Inferred types and diagnostics update as you edit. Use <code>console.log()</code> to see runtime values.</p><p><strong>A small, isolated workspace.</strong> Code runs without network or page access. Package imports are unavailable, and edits reset when you leave this page.</p></div></div>
}

export default function PlaygroundPage() {
  usePageTitle('TypeScript playground')
  const [params] = useSearchParams()
  const lessonId = params.get('example') ?? undefined
  return <PlaygroundWorkspace key={lessonId ?? 'default'} lessonId={lessonId}/>
}
