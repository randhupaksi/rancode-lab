import CompanionPathEntry from '../journey/CompanionPathEntry'
import { useLearningCopy } from '../journey/useLearningCopy'

export default function TailwindEntry() {
  const c = useLearningCopy()
  return <CompanionPathEntry courseId="tailwind" courseName="Tailwind CSS"
    title={c('Style your next page with Tailwind', 'Atur tampilan halaman berikutnya dengan Tailwind')}
    description={c('Go from installation to responsive layouts, themes, and reusable components. Try the utilities in a live preview, then build your own study page.', 'Mulai dari instalasi sampai layout responsif, theme, dan komponen yang bisa dipakai ulang. Coba utility di preview live, lalu bangun halaman belajarmu sendiri.')}
    prerequisite={c('Start after HTML and CSS. React and Next.js examples build on their respective foundations; Tailwind is an optional branch of the main path.', 'Mulai setelah HTML dan CSS. Contoh React dan Next.js mengikuti fondasi masing-masing; Tailwind adalah cabang pilihan dari jalur utama.')}/>
}
