import { useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import type { Lesson } from '../../content/types'
import { HighlightedCode } from '../ui/CodeBlock'
import { useLocale } from '../../features/locale/LocaleProvider'

interface Props {
  code: string
  steps: NonNullable<Lesson['steps']>
}

export default function ExecutionStepper({ code, steps }: Props) {
  const { t } = useLocale()
  const [index, setIndex] = useState(0)
  const step = steps[index]
  if (!step) return null

  return <section className="execution-stepper" aria-label={t('stepper.title')}>
    <div className="stepper-header"><div><span className="eyebrow">{t('stepper.follow')}</span><p>{t('stepper.lead')}</p></div><span className="number-label">{index + 1} / {steps.length}</span></div>
    <div className="stepper-body">
      <pre className="stepper-code" tabIndex={0} aria-label={`${t('stepper.title')}. ${t('stepper.line', { line: step.line })}`}><code>{code.split('\n').map((line, lineIndex) => <span className={`stepper-code-line ${lineIndex + 1 === step.line ? 'active' : ''}`} key={lineIndex}><span className="stepper-line-number" aria-hidden="true">{lineIndex + 1}</span><span><HighlightedCode code={line || ' '}/></span>{'\n'}</span>)}</code></pre>
      <div className="stepper-detail" aria-live="polite" aria-atomic="true"><span className="eyebrow">{t('stepper.line', { line: step.line })}</span><h3>{step.label}</h3><code className="stepper-value">{step.value}</code><p>{step.explanation}</p></div>
    </div>
    <div className="stepper-controls"><button className="button ghost" onClick={() => setIndex(0)} disabled={index === 0}><RotateCcw size={14} aria-hidden="true"/>{t('stepper.reset')}</button><div><button className="button secondary" onClick={() => setIndex(value => Math.max(0, value - 1))} disabled={index === 0}><ArrowLeft size={14} aria-hidden="true"/>{t('stepper.previous')}</button><button className="button primary" onClick={() => setIndex(value => Math.min(steps.length - 1, value + 1))} disabled={index === steps.length - 1}>{t('stepper.next')}<ArrowRight size={14} aria-hidden="true"/></button></div></div>
  </section>
}
