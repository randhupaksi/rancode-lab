import { lazy, Suspense, useState } from 'react'
import { ArrowLeft, ArrowRight, CheckCircle2, Download } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { getCourse, getNextCourse } from '../content'
import { getStage } from '../content/journey'
import type { JourneyStage } from '../content/journey'
import { useProgress } from '../features/progress/ProgressProvider'
import type { ProjectDraft } from '../features/progress/ProgressProvider'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { usePageTitle } from '../hooks/usePageTitle'
import LazyLab from '../components/learning/LazyLab'
import FrameworkSetup from '../features/journey/FrameworkSetup'
const WebLab = lazy(() => import('../components/learning/WebLab'))
const ConsoleLab = lazy(() => import('../components/learning/ConsoleLab'))
const CodeEditor = lazy(() => import('../features/editor/CodeEditor'))

function ProjectWorkspace({ stage }: { stage: JourneyStage }) {
  const c = useLearningCopy()
  const progress = useProgress()
  const project = stage.project
  const draft: ProjectDraft = progress.projects[stage.courseId] ?? { code: project.starter, notes: '', criteria: [], completed: false, updatedAt: '' }
  const [message, setMessage] = useState('')
  const course = getCourse(stage.courseId)!
  const next = getNextCourse(course.id)
  const ready = project.criteria.every(criterion => draft.criteria.includes(criterion)) && Boolean(draft.code.trim()) && Boolean(draft.notes.trim())
  const passed = progress.checkpoints[course.id]?.passed
  function update(change: Partial<ProjectDraft>) {
    const nextDraft = { ...draft, ...(change.code !== undefined && change.code !== draft.code ? { criteria: [] } : {}), ...change, completed: change.completed ?? false, updatedAt: new Date().toISOString() }
    progress.saveProject(course.id, nextDraft); setMessage('')
  }
  function download() {
    const text = `${project.title}\n\n${project.brief}\n\nCODE / ARTIFACT\n${draft.code}\n\nREVIEW NOTES\n${draft.notes}\n\nSELF REVIEW\n${project.criteria.map(item => `${draft.criteria.includes(item) ? '[x]' : '[ ]'} ${item}`).join('\n')}`
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `undercode-${course.id}-project.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="page-width journey-page project-page">
    <Link className="text-link" to="/learn"><ArrowLeft size={14}/>{c('My learning path', 'Jalur belajarku')}</Link>
    <header className="journey-heading"><p className="eyebrow">{course.title} / {course.id === 'nextjs' ? 'Capstone' : c('Stage project', 'Proyek tahap ini')}</p><h1>{project.title}</h1><p className="page-lead">{project.brief}</p></header>
    <div className="project-layout"><div className="project-main"><section className="project-brief"><h2>{c('Build it in steps', 'Bangun secara bertahap')}</h2><ol>{project.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
      {(project.mode === 'react' || project.mode === 'nextjs') && <p className="feedback">{c('Draft your component here, then run and check the full project in your local React or Next.js workspace. This editor does not execute framework projects.', 'Tulis draft komponen di sini, lalu jalankan dan periksa proyek lengkap di workspace React atau Next.js lokalmu. Editor ini tidak menjalankan proyek framework.')}</p>}
      {(project.mode === 'react' || project.mode === 'nextjs') && <FrameworkSetup framework={project.mode}/>}
      <Suspense fallback={<p role="status">{c('Opening workspace…', 'Membuka workspace…')}</p>}>
        {course.id === 'typescript' ? <LazyLab initialCode={project.starter} value={draft.code} onChange={code => update({ code: code.slice(0, 100000) })} title="project.ts"/> : project.mode === 'web' ? <WebLab initialCode={draft.code} value={draft.code} onChange={code => update({ code })}/> : project.mode === 'console' ? <ConsoleLab initialCode={draft.code} value={draft.code} onChange={code => update({ code })} title={course.id === 'typescript' ? 'project.ts' : 'project.js'}/> : <CodeEditor value={draft.code} onChange={code => update({ code: code.slice(0, 100000) })} label={c('Project artifact', 'Hasil proyek')} minHeight={320}/>}
      </Suspense>
      <div className="project-save-row"><span role="status" className="quiet-note">{progress.storageAvailable ? draft.updatedAt ? c('Draft and review saved in this browser.', 'Draft dan review tersimpan di browser ini.') : c('Changes are saved as you work.', 'Perubahan tersimpan saat kamu mengerjakan proyek.') : c('Session only. Download a copy to keep your work.', 'Hanya sesi ini. Unduh salinan untuk menyimpan hasilmu.')}</span><button className="text-link" onClick={download}><Download size={15}/>{c('Download a copy', 'Unduh salinan')}</button></div>
      <label className="project-notes-label" htmlFor="project-notes">{c('Your review notes', 'Catatan review-mu')}</label><p className="quiet-note">{c('What did you check, what happened, and what would you improve? Record evidence from the running project.', 'Apa yang kamu periksa, bagaimana hasilnya, dan apa yang ingin diperbaiki? Catat bukti dari proyek yang berjalan.')}</p><textarea id="project-notes" className="field project-notes" value={draft.notes} maxLength={20000} onChange={event => update({ notes: event.target.value })}/>
    </div><aside className="project-review"><h2>{c('Review your work', 'Tinjau hasilmu')}</h2><p className="muted">{c('This is a self-review, not an automated code grade. Check each item after trying it in your project.', 'Ini review mandiri, bukan penilaian kode otomatis. Centang setelah kamu mencobanya pada proyekmu.')}</p><div className="project-criteria">{project.criteria.map(criterion => <label key={criterion}><input type="checkbox" checked={draft.criteria.includes(criterion)} onChange={event => update({ criteria: event.target.checked ? [...draft.criteria, criterion] : draft.criteria.filter(item => item !== criterion) })}/><span>{criterion}</span></label>)}</div>
      {!passed && <p className="project-checkpoint-note"><Link className="text-link" to={`/learn/${course.id}/checkpoint`}>{c('Pass the checkpoint', 'Selesaikan checkpoint')}<ArrowRight size={14}/></Link><span>{c('Required before completing this stage.', 'Diperlukan untuk menyelesaikan tahap ini.')}</span></p>}
      <button className="button primary" disabled={!ready || !passed || draft.completed} onClick={() => { update({ completed: true }); setMessage(c('Project review saved. Stage completed.', 'Review proyek tersimpan. Tahap selesai.')) }}>{draft.completed ? <><CheckCircle2 size={16}/>{c('Project reviewed', 'Proyek sudah direview')}</> : c('Complete project review', 'Selesaikan review proyek')}</button>
      {!ready && <p className="quiet-note">{c('Add your artifact, review notes, and all checklist items to finish.', 'Isi hasil proyek, catatan review, dan semua kriteria untuk menyelesaikan.')}</p>}
      {message && <p role="status" className="feedback success">{message}</p>}
      {draft.completed && <div className="stage-bridge"><p>{stage.bridge}</p><Link className="text-link" to={next ? `/learn/${next.id}` : '/learn'}>{next ? `${c('Next', 'Selanjutnya')}: ${next.title}` : c('View your completed journey', 'Lihat perjalananmu')}<ArrowRight size={14}/></Link></div>}
    </aside></div>
  </div>
}

export default function ProjectPage() {
  const { courseId } = useParams()
  const stage = getStage(courseId)
  usePageTitle(stage?.project.title ?? 'Project')
  if (!stage) return <Navigate to="/learn" replace/>
  return <ProjectWorkspace key={stage.courseId} stage={stage}/>
}
