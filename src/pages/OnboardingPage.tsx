import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { getCourse } from '../content'
import { experienceOptions, getStage } from '../content/journey'
import { useProgress } from '../features/progress/ProgressProvider'
import CheckpointQuiz from '../features/journey/CheckpointQuiz'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { usePageTitle } from '../hooks/usePageTitle'

export default function OnboardingPage() {
  const c = useLearningCopy()
  usePageTitle(c('Find your starting point', 'Temukan titik mulainya'))
  const { setLearningProfile } = useProgress()
  const navigate = useNavigate()
  const [choice, setChoice] = useState<(typeof experienceOptions)[number] | null>(null)
  const [result, setResult] = useState<{ score: number; total: number } | null>(null)
  const stage = getStage(choice?.assessCourseId ?? undefined)
  const recommended = choice ? result && result.score < result.total ? choice.assessCourseId! : choice.startCourseId : 'logic'
  function begin(courseId: string) { setLearningProfile(choice?.id ?? 'new', courseId); navigate('/learn') }
  return <div className="page-width journey-page onboarding-page">
    <Link className="text-link" to="/learn"><ArrowLeft size={14}/>{c('Learning path', 'Jalur belajar')}</Link>
    <header className="journey-heading"><p className="eyebrow">{c('Your starting point', 'Titik awalmu')}</p><h1>{c('Start where you are.', 'Mulai dari yang kamu pahami.')}</h1><p className="page-lead">{c('A short check helps us suggest your next step. No account, no timer, and every lesson stays open.', 'Cek singkat membantu menentukan langkah berikutnya. Tanpa akun, tanpa batas waktu, dan semua pelajaran tetap terbuka.')}</p></header>
    {!choice ? <div className="experience-options">{experienceOptions.map(option => <button className="experience-option" key={option.id} onClick={() => { setChoice(option); setResult(null) }}><span><strong>{c(option.label, option.labelId)}</strong><small>{c(option.detail, option.detailId)}</small></span><ArrowRight size={18}/></button>)}</div> : <>
      <div className="onboarding-selection"><strong>{c(choice.label, choice.labelId)}</strong><button className="text-link" onClick={() => { setChoice(null); setResult(null) }}>{c('Change starting point', 'Ganti titik awal')}</button></div>
      {stage ? <><h2>{c('A quick readiness check', 'Cek kesiapan singkat')}</h2><p className="muted">{c('This samples one foundation area. It does not certify earlier stages or mark them complete.', 'Ini hanya mengecek sebagian fondasi. Hasilnya tidak menandai tahap sebelumnya sebagai selesai.')}</p><CheckpointQuiz key={stage.courseId} questions={stage.checkpoint} onComplete={(score, total) => setResult({ score, total })} onRetry={() => setResult(null)}/></> : <div className="onboarding-result"><h2>{c('Small steps. A real first result.', 'Langkah kecil. Hasil pertama yang nyata.')}</h2><p>{c('Begin with decisions and clear instructions, then build your first web page. No syntax knowledge required.', 'Mulai dari keputusan dan instruksi yang jelas, lalu buat halaman web pertamamu. Tidak perlu hafal sintaks.')}</p></div>}
      {(!stage || result) && <div className="onboarding-result"><span className="eyebrow">{c('Suggested starting stage', 'Tahap awal yang disarankan')}</span><h2>{getCourse(recommended)?.title}</h2><p>{getStage(recommended)?.outcome}</p><button className="button primary" onClick={() => begin(recommended)}>{c('Use this starting point', 'Gunakan titik awal ini')}<ArrowRight size={16}/></button></div>}
      {stage && <button className="text-link onboarding-skip" onClick={() => begin(choice.startCourseId)}>{c('Use my chosen starting point without the check', 'Gunakan pilihanku tanpa cek kesiapan')}</button>}
    </>}
    <p className="quiet-note journey-footnote">{c('You can change your starting point later without deleting any progress.', 'Kamu bisa mengganti titik awal nanti tanpa menghapus progres.')}</p>
  </div>
}
