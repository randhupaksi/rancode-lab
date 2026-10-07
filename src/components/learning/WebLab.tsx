import { Fragment, useEffect, useId, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { RotateCcw } from 'lucide-react'
import { useLearningCopy } from '../../features/journey/useLearningCopy'
import { useLocale } from '../../features/locale/LocaleProvider'
import { previewDocument, previewSandbox } from './previewDocument'

const rawTextElements = new Set(['script', 'style', 'textarea', 'title', 'xmp', 'iframe', 'noembed', 'noframes', 'plaintext'])

function findUnclosedHeadingTags(markup: string) {
  const missing = new Set<string>()
  let openHeading: string | undefined
  let cursor = 0

  while (cursor < markup.length) {
    const start = markup.indexOf('<', cursor)
    if (start < 0) break

    if (markup.startsWith('<!--', start)) {
      const commentEnd = markup.indexOf('-->', start + 4)
      if (commentEnd < 0) break
      cursor = commentEnd + 3
      continue
    }

    if (markup[start + 1] === '!' || markup[start + 1] === '?') {
      cursor = start + 2
      let quote = ''
      while (cursor < markup.length) {
        const character = markup[cursor]
        if (quote) {
          if (character === quote) quote = ''
        } else if (character === '"' || character === "'") {
          quote = character
        } else if (character === '>') {
          cursor++
          break
        }
        cursor++
      }
      continue
    }

    const token = /^<(\/)?([a-z][a-z\d:-]*)\b/i.exec(markup.slice(start))
    if (!token) {
      cursor = start + 1
      continue
    }

    const closing = Boolean(token[1])
    const tagName = token[2].toLowerCase()
    cursor = start + token[0].length
    let quote = ''
    while (cursor < markup.length) {
      const character = markup[cursor]
      if (quote) {
        if (character === quote) quote = ''
      } else if (character === '"' || character === "'") {
        quote = character
      } else if (character === '>') {
        cursor++
        break
      }
      cursor++
    }

    if (cursor >= markup.length && markup[cursor - 1] !== '>') break

    if (!closing && rawTextElements.has(tagName)) {
      if (tagName === 'plaintext') break
      const closingTag = new RegExp(`<\\/\\s*${tagName}\\s*>`, 'ig')
      closingTag.lastIndex = cursor
      const match = closingTag.exec(markup)
      if (!match) break
      cursor = closingTag.lastIndex
      continue
    }

    if (!/^h[1-6]$/.test(tagName)) continue
    if (closing) {
      if (openHeading === tagName) openHeading = undefined
    } else {
      if (openHeading) missing.add(`</${openHeading}>`)
      openHeading = tagName
    }
  }

  if (openHeading) missing.add(`</${openHeading}>`)
  return [...missing]
}

export function WebPreview({ code, title, narrow = false, unstyled = false }: { code: string; title?: string; narrow?: boolean; unstyled?: boolean }) {
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
  const document = previewDocument(code, locale, channel, unstyled)
  return <><div className={`web-preview ${narrow ? 'is-narrow' : ''}`}><iframe ref={frame} title={title ?? t('lab.preview')} sandbox={previewSandbox} referrerPolicy="no-referrer" srcDoc={document}/></div>{error && <p className="feedback error" role="status">{error}</p>}</>
}

export default function WebLab({ initialCode, value, onChange, title = 'index.html', renderPreview, footnote }: { initialCode: string; value?: string; onChange?: (code: string) => void; title?: string; renderPreview?: (code: string, narrow: boolean) => ReactNode; footnote?: string }) {
  const c = useLearningCopy()
  const id = useId()
  const [localCode, setLocalCode] = useState(initialCode)
  const [preview, setPreview] = useState(initialCode)
  const [narrow, setNarrow] = useState(false)
  const [revision, setRevision] = useState(0)
  const code = value ?? localCode
  const unclosedHeadingTags = useMemo(() => findUnclosedHeadingTags(code), [code])
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
    {unclosedHeadingTags.length > 0 && <p className="feedback web-lab-warning" role="status"><span>{c('The browser still shows the preview, but some heading tags are missing their closing tags: ', 'Preview tetap tampil, tapi beberapa tag heading ini belum ditutup di HTML-mu: ')}</span><code translate="no">{unclosedHeadingTags.join(', ')}</code><span>{c('. Add them to keep the HTML structure complete.', '. Tambahkan tag tersebut supaya struktur HTML-mu tetap lengkap.')}</span></p>}
    <div className="preview-toolbar"><span role="status">{code !== preview ? c('Preview updates when you pause typing', 'Preview diperbarui saat kamu berhenti mengetik') : c('Preview updates automatically', 'Preview diperbarui otomatis')}</span><button type="button" className="button ghost small" aria-pressed={narrow} onClick={() => setNarrow(v => !v)}>{narrow ? c('Use wide preview', 'Gunakan preview lebar') : c('Use narrow preview', 'Gunakan preview sempit')}</button></div>
    {renderPreview ? <Fragment key={revision}>{renderPreview(preview, narrow)}</Fragment> : <WebPreview key={revision} code={preview} narrow={narrow}/>}
    <p className="lab-footnote">{footnote ?? c('HTML, inline CSS, and browser JavaScript run in an isolated preview. External resources, network requests, and form submissions are blocked.', 'HTML, CSS inline, dan JavaScript browser berjalan di preview terisolasi. Sumber eksternal, request jaringan, dan pengiriman form diblokir.')}</p>
  </div>
}
