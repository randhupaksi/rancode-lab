import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useProgress } from '../progress/ProgressProvider'
import { getCompanionPathProgress } from '../journey/companion-path-progress'
import { useLearningCopy } from '../journey/useLearningCopy'
import './home-learning-tracks.css'

export default function HomeLearningTracks() {
  const c = useLearningCopy()
  const progress = useProgress()
  const tailwind = getCompanionPathProgress('tailwind', progress)
  const vibeCoding = getCompanionPathProgress('ai-coding', progress)
  const tracks = [
    {
      href: '/learn/react',
      label: c('Main learning path', 'Jalur utama'),
      title: 'React, TypeScript & Next.js',
      description: c('Build interfaces with React, make their data safer with TypeScript, then bring everything together in Next.js.', 'Bangun antarmuka dengan React, jaga datanya dengan TypeScript, lalu rangkai semuanya di Next.js.'),
    },
    {
      href: tailwind.destination,
      label: c('After HTML and CSS', 'Setelah HTML dan CSS'),
      title: 'Tailwind CSS',
      description: c('Learn from setup to responsive layouts, themes, and reusable components.', 'Pelajari dari instalasi sampai layout responsif, tema, dan komponen yang bisa dipakai ulang.'),
    },
    {
      href: vibeCoding.destination,
      label: c('Build exercises after web basics', 'Latihan setelah dasar web'),
      title: 'Vibe Coding',
      description: c('Write clear prompts, guide an AI coding agent, then review and improve what it builds.', 'Tulis prompt yang jelas, arahkan AI coding agent, lalu tinjau dan perbaiki hasilnya.'),
    },
  ]

  return <section className="home-learning-tracks" aria-labelledby="home-learning-tracks-title">
    <header className="home-learning-tracks-heading">
      <span className="eyebrow">{c('WHERE TO GO NEXT', 'PILIH LANGKAH BERIKUTNYA')}</span>
      <h2 id="home-learning-tracks-title">{c('Build on your web foundations', 'Lanjutkan dari fondasi web')}</h2>
      <p>{c('React, TypeScript, and Next.js continue the main path. Tailwind CSS helps you style pages after HTML and CSS, while Vibe Coding shows you how to work with an AI coding agent after the web basics.', 'React, TypeScript, dan Next.js melanjutkan jalur utama. Tailwind CSS membantumu menata halaman setelah HTML dan CSS, sedangkan Vibe Coding mengajarkan cara bekerja dengan AI coding agent setelah memahami dasar web.')}</p>
    </header>
    <ol className="home-learning-tracks-list">
      {tracks.map((track, index) => <li key={track.title}>
        <Link className="home-learning-track" to={track.href}>
          <span className="number-label" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
          <span className="home-learning-track-copy">
            <span className="home-learning-track-label">{track.label}</span>
            <strong>{track.title}</strong>
            <span className="home-learning-track-description">{track.description}</span>
          </span>
          <ArrowRight size={17} aria-hidden="true"/>
        </Link>
      </li>)}
    </ol>
  </section>
}
