import { useEffect, useState } from 'react'
import WebLab, { WebPreview } from './WebLab'
import { useLearningCopy } from '../../features/journey/useLearningCopy'

function extractSource(code: string) {
  const document = new DOMParser().parseFromString(code, 'text/html')
  const candidates = new Set<string>()
  document.querySelectorAll('[class]').forEach(element => {
    element.getAttribute('class')!.split(/\s+/).filter(Boolean).forEach(value => candidates.add(value))
  })
  // Include complete strings in inline scripts (e.g. classList toggles).
  code.split(/[\s"'\x60<>]+/).filter(Boolean).forEach(value => candidates.add(value))
  const customCss = [...document.querySelectorAll('style[type="text/tailwindcss"]')]
    .map(style => style.textContent ?? '').join('\n')
  const markup = code.replace(/<style\b(?=[^>]*\btype\s*=\s*["']text\/tailwindcss["'])[^>]*>[\s\S]*?<\/style\s*>/gi, '')
  return { candidates: [...candidates], customCss, markup }
}

function TailwindPreview({ code, narrow }: { code: string; narrow: boolean }) {
  const c = useLearningCopy()
  const [result, setResult] = useState<{ source: string; document?: string; error?: string }>()
  useEffect(() => {
    let worker: Worker | undefined
    let timeout: number | undefined
    let active = true
    const fail = (error: string) => {
      if (active) setResult({ source: code, error })
      worker?.terminate()
      window.clearTimeout(timeout)
    }
    try {
      const { candidates, customCss, markup } = extractSource(code)
      if (code.length > 100000 || customCss.length > 25000 || candidates.length > 3000) {
        fail('preview-limit')
        return
      }
      worker = new Worker(new URL('./tailwind.worker.ts', import.meta.url), { type: 'module' })
      timeout = window.setTimeout(() => fail('preview-timeout'), 10000)
      worker.onerror = () => fail('compile-error')
      worker.onmessage = (event: MessageEvent<{ css?: string; error?: string }>) => {
        if (!active) return
        if (event.data.error) { fail(event.data.error); return }
        if (typeof event.data.css !== 'string') { fail('compile-error'); return }
        const css = event.data.css.replace(/<\/style/gi, '<\\/style')
        setResult({ source: code, document: '<style>' + css + '</style>' + markup })
        worker?.terminate()
        window.clearTimeout(timeout)
      }
      worker.postMessage({ candidates, customCss })
    } catch { fail('compile-error') }
    return () => {
      active = false
      worker?.terminate()
      window.clearTimeout(timeout)
    }
  }, [code])
  if (!result || result.source !== code) return <p className="lab-footnote" role="status">{c('Compiling your Tailwind utilities…', 'Menyiapkan utility Tailwind-mu…')}</p>
  if (result.error) {
    const message = result.error === 'preview-limit'
      ? c('This example is too large for the preview. Shorten the source or custom CSS and try again.', 'Contohnya terlalu besar untuk preview. Ringkas source atau CSS kustom, lalu coba lagi.')
      : result.error === 'preview-timeout'
        ? c('Compilation took too long. Simplify the CSS and edit again to retry.', 'Kompilasi terlalu lama. Sederhanakan CSS lalu edit lagi untuk mencoba ulang.')
        : result.error === 'local-project-required'
          ? c('External CSS imports and plugins need your local project. Use inline theme, variants, and utilities in this lab.', 'Impor CSS eksternal dan plugin membutuhkan proyek lokalmu. Pakai theme, variant, dan utility inline di lab ini.')
          : c('The CSS could not compile. Check the syntax in your text/tailwindcss style block.', 'CSS belum bisa dikompilasi. Periksa sintaks di blok style text/tailwindcss.')
    return <div className="feedback error" role="status"><p>{message}</p>{!['preview-limit', 'preview-timeout', 'local-project-required', 'compile-error'].includes(result.error) && <pre translate="no" style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{result.error}</pre>}</div>
  }
  return <WebPreview code={result.document!} narrow={narrow} unstyled/>
}

export default function TailwindLab({ initialCode, value, onChange }: { initialCode: string; value?: string; onChange?: (code: string) => void }) {
  const c = useLearningCopy()
  return <WebLab initialCode={initialCode} value={value} onChange={onChange}
    renderPreview={(code, narrow) => <TailwindPreview code={code} narrow={narrow}/>}
    footnote={c('Tailwind utilities compile locally in this lab. Use style type="text/tailwindcss" for theme and utility directives. External imports, plugins, npm commands, and network requests need your own project.', 'Utility Tailwind dikompilasi secara lokal di lab ini. Pakai style type="text/tailwindcss" untuk direktif theme dan utility. Impor eksternal, plugin, perintah npm, dan request jaringan membutuhkan proyekmu sendiri.')}/>
}
