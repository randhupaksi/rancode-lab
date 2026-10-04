import { useEffect, useId, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import { useLearningCopy } from '../../features/journey/useLearningCopy'
import { useLocale } from '../../features/locale/LocaleProvider'
import { previewDocument, previewSandbox } from './previewDocument'

export function WebPreview({ code, title, narrow = false }: { code: string; title?: string; narrow?: boolean }) {
  const { locale, t } = useLocale()
  const frame = useRef<HTMLIFrameElement>(null)
  const channel = useId()
  const [error, setError] = useState('')
  useEffect(() => {
    setError('')
    const receive = (event: MessageEvent) => {
      if (event.source === frame.current?.contentWindow && event.data?.channel === channel && typeof event.data.error === 'string') setError(event.data.error.slice(0, 500))
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [code, channel])
  const document = previewDocument(code, locale, channel)
  return <><div className={`web-preview ${narrow ? 'is-narrow' : ''}`}><iframe ref={frame} title={title ?? t('lab.preview')} sandbox={previewSandbox} referrerPolicy="no-referrer" srcDoc={document}/></div>{error && <p className="feedback error" role="status">{error}</p>}</>
}

export default function WebLab({ initialCode, value, onChange, title = 'index.html' }: { initialCode: string; value?: string; onChange?: (code: string) => void; title?: string }) {
  const c = useLearningCopy()
  const id = useId()
  const [localCode, setLocalCode] = useState(initialCode)
  const [preview, setPreview] = useState(initialCode)
  const [narrow, setNarrow] = useState(false)
  const [revision, setRevision] = useState(0)
  const code = value ?? localCode
  useEffect(() => {
    if (code === preview) return
    const timer = window.setTimeout(() => {
      setPreview(code)
      setRevision(revision => revision + 1)
    }, 400)
    return () => window.clearTimeout(timer)
  }, [code, preview])
  function edit(next: string) { setLocalCode(next); onChange?.(next) }
  function resetCode() {
    setLocalCode(initialCode)
    onChange?.(initialCode)
    setPreview(initialCode)
    setRevision(revision => revision + 1)
  }
  return <div className="web-lab">
    <div className="lab-toolbar"><label htmlFor={id}>{title}</label><div className="toolbar-actions"><button type="button" className="button ghost small" onClick={resetCode}><RotateCcw size={14}/>{c('Reset code', 'Reset kode')}</button></div></div>
    <textarea id={id} className="web-code-editor" translate="no" value={code} onChange={event => edit(event.target.value)} spellCheck={false} autoCapitalize="off" maxLength={100000} aria-label={c('HTML, CSS, and JavaScript editor', 'Editor HTML, CSS, dan JavaScript')}/>
    <div className="preview-toolbar"><span role="status">{code !== preview ? c('Preview updates when you pause typing', 'Preview diperbarui saat kamu berhenti mengetik') : c('Preview updates automatically', 'Preview diperbarui otomatis')}</span><button type="button" className="button ghost small" aria-pressed={narrow} onClick={() => setNarrow(v => !v)}>{narrow ? c('Use wide preview', 'Gunakan preview lebar') : c('Use narrow preview', 'Gunakan preview sempit')}</button></div>
    <WebPreview key={revision} code={preview} narrow={narrow}/>
    <p className="lab-footnote">{c('HTML, inline CSS, and browser JavaScript run in an isolated preview. External resources, network requests, and form submissions are blocked.', 'HTML, CSS inline, dan JavaScript browser berjalan di preview terisolasi. Sumber eksternal, request jaringan, dan pengiriman form diblokir.')}</p>
  </div>
}
