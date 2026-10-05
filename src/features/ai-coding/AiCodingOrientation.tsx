import { Link } from 'react-router-dom'
import { useLearningCopy } from '../journey/useLearningCopy'
import './ai-coding.css'

export default function AiCodingOrientation() {
  const c = useLearningCopy()
  return <section className="ai-orientation" aria-labelledby="ai-flow-title">
    <h2 id="ai-flow-title">{c('A workflow you can take into your own project', 'Alur yang bisa kamu bawa ke proyekmu sendiri')}</h2>
    <ol className="ai-flow">
      <li><span className="number-label">01</span><div><h3>{c('Brief & prompt', 'Brief & prompt')}</h3><p>{c('Define the user, outcome, constraints, and design direction. Adapt the examples in the prompt workspace.', 'Tentukan pengguna, tujuan, batasan, dan arah desain. Sesuaikan contoh di ruang prompt.')}</p></div></li>
      <li><span className="number-label">02</span><div><h3>{c('Build & refine', 'Bangun & perbaiki')}</h3><p>{c('Work with your chosen agent in a local project. Build one useful slice, try it, and give specific feedback.', 'Pakai agent pilihanmu di proyek lokal. Bangun satu bagian berguna, coba, lalu beri feedback yang spesifik.')}</p></div></li>
      <li><span className="number-label">03</span><div><h3>{c('Review & explain', 'Tinjau & jelaskan')}</h3><p>{c('Check behavior and changed code, then record the actual prompts, decisions, and results in your build journal.', 'Periksa perilaku dan perubahan kode, lalu catat prompt nyata, keputusan, dan hasilnya di jurnal proyek.')}</p></div></li>
    </ol>
    <p className="quiet-note">{c('Need the foundations first?', 'Mau bangun fondasinya dulu?')} <Link className="text-link" to="/learn/html">HTML</Link> · <Link className="text-link" to="/learn/css">CSS</Link> · <Link className="text-link" to="/learn/javascript">JavaScript</Link> · <Link className="text-link" to="/learn/browser">{c('Browser interactions', 'Interaksi browser')}</Link>. {c('Using a framework? Follow its foundations before choosing it for the capstone.', 'Mau pakai framework? Pelajari fondasinya sebelum memilihnya untuk proyek akhir.')} <Link className="text-link" to="/learn/react">React</Link> · <Link className="text-link" to="/learn/nextjs">Next.js</Link></p>
  </section>
}

