import { useEffect, useId, useRef, useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import CodeEditor from '../../features/editor/CodeEditor'
import { useLearningCopy } from '../journey/useLearningCopy'
import './project-labs.css'

function makePreviewDocument(sourceCode: string, channel: string) {
  const source = JSON.stringify(sourceCode).replace(/</g, '\\u003c')
  const nonce = JSON.stringify(channel)
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' blob: https://esm.sh https://cdn.jsdelivr.net; style-src 'unsafe-inline'; img-src data:; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'; object-src 'none'; frame-src 'none'"><script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7/babel.min.js"></script><script type="importmap">{"imports":{"react":"https://esm.sh/react@19","react-dom/client":"https://esm.sh/react-dom@19/client?external=react","react/jsx-runtime":"https://esm.sh/react@19/jsx-runtime"}}</script><style>body{font:16px/1.6 system-ui,sans-serif;color:#17261b;background:#eef4ef;margin:0;padding:24px;overflow-wrap:anywhere}*{box-sizing:border-box}button,input{font:inherit}button{cursor:pointer}:focus-visible{outline:3px solid #287448;outline-offset:3px}.study-list{width:min(100%,620px);margin:20px auto;padding:26px;border:1px solid #d9e5da;border-radius:16px;background:#fff;box-shadow:0 14px 40px #18301c12}.study-list .eyebrow{font-size:10px;letter-spacing:.12em;color:#52735a}.study-list h1{font-size:clamp(28px,5vw,42px);line-height:1.15;letter-spacing:-.05em;margin:8px 0}.study-list>p{color:#637268;font-size:13px}.study-list form{display:grid;gap:7px;margin:22px 0 12px}.study-list form>label{font-size:11px;color:#526258}.study-list-form{display:flex;gap:8px}.study-list input{min-width:0;flex:1;border:1px solid #cbd8cc;border-radius:8px;padding:10px;font:inherit}.study-list button{border:0;border-radius:8px;background:#164b2b;color:#fff;padding:10px 13px;font-size:12px}.study-list ul{list-style:none;display:grid;gap:8px;padding:0;margin:16px 0 0}.study-list li{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1px solid #e1e9e1;border-radius:9px;font-size:12px}.study-list li button{margin-left:auto;background:#e8f2e9;color:#174c2c}.study-list li.done span{color:#758178;text-decoration:line-through}.study-list .empty-state{padding:20px;border:1px dashed #cbd8cc;border-radius:9px}.study-list [role=status]{min-height:1.5em}</style></head><body><div id="root"></div><script type="module">const channel=${nonce};const send=(error)=>parent.postMessage({channel,error:String(error).slice(0,500)},'*');addEventListener('error',event=>send(event.message||'Preview error'));addEventListener('unhandledrejection',event=>send(event.reason||'Preview error'));try{if(!globalThis.Babel)throw new Error('The React compiler could not load. Check your connection and refresh.');const compiled=Babel.transform(${source},{presets:[["react",{runtime:"automatic"}]],sourceType:"module"}).code;const [React,ReactDOM]=await Promise.all([import('react'),import('react-dom/client')]);const url=URL.createObjectURL(new Blob([compiled],{type:'text/javascript'}));try{const app=await import(url);if(typeof app.default!=='function')throw new Error('Add a default exported React component to render the preview.');ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(app.default));}finally{URL.revokeObjectURL(url);}}catch(error){send(error?.message||error)}</script></body></html>`
}

export default function ReactProjectLab({ initialCode, value, onChange }: { initialCode: string; value: string; onChange: (value: string) => void }) {
  const c = useLearningCopy()
  const channel = useId()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [previewCode, setPreviewCode] = useState(value)
  const [frameError, setFrameError] = useState('')
  const [frameRevision, setFrameRevision] = useState(0)

  useEffect(() => {
    if (value === previewCode) return
    const timer = window.setTimeout(() => { setPreviewCode(value); setFrameError(''); setFrameRevision(revision => revision + 1) }, 500)
    return () => window.clearTimeout(timer)
  }, [value, previewCode])

  useEffect(() => {
    const receive = (event: MessageEvent) => {
      if (event.source === frameRef.current?.contentWindow && event.data?.channel === channel && typeof event.data.error === 'string') setFrameError(event.data.error)
    }
    window.addEventListener('message', receive)
    return () => window.removeEventListener('message', receive)
  }, [channel])

  const previewDocument = makePreviewDocument(previewCode, channel)
  function reset() { onChange(initialCode); setPreviewCode(initialCode); setFrameError(''); setFrameRevision(revision => revision + 1) }

  return <section className="project-lab react-project-lab" aria-label={c('React project workspace', 'Ruang kerja proyek React')}>
    <div className="project-lab-heading"><div><p className="eyebrow">{c('REACT WORKSPACE', 'RUANG KERJA REACT')}</p><h2>{c('Build the study list here', 'Bangun daftar belajar di sini')}</h2><p>{c('Edit the component, then try adding, completing, and validating tasks in the live preview.', 'Edit komponennya, lalu coba tambah, selesaikan, dan validasi tugas di preview langsung.')}</p></div><button type="button" className="button ghost small" onClick={reset}><RotateCcw size={14}/>{c('Reset code', 'Reset kode')}</button></div>
    <div className="react-workspace-grid"><div className="react-code-panel"><div className="project-preview-bar"><span>StudyList.jsx</span><span className="quiet-note">{value !== previewCode ? c('Preview updates after a short pause.', 'Preview diperbarui setelah jeda singkat.') : c('Changes save in this browser.', 'Perubahan tersimpan di browser ini.')}</span></div><CodeEditor value={value} onChange={code => onChange(code.slice(0, 50000))} label={c('React component editor', 'Editor komponen React')} minHeight={380}/></div><div className="react-preview-panel"><div className="project-preview-bar"><span>{c('LIVE REACT PREVIEW', 'PREVIEW REACT LANGSUNG')}</span><button type="button" className="text-link" onClick={() => { setFrameError(''); setFrameRevision(revision => revision + 1) }}><Play size={13}/>{c('Refresh preview', 'Muat ulang preview')}</button></div>{value !== previewCode && <p className="project-runtime-status" role="status">{c('Updating the preview…', 'Memperbarui preview…')}</p>}<iframe ref={frameRef} key={frameRevision} title={c('Interactive React project preview', 'Pratinjau proyek React interaktif')} sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={previewDocument}/>{frameError && <p className="feedback error" role="status">{c('The preview could not start. Check the code and your connection, then refresh.', 'Preview belum bisa dijalankan. Periksa kode dan koneksimu, lalu muat ulang.')}: {frameError}</p>}<p className="lab-footnote">{c('Your component runs in an isolated iframe. React and Babel are loaded from public CDNs; your app code stays in this browser and preview network requests are blocked. Do not add secrets.', 'Komponenmu berjalan di iframe terisolasi. React dan Babel dimuat dari CDN publik; kode aplikasi tetap di browser ini dan request jaringan dari preview diblokir. Jangan masukkan secret.')}</p></div></div>
  </section>
}
