import { useId, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { copyText } from '../../lib/clipboard'
import { useLocale } from '../locale/LocaleProvider'
import { useLearningCopy } from '../journey/useLearningCopy'
import './ai-coding.css'

const limit = 12000
function readDraft(key: string, example: string) {
  try {
    const saved = localStorage.getItem(key)
    return { value: saved === null ? example : saved.slice(0, limit), available: true, edited: saved !== null }
  } catch { return { value: example, available: false, edited: false } }
}

export default function PromptWorkshop({ lessonId, example }: { lessonId: string; example: string }) {
  const { locale } = useLocale()
  const c = useLearningCopy()
  const id = useId()
  const key = 'rancode-lab:prompt:' + lessonId + ':' + locale
  const [draft, setDraft] = useState(() => readDraft(key, example))
  const [notice, setNotice] = useState('')
  function update(value: string) {
    let available = true
    try { localStorage.setItem(key, value) } catch { available = false }
    setDraft({ value, available, edited: true }); setNotice('')
  }
  function reset() {
    let available = true
    try { localStorage.removeItem(key) } catch { available = false }
    setDraft({ value: example, available, edited: false })
    setNotice(c('Example restored.', 'Contoh awal sudah dipulihkan.'))
  }
  async function copy() {
    const value = draft.value
    setNotice(await copyText(value)
      ? c('Prompt copied. Try it in your chosen AI coding agent.', 'Prompt tersalin. Coba di AI coding agent pilihanmu.')
      : c('Copy is unavailable. Select the text and copy it manually.', 'Salin otomatis belum tersedia. Pilih teks lalu salin secara manual.'))
  }
  return <div className="prompt-workshop">
    <div className="prompt-workshop-heading"><label htmlFor={id}>{c('Your prompt draft', 'Draf prompt-mu')}</label><div className="button-row"><button className="text-link" type="button" onClick={reset}><RotateCcw size={14} aria-hidden="true"/>{c('Reset example', 'Reset ke contoh')}</button><button className="button secondary small" type="button" onClick={() => void copy()} disabled={!draft.value.trim()}><Copy size={14} aria-hidden="true"/>{c('Copy prompt', 'Salin prompt')}</button></div></div>
    <p id={id + '-hint'} className="quiet-note">{c('Adapt the example using the practice above. This is a writing space; try your prompt in your own agent workspace and inspect its result.', 'Sesuaikan contoh dengan latihan di atas. Ini ruang menulis; coba prompt di ruang kerja agent-mu sendiri lalu periksa hasilnya.')}</p>
    <textarea id={id} className="field prompt-draft" value={draft.value} onChange={event => update(event.target.value)} maxLength={limit} aria-describedby={id + '-hint'} spellCheck/>
    <div className="prompt-workshop-status"><span className="quiet-note">{draft.available ? draft.edited ? c('Draft saved in this browser for this language.', 'Draf tersimpan di browser ini untuk bahasa ini.') : c('Start from this example. Your edits will be saved in this browser.', 'Mulai dari contoh ini. Edit-mu akan tersimpan di browser ini.') : c('Browser storage is unavailable. Copy your draft before leaving.', 'Storage browser belum tersedia. Salin draf sebelum meninggalkan halaman.')} {draft.value.length}/{limit}</span><span role="status" className="quiet-note">{notice}</span></div>
    <details className="prompt-reference"><summary>{c('Compare with the original example', 'Bandingkan dengan contoh awal')}</summary><pre>{example}</pre></details>
  </div>
}
