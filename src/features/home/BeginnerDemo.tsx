import { useState } from 'react'
import { HighlightedCode } from '../../components/ui/CodeBlock'
import { useLearningCopy } from '../journey/useLearningCopy'

export default function BeginnerDemo() {
  const c = useLearningCopy()
  const [name, setName] = useState('Ada')
  const [centered, setCentered] = useState(false)
  const escape = (text: string) => text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
  const subtitle = c('I am building my first web page.', 'Aku sedang membuat halaman web pertamaku.')
  const heading = `${c('Hello, I am', 'Halo, aku')} ${name || '…'}`
  const code = `<style>\n  article { text-align: ${centered ? 'center' : 'left'}; }\n</style>\n\n<article>\n  <h1>${escape(heading)}</h1>\n  <p>${subtitle}</p>\n</article>`
  return <section className="beginner-demo" aria-label={c('Your first HTML and CSS experiment', 'Eksperimen HTML dan CSS pertamamu')}><div className="lab-toolbar"><span>index.html</span><span className="quiet-note">{c('No setup needed', 'Langsung coba')}</span></div><div className="demo-workspace"><div className="beginner-demo-source"><pre translate="no"><code><HighlightedCode code={code}/></code></pre><div className="beginner-demo-controls"><label htmlFor="demo-name">{c('Change the name', 'Ganti namanya')}<input id="demo-name" className="field" maxLength={30} value={name} onChange={event => setName(event.target.value)}/></label><button className="button secondary small" aria-pressed={centered} onClick={() => setCentered(value => !value)}>{centered ? c('Align text left', 'Ratakan teks ke kiri') : c('Center the text', 'Ratakan teks ke tengah')}</button></div></div><div className="beginner-demo-output"><span className="eyebrow">{c('Your page', 'Halamanmu')}</span><article style={{ textAlign: centered ? 'center' : 'left' }} aria-live="polite"><h2>{heading}</h2><p>{subtitle}</p></article></div></div><p className="beginner-demo-note">{c('HTML describes the content. CSS changes its appearance. You just changed both.', 'HTML menyusun konten. CSS mengatur tampilannya. Kamu baru saja mengubah keduanya.')}</p></section>
}
