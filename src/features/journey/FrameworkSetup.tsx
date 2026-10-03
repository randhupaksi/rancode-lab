import CodeBlock from '../../components/ui/CodeBlock'
import { useLearningCopy } from './useLearningCopy'

export default function FrameworkSetup({ framework }: { framework: 'react' | 'nextjs' }) {
  const c = useLearningCopy()
  const react = framework === 'react'
  const command = react
    ? 'npm create vite@latest study-list -- --template react\ncd study-list\nnpm install\nnpm run dev'
    : 'npx create-next-app@latest learning-dashboard\ncd learning-dashboard\nnpm run dev'
  return <details className="framework-setup">
    <summary>{c('Set up a local workspace', 'Siapkan workspace lokal')}</summary>
    <p>{c('Install a current Node.js LTS release, then open a terminal in a folder for your learning projects. Node.js runs development tools; npm installs the packages listed in package.json.', 'Pasang Node.js versi LTS terkini, lalu buka terminal di folder khusus proyek belajarmu. Node.js menjalankan tools pengembangan; npm memasang package yang tercatat di package.json.')}</p>
    <CodeBlock code={command} language="terminal"/>
    <ol>
      <li>{react ? c('Use the React JavaScript template. The TypeScript stage comes later.', 'Gunakan template React JavaScript. Tahap TypeScript menyusul nanti.') : c('Choose the recommended defaults, including TypeScript and App Router.', 'Pilih pengaturan yang direkomendasikan, termasuk TypeScript dan App Router.')}</li>
      <li>{c('Open the local address printed by the development server. Keep that terminal running while you work.', 'Buka alamat lokal yang ditampilkan server pengembangan. Biarkan terminal itu berjalan selama kamu mengerjakan proyek.')}</li>
      <li>{react ? c('Move your component into src/App.jsx. Save it and check the updated browser view.', 'Pindahkan komponennya ke src/App.jsx. Simpan dan periksa perubahan di browser.') : c('Start with app/page.tsx (or src/app/page.tsx if you chose a src folder). Put interactive components in separate files with a client boundary.', 'Mulai dari app/page.tsx, atau src/app/page.tsx jika memilih folder src. Letakkan komponen interaktif di file terpisah dengan batas client.')}</li>
      <li>{c('After implementing the project, run npm run build. Review visible behavior as well as build errors.', 'Setelah proyek diimplementasikan, jalankan npm run build. Periksa perilaku antarmuka sekaligus error build.')}</li>
    </ol>
    <a className="text-link" href={react ? 'https://vite.dev/guide/' : 'https://nextjs.org/docs/app/getting-started/installation'} target="_blank" rel="noreferrer">{c('Official setup guide', 'Panduan setup resmi')}</a>
  </details>
}
