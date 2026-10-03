import { memo, useEffect, useRef, useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { copyText } from '../../lib/clipboard'
import { useLocale } from '../../features/locale/LocaleProvider'

export const HighlightedCode = memo(function HighlightedCode({ code }: { code: string }) {
  const chunks = code.split(/(\/\/[^\n]*|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`[^`]*`|\b(?:const|let|var|type|interface|extends|return|function|async|await|if|else|in|keyof|typeof|export|new|as|readonly|throw)\b|\b(?:string|number|boolean|unknown|never|any|void|Promise|Array|Record|Partial|Pick|Omit)\b|\b\d+\b|\b(?:true|false|null|undefined)\b)/g)
  return <>{chunks.map((chunk, index) => {
    const cls = chunk.startsWith('//') ? 'syntax-comment' : /^["'`]/.test(chunk) ? 'syntax-string' : /^(?:string|number|boolean|unknown|never|any|void|Promise|Array|Record|Partial|Pick|Omit)$/.test(chunk) ? 'syntax-type' : /^(?:\d+|true|false|null|undefined)$/.test(chunk) ? 'syntax-value' : /^(?:const|let|var|type|interface|extends|return|function|async|await|if|else|in|keyof|typeof|export|new|as|readonly|throw)$/.test(chunk) ? 'syntax-keyword' : undefined
    return <span className={cls} key={index}>{chunk}</span>
  })}</>
})

export default function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const { t } = useLocale()
  const [status, setStatus] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = async () => {
    setStatus(await copyText(code) ? t('code.copied') : t('code.unavailable'))
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setStatus(''), 2500)
  }
  return <div className="code-block">
    <div className="code-block-toolbar"><span>{language}</span><button className="icon-button" aria-label={t('code.copy')} onClick={copy}>{status === t('code.copied') ? <Check size={15} /> : <Copy size={15} />}</button></div>
    <pre translate="no"><code><HighlightedCode code={code} /></code></pre>
    <span className="sr-only" role="status">{status}</span>
  </div>
}
