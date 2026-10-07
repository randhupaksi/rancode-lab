import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import CodeEditor from '../../features/editor/CodeEditor'
import { runCode } from '../../features/runtime/runner'
import { useLearningCopy } from '../../features/journey/useLearningCopy'

export default function ConsoleLab({ initialCode, value, onChange, title = 'experiment.js' }: { initialCode: string; value?: string; onChange?: (code: string) => void; title?: string }) {
  const c = useLearningCopy()
  const [localCode, setLocalCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [error, setError] = useState<{ kind: 'runtime'; message: string } | { kind: 'unavailable' } | null>(null)
  const [running, setRunning] = useState(false)
  const [ran, setRan] = useState(false)
  const [autoRun, setAutoRun] = useState(false)
  const active = useRef<AbortController | null>(null)
  const code = value ?? localCode
  useEffect(() => () => active.current?.abort(), [])
  function edit(next: string) { active.current?.abort(); active.current = null; setRunning(false); setRan(false); setLocalCode(next); onChange?.(next); setError(null); setOutput([]) }
  async function run() {
    active.current?.abort()
    const controller = new AbortController()
    active.current = controller
    setRunning(true); setError(null); setOutput([])
    try {
      const result = await runCode(code, { signal: controller.signal })
      if (active.current !== controller || controller.signal.aborted) return
      setOutput(result.output); setError(result.error ? { kind: 'runtime', message: result.error } : null); setRan(true)
    } catch { if (active.current === controller) setError({ kind: 'unavailable' }) }
    finally { if (active.current === controller) { setRunning(false); active.current = null } }
  }
  useEffect(() => {
    if (!autoRun) return
    const timer = window.setTimeout(() => { void run() }, 500)
    return () => window.clearTimeout(timer)
  }, [autoRun, code])
  function resetCode() {
    active.current?.abort()
    active.current = null
    setRunning(false)
    setLocalCode(initialCode)
    onChange?.(initialCode)
    setOutput([])
    setError(null)
    setRan(false)
  }
  return <div className="live-lab">
    <div className="lab-toolbar"><span>{title}</span><div className="toolbar-actions"><button className="button ghost small" onClick={resetCode}><RotateCcw size={14}/>{c('Reset code', 'Reset kode')}</button><button className="button ghost small lab-auto-run" aria-pressed={autoRun} aria-label={c('Toggle automatic code execution', 'Aktifkan atau matikan jalankan kode otomatis')} title={c('Toggle automatic code execution', 'Aktifkan atau matikan jalankan kode otomatis')} onClick={() => setAutoRun(value => !value)}>{c('Auto-run', 'Otomatis')}</button><button className="button secondary small" onClick={() => void run()} disabled={running}><Play size={14}/>{running ? c('Running…', 'Menjalankan…') : c('Run code', 'Jalankan kode')}</button></div></div>
    <CodeEditor value={code} onChange={edit} label={c('Code editor', 'Editor kode')}/>
    <div className="lab-output" role="status">
      <span className="eyebrow">{c('Console output', 'Hasil console')}</span>
      <p className="quiet-note">{c('Logs from this isolated runner appear here, not in browser DevTools.', 'Log dari runner terisolasi ini tampil di sini, bukan di DevTools browser.')}</p>
      {output.length > 0 && <pre>{output.join('\n')}</pre>}
      {error && <p className="feedback error">{error.kind === 'unavailable' ? c('The runner is unavailable. Your code is still here.', 'Runner belum tersedia. Kodemu tetap tersimpan.') : error.message}</p>}
      {!output.length && !error && <p className="quiet-note">{ran ? c('Finished. Use console.log to show a value.', 'Selesai. Gunakan console.log untuk menampilkan nilai.') : autoRun ? c('Auto-run is ready. Pause after editing to run your code.', 'Jalankan otomatis siap. Berhenti sejenak setelah mengedit untuk menjalankan kode.') : c('Predict the result, then run your code.', 'Prediksi hasilnya, lalu jalankan kodemu.')}</p>}
    </div>
  </div>
}
