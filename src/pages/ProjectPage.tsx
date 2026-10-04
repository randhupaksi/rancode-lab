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
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/localize'
import { localizeJourneyStage } from '../content/journey-localize'
const WebLab = lazy(() => import('../components/learning/WebLab'))
const ConsoleLab = lazy(() => import('../components/learning/ConsoleLab'))
const CodeEditor = lazy(() => import('../features/editor/CodeEditor'))

function ProjectWorkspace({ stage, sourceStage }: { stage: JourneyStage; sourceStage: JourneyStage }) {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const progress = useProgress()
  const project = stage.project
  const draft: ProjectDraft = progress.projects[stage.courseId] ?? { code: project.starter, notes: '', criteria: [], completed: false, updatedAt: '' }
  const [savedNotice, setSavedNotice] = useState(false)
  const course = localizeCourse(getCourse(stage.courseId)!, locale)
  const next = getNextCourse(course.id)
  const localizedNext = next ? localizeCourse(next, locale) : undefined
  const ready = sourceStage.project.criteria.every(criterion => draft.criteria.includes(criterion)) && Boolean(draft.code.trim()) && Boolean(draft.notes.trim())
  const passed = progress.checkpoints[course.id]?.passed
  function update(change: Partial<ProjectDraft>) {
    const nextDraft = { ...draft, ...(change.code !== undefined && change.code !== draft.code ? { criteria: [] } : {}), ...change, completed: change.completed ?? false, updatedAt: new Date().toISOString() }
    progress.saveProject(course.id, nextDraft); setSavedNotice(false)
  }
  function download() {
    const text = `${project.title}\n\n${project.brief}\n\n${c('CODE / PROJECT WORK', 'KODE / HASIL PROYEK')}\n${draft.code}\n\n${c('REVIEW NOTES', 'CATATAN TINJAUAN')}\n${draft.notes}\n\n${c('SELF REVIEW', 'TINJAUAN MANDIRI')}\n${project.criteria.map((item, index) => `${draft.criteria.includes(sourceStage.project.criteria[index]) ? '[x]' : '[ ]'} ${item}`).join('\n')}`
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `undercode-${course.id}-project.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="page-width journey-page project-page">
    <Link className="text-link" to="/learn"><ArrowLeft size={14}/>{c('My learning path', 'Jalur belajarku')}</Link>
    <header className="journey-heading"><p className="eyebrow">{course.title} / {course.id === 'nextjs' ? c('Final project', 'Proyek akhir') : c('Stage project', 'Proyek tahap ini')}</p><h1>{project.title}</h1><p className="page-lead">{project.brief}</p></header>
    <div className="project-layout"><div className="project-main"><section className="project-brief"><h2>{c('Build it in steps', 'Bangun secara bertahap')}</h2><ol>{project.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
      {(project.mode === 'react' || project.mode === 'nextjs') && <p className="feedback">{c('Draft your component here. Run and check the complete app in your local React or Next.js workspace; this editor does not run framework projects.', 'Tulis draf komponenmu di sini. Jalankan dan periksa aplikasi React atau Next.js secara lengkap di ruang kerja lokal; editor ini tidak menjalankan proyek framework.')}</p>}
      {(project.mode === 'react' || project.mode === 'nextjs') && <FrameworkSetup framework={project.mode}/>}
      <Suspense fallback={<p role="status">{c('Opening the project tools…', 'Menyiapkan alat proyek…')}</p>}>
        {course.id === 'typescript' ? <LazyLab initialCode={project.starter} value={draft.code} onChange={code => update({ code: code.slice(0, 100000) })} title="project.ts"/> : project.mode === 'web' ? <WebLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })}/> : project.mode === 'console' ? <ConsoleLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })} title={course.id === 'typescript' ? 'project.ts' : 'project.js'}/> : <CodeEditor value={draft.code} onChange={code => update({ code: code.slice(0, 100000) })} label={c('Project artifact', 'Hasil proyek')} minHeight={320}/>}
      </Suspense>
      <div className="project-save-row"><span role="status" className="quiet-note">{progress.storageAvailable ? draft.updatedAt ? c('Draft and review saved in this browser.', 'Draf dan tinjauan tersimpan di browser ini.') : c('Changes are saved as you work.', 'Perubahanmu tersimpan otomatis.') : c('Session only. Download a copy to keep your work.', 'Tersimpan selama sesi ini saja. Unduh salinannya agar pekerjaanmu tetap aman.')}</span><button className="text-link" onClick={download}><Download size={15}/>{c('Download a copy', 'Unduh salinan')}</button></div>
      <label className="project-notes-label" htmlFor="project-notes">{c('Your review notes', 'Catatan tinjauanmu')}</label><p className="quiet-note">{c('What did you check? What happened? What would you improve? Note what you observed in the running project.', 'Apa yang kamu periksa? Apa hasilnya? Apa yang ingin kamu perbaiki? Catat hal yang kamu amati saat proyek dijalankan.')}</p><textarea id="project-notes" className="field project-notes" value={draft.notes} maxLength={20000} onChange={event => update({ notes: event.target.value })}/>
    </div><aside className="project-review"><h2>{c('Review your work', 'Tinjau hasil proyekmu')}</h2><p className="muted">{c('This is a self-review, not an automatic code grade. Check each item after you try it in your project.', 'Kamu meninjau hasilmu sendiri; kode tidak dinilai otomatis. Centang tiap poin setelah mencobanya di proyek.')}</p><div className="project-criteria">{project.criteria.map((criterion, index) => { const criterionKey = sourceStage.project.criteria[index]; return <label key={criterionKey}><input type="checkbox" checked={draft.criteria.includes(criterionKey)} onChange={event => update({ criteria: event.target.checked ? [...draft.criteria, criterionKey] : draft.criteria.filter(item => item !== criterionKey) })}/><span>{criterion}</span></label>})}</div>
      {!passed && <p className="project-checkpoint-note"><Link className="text-link" to={`/learn/${course.id}/checkpoint`}>{c('Pass the knowledge check', 'Selesaikan cek pemahaman')}<ArrowRight size={14}/></Link><span>{c('Complete this before finishing the stage.', 'Selesaikan cek ini sebelum menuntaskan tahap belajar.')}</span></p>}
      <button className="button primary" disabled={!ready || !passed || draft.completed} onClick={() => { update({ completed: true }); setSavedNotice(true) }}>{draft.completed ? <><CheckCircle2 size={16}/>{c('Project reviewed', 'Proyek sudah ditinjau')}</> : c('Finish project review', 'Tuntaskan tinjauan proyek')}</button>
      {!ready && <p className="quiet-note">{c('Add your project work and notes, then check every item to finish.', 'Tambahkan hasil proyek dan catatanmu, lalu centang semua poin untuk menyelesaikan tahap ini.')}</p>}
      {savedNotice && <p role="status" className="feedback success">{c('Project review saved. Stage complete.', 'Tinjauan proyek tersimpan. Tahap ini selesai.')}</p>}
      {draft.completed && <div className="stage-bridge"><p>{stage.bridge}</p><Link className="text-link" to={next ? `/learn/${next.id}` : '/learn'}>{localizedNext ? `${c('Next', 'Berikutnya')}: ${localizedNext.title}` : c('View your completed journey', 'Lihat perjalananmu')}<ArrowRight size={14}/></Link></div>}
    </aside></div>
  </div>
}

export default function ProjectPage() {
  const { courseId } = useParams()
  const { locale } = useLocale()
  const sourceStage = getStage(courseId)
  const stage = sourceStage ? localizeJourneyStage(sourceStage, locale) : undefined
  usePageTitle(stage ? `${stage.project.title} · ${locale === 'id' ? 'Proyek' : 'Project'}` : locale === 'id' ? 'Proyek tidak ditemukan' : 'Project not found')
  if (!stage) return <Navigate to="/learn" replace/>
  return <ProjectWorkspace key={stage.courseId} stage={stage} sourceStage={sourceStage!}/>
}
