import { useEffect, useId, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { useLearningCopy } from '../../features/journey/useLearningCopy'

export function WebPreview({ code, title = 'Web preview', narrow = false }: { code: string; title?: string; narrow?: boolean }) {
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
  const bootstrap = `addEventListener('error',e=>parent.postMessage({channel:${JSON.stringify(channel)},error:e.message},'*'));addEventListener('unhandledrejection',e=>parent.postMessage({channel:${JSON.stringify(channel)},error:String(e.reason)},'*'));addEventListener('submit',e=>e.preventDefault());`
  const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none'; form-action 'none'; base-uri 'none'"><style>body{font:16px/1.6 system-ui,sans-serif;color:#183022;background:#fff;margin:0;padding:24px;overflow-wrap:anywhere}*{box-sizing:border-box}button,input{font:inherit}button,input,a{margin:4px}button{cursor:pointer}img{max-width:100%}:focus-visible{outline:3px solid #245536;outline-offset:3px}</style><script>${bootstrap}</script></head><body>${code}</body></html>`
  return <><div className={`web-preview ${narrow ? 'is-narrow' : ''}`}><iframe ref={frame} title={title} sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={document}/></div>{error && <p className="feedback error" role="status">{error}</p>}</>
}

export default function WebLab({ initialCode, value, onChange, title = 'index.html' }: { initialCode: string; value?: string; onChange?: (code: string) => void; title?: string }) {
  const c = useLearningCopy()
  const id = useId()
  const [localCode, setLocalCode] = useState(initialCode)
  const [preview, setPreview] = useState(initialCode)
  const [narrow, setNarrow] = useState(false)
  const [revision, setRevision] = useState(0)
  const code = value ?? localCode
  function edit(next: string) { setLocalCode(next); onChange?.(next) }
  return <div className="web-lab">
    <div className="lab-toolbar"><label htmlFor={id}>{title}</label><div className="toolbar-actions"><button type="button" className="button ghost small" onClick={() => { setPreview(code); setRevision(v => v + 1) }}><RotateCcw size={14}/>{c('Restart preview', 'Ulangi preview')}</button><button type="button" className="button secondary small" onClick={() => { setPreview(code); setRevision(v => v + 1) }}><Play size={14}/>{c('Update preview', 'Perbarui preview')}</button></div></div>
    <textarea id={id} className="web-code-editor" translate="no" value={code} onChange={event => edit(event.target.value)} spellCheck={false} autoCapitalize="off" maxLength={100000} aria-label={c('HTML, CSS, and JavaScript editor', 'Editor HTML, CSS, dan JavaScript')}/>
    <div className="preview-toolbar"><span role="status">{code !== preview ? c('Edits waiting for preview', 'Perubahan belum ditampilkan') : c('Preview matches your code', 'Preview sesuai kodemu')}</span><button type="button" className="button ghost small" aria-pressed={narrow} onClick={() => setNarrow(v => !v)}>{narrow ? c('Use wide preview', 'Gunakan preview lebar') : c('Use narrow preview', 'Gunakan preview sempit')}</button></div>
    <WebPreview key={revision} code={preview} narrow={narrow}/>
    <p className="lab-footnote">{c('HTML, inline CSS, and browser JavaScript run in an isolated preview. External resources, network requests, and form submissions are blocked.', 'HTML, CSS inline, dan JavaScript browser berjalan di preview terisolasi. Sumber eksternal, request jaringan, dan pengiriman form diblokir.')}</p>
  </div>
}
