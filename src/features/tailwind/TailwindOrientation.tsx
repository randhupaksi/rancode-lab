import { Link } from 'react-router-dom'
import { useLearningCopy } from '../journey/useLearningCopy'
import '../journey/companion-path.css'

export default function TailwindOrientation() {
  const c = useLearningCopy()
  const routes = [
    { id: 'tw-vite-install', title: 'Vite', description: c('Connect the Vite plugin and import your CSS. Keep existing framework plugins.', 'Hubungkan plugin Vite dan impor CSS-mu. Pertahankan plugin framework yang sudah ada.'), url: 'https://tailwindcss.com/docs/installation/using-vite' },
    { id: 'tw-cli-install', title: c('Plain HTML + CLI', 'HTML biasa + CLI'), description: c('Compile input CSS and link the output stylesheet from HTML.', 'Kompilasi CSS input, lalu hubungkan stylesheet output dari HTML.'), url: 'https://tailwindcss.com/docs/installation/tailwind-cli' },
    { id: 'tw-next-install', title: 'Next.js + PostCSS', description: c('Check the existing setup first, then connect PostCSS and globals.css if needed.', 'Periksa setup yang sudah ada, lalu hubungkan PostCSS dan globals.css jika dibutuhkan.'), url: 'https://tailwindcss.com/docs/installation/framework-guides/nextjs' },
  ]
  return <section className="companion-orientation" aria-labelledby="tailwind-setup-heading">
    <h2 id="tailwind-setup-heading">{c('Choose one setup, then learn the shared utilities', 'Pilih satu setup, lalu pelajari utility yang sama')}</h2>
    <p>{c('This path teaches Tailwind v4.3. You can read all installation examples, but only need to configure the route your project uses. If CSS is still new to you, revisit the foundation first.', 'Jalur ini membahas Tailwind v4.3. Kamu bisa membaca semua contoh instalasi, tetapi cukup mengatur alur yang dipakai proyekmu. Kalau CSS masih terasa baru, pelajari fondasinya dulu.')}{' '}<Link className="text-link" to="/learn/css">{c('Open CSS foundations', 'Buka fondasi CSS')}</Link></p>
    <ul className="companion-setup-options">{routes.map(route => <li key={route.id}><h3>{route.title}</h3><p>{route.description}</p><Link className="text-link" to={'/learn/tailwind/' + route.id}>{c('Open setup lesson', 'Buka pelajaran instalasi')}</Link><br/><a className="text-link" href={route.url} target="_blank" rel="noopener noreferrer">{c('Official guide ↗', 'Panduan resmi ↗')}</a></li>)}</ul>
    <p>{c('Utility and layout lessons have a local live HTML preview with reset and narrow-view controls. Installation commands, external CSS files, React JSX, and Next.js apps belong in your own local workspace. The lab does not run npm or a framework server.', 'Pelajaran utility dan layout punya preview HTML live lokal dengan reset dan tampilan sempit. Perintah instalasi, file CSS eksternal, JSX React, dan aplikasi Next.js dijalankan di ruang kerja lokalmu sendiri. Lab tidak menjalankan npm atau server framework.')}</p>
    <p>{c('In a local app, move @theme, @utility, and @custom-variant from the lab style blocks into your input CSS after the Tailwind import. A text/tailwindcss style block is a preview feature, not a production stylesheet.', 'Di aplikasi lokal, pindahkan @theme, @utility, dan @custom-variant dari blok style lab ke CSS input setelah impor Tailwind. Blok style text/tailwindcss adalah fitur preview, bukan stylesheet production.')}</p>
    <p className="quiet-note">{c('After the lessons: a knowledge check, a responsive study-page project, and your own review notes.', 'Setelah materi: cek pemahaman, proyek halaman belajar responsif, dan catatan tinjauanmu sendiri.')}</p>
  </section>
}
