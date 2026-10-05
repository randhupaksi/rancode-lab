import CodeBlock from '../../components/ui/CodeBlock'
import TextLink from '../../components/ui/TextLink'
import { useLearningCopy } from './useLearningCopy'

export default function FrameworkSetup({ framework }: { framework: 'react' | 'nextjs' }) {
  const c = useLearningCopy()
  const react = framework === 'react'
  const command = react
    ? 'npm create vite@latest study-list -- --template react\ncd study-list\nnpm install\nnpm run dev'
    : 'npx create-next-app@latest learning-dashboard\ncd learning-dashboard\nnpm run dev'
  return <details className="framework-setup">
    <summary>{c('Set up a local workspace', 'Siapkan ruang kerja lokal')}</summary>
    <p>{c('Install a current Node.js LTS release, then open a terminal in your learning-project folder. Node.js runs development tools; npm installs the packages listed in package.json.', 'Pasang Node.js LTS versi terbaru, lalu buka terminal di folder proyek belajarmu. Node.js menjalankan alat pengembangan, sedangkan npm memasang paket yang tercantum di package.json.')}</p>
    <CodeBlock code={command} language="terminal"/>
    <ol>
      <li>{react ? c('Choose the React JavaScript template. You will get to TypeScript later.', 'Pilih template React dengan JavaScript. Kamu akan belajar TypeScript di tahap berikutnya.') : c('Choose the recommended options, including TypeScript and the App Router.', 'Pilih pengaturan yang disarankan, termasuk TypeScript dan App Router.')}</li>
      <li>{c('Open the local address shown in the terminal. Keep the development server running while you work.', 'Buka alamat lokal yang muncul di terminal. Biarkan server pengembangan tetap berjalan selama kamu mengerjakan proyek.')}</li>
      <li>{react ? c('Move your component into src/App.jsx, save it, and check the page in your browser.', 'Pindahkan komponenmu ke src/App.jsx, simpan, lalu lihat hasilnya di browser.') : c('Start with app/page.tsx (or src/app/page.tsx if you chose a src folder). Put interactive components in separate files with a client boundary.', 'Mulai dari app/page.tsx, atau src/app/page.tsx jika memilih folder src. Letakkan komponen interaktif di file terpisah dengan batas client.')}</li>
      <li>{c('When you finish the project, run npm run build. Check the page as well as the build output.', 'Setelah proyek selesai, jalankan npm run build. Periksa tampilan halaman dan hasil build-nya.')}</li>
    </ol>
    <TextLink href={react ? 'https://vite.dev/guide/' : 'https://nextjs.org/docs/app/getting-started/installation'} target="_blank" rel="noreferrer">{c('Official setup guide', 'Panduan setup resmi')}</TextLink>
  </details>
}
