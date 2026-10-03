import { useEffect, useRef, useState } from 'react'
import { AlertCircle, Check, Play, RotateCcw } from 'lucide-react'
import CodeEditor from '../../features/editor/CodeEditor'
import { useTypeScript } from '../../features/runtime/useTypeScript'
import { runCode } from '../../features/runtime/runner'
import { useLocale } from '../../features/locale/LocaleProvider'

export default function LiveLab({ initialCode, value, onChange, symbols = [], title = 'Try it yourself', runnable = true }: { initialCode: string; value?: string; onChange?: (code: string) => void; symbols?: string[]; title?: string; runnable?: boolean }) {
  const { locale, t } = useLocale()
  const [localCode, setCode] = useState(initialCode)
  const code = value ?? localCode
  const [selected, setSelected] = useState(0)
  const [running, setRunning] = useState(false)
  const [output, setOutput] = useState<string[] | null>(null)
  const [runtimeError, setRuntimeError] = useState('')
  const activeRun = useRef<AbortController | null>(null)
  const analysis = useTypeScript(code, symbols)
  const inspection = analysis.types[selected] ?? analysis.types[0]

  useEffect(() => {
    activeRun.current?.abort()
    activeRun.current = null
    setCode(initialCode)
    setSelected(0)
    setOutput(null)
    setRuntimeError('')
    setRunning(false)
    return () => { activeRun.current?.abort(); activeRun.current = null }
  }, [initialCode, value])

  const changeCode = (nextCode: string) => {
    activeRun.current?.abort()
    activeRun.current = null
    setRunning(false)
    setCode(nextCode)
    onChange?.(nextCode)
    setOutput(null)
    setRuntimeError('')
  }

  const run = async () => {
    activeRun.current?.abort()
    const controller = new AbortController()
    activeRun.current = controller
    setRunning(true); setOutput(null); setRuntimeError('')
    try {
      const result = await runCode(code, { signal: controller.signal })
      if (activeRun.current !== controller || controller.signal.aborted) return
      setOutput(result.output)
      setRuntimeError(result.error ?? '')
    } catch (error) {
      if (activeRun.current === controller && !controller.signal.aborted) setRuntimeError(error instanceof Error ? error.message : t('lab.unavailable'))
    } finally {
      if (activeRun.current === controller) { activeRun.current = null; setRunning(false) }
    }
  }
  return <div className="live-lab">
    <div className="lab-toolbar"><span><span className="file-dot" /> {title}</span><div className="toolbar-actions"><button className="button ghost small" onClick={() => { changeCode(initialCode); setSelected(0) }}><RotateCcw size={14}/> {t('lab.reset')}</button>{runnable && <button className="button secondary small" onClick={run} disabled={running || analysis.status !== 'ready' || analysis.diagnostics.some(d => d.category === 'error')}><Play size={13}/>{running ? t('lab.running') : t('lab.run')}</button>}</div></div>
    <CodeEditor value={code} onChange={changeCode} label={t('lab.editor')} minHeight={230} />
    <div className="lab-inspector">
      <div className="inspector-title"><span className="eyebrow">{t('lab.inspector')}</span><span className="analysis-status" role="status">{analysis.status === 'loading' ? t('lab.reading') : analysis.status === 'error' ? t('lab.unavailable') : analysis.diagnostics.length ? t('lab.diagnostics', { count: analysis.diagnostics.length, plural: locale === 'en' && analysis.diagnostics.length > 1 ? 's' : '' }) : <><Check size={12}/> {t('lab.valid')}</>}</span></div>
      {analysis.types.length > 0 && <div className="inspector-symbols" aria-label={t('lab.symbols')}>{analysis.types.map((type, index) => <button key={type.name} className={index === selected ? 'symbol selected' : 'symbol'} onClick={() => setSelected(index)} aria-pressed={index === selected}><code>{type.name}</code><span>→</span><code className="type-text">{type.type}</code></button>)}</div>}
      {inspection && <p className="inspector-explanation">{inspection.explanation}</p>}
      {analysis.status === 'ready' && !analysis.types.length && <p className="muted">{t('lab.empty')}</p>}
      {analysis.error && <p className="feedback error">{analysis.error} {t('lab.errorSuffix')}</p>}
      {analysis.diagnostics.length > 0 && <ul className="diagnostic-list">{analysis.diagnostics.slice(0, 6).map((diagnostic, index) => <li key={index}><AlertCircle size={15}/><span><strong>{t('lab.line', { line: diagnostic.line })}</strong> · {diagnostic.message}</span></li>)}</ul>}
    </div>
    {(output !== null || runtimeError) && <div className="lab-output" role="status"><span className="eyebrow">{t('lab.output')}</span>{output && output.length > 0 && <pre>{output.join('\n')}</pre>}{runtimeError && <p className="feedback error">{runtimeError}</p>}{output?.length === 0 && !runtimeError && <pre>{t('lab.finished')}</pre>}</div>}
  </div>
}
