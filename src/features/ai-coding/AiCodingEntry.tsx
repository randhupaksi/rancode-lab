import CompanionPathEntry from '../journey/CompanionPathEntry'
import { useLearningCopy } from '../journey/useLearningCopy'

export default function AiCodingEntry() {
  const c = useLearningCopy()
  return <CompanionPathEntry courseId="ai-coding" courseName="Vibe Coding"
    title={c('Build with an AI coding agent', 'Bangun bersama AI coding agent')}
    description={c('Vibe Coding: write better prompts, give your design a clear direction, and turn an idea into a small app you can review.', 'Vibe Coding: tulis prompt yang lebih jelas, beri desainmu arah, dan wujudkan ide menjadi aplikasi kecil yang bisa kamu tinjau.')}
    prerequisite={c('Read the briefs whenever you like. For the build exercises, start after HTML, CSS, JavaScript, and browser basics.', 'Materi brief bisa dibaca kapan saja. Untuk latihan membangun aplikasi, mulai setelah dasar HTML, CSS, JavaScript, dan browser.')}/>
}
