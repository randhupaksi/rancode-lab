import { lazy, Suspense, useState } from 'react'
import { ArrowRight, CheckCircle2, Download } from 'lucide-react'
import { Navigate, useParams } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import HistoryBackLink from '../components/ui/HistoryBackLink'
import { SectionLoadingSkeleton } from '../components/ui/LoadingSkeleton'
import { getCourse, getNextCourse } from '../content/runtime/catalog'
import { getStage } from '../content/runtime/catalog'
import type { JourneyStage } from '../content/runtime/catalog'
import { useProgress } from '../features/progress/ProgressProvider'
import type { ProjectDraft } from '../features/progress/ProgressProvider'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { usePageTitle } from '../hooks/usePageTitle'
import LazyLab from '../components/learning/LazyLab'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse } from '../content/runtime/localize'
import { localizeJourneyStage } from '../content/runtime/localize'
import '../features/ai-coding/ai-coding.css'
const WebLab = lazy(() => import('../components/learning/WebLab'))
const TailwindLab = lazy(() => import('../components/learning/TailwindLab'))
const ConsoleLab = lazy(() => import('../components/learning/ConsoleLab'))
const WorkspaceProjectLab = lazy(() => import('../features/projects/WorkspaceProjectLab'))
const ReactProjectLab = lazy(() => import('../features/projects/ReactProjectLab'))
const NextProjectLab = lazy(() => import('../features/projects/NextProjectLab'))
const VibeProjectLab = lazy(() => import('../features/projects/VibeProjectLab'))

function isLegacyVibeJournal(value: string) { return value.startsWith('STUDY SPRINT / BUILD JOURNAL') || value.startsWith('STUDY SPRINT / CATATAN PEMBANGUNAN') }

function downloadableProjectWork(mode: JourneyStage['project']['mode'], code: string, labState?: string) {
  const source = labState || code
  if (mode === 'workspace') {
    try {
      const parsed = JSON.parse(source) as { files?: { html?: unknown; css?: unknown; js?: unknown }; git?: { staged?: boolean; committed?: boolean; pushed?: boolean } }
      const files = parsed.files
      if (typeof files?.html === 'string' && typeof files.css === 'string' && typeof files.js === 'string') {
        const git = parsed.git
        return [
          `--- index.html ---\n${files.html}`,
          `--- styles.css ---\n${files.css}`,
          `--- app.js ---\n${files.js}`,
          `--- Git practice ---\nStaged: ${git?.staged === true}\nCommitted: ${git?.committed === true}\nPush simulated: ${git?.pushed === true}`,
        ].join('\n\n')
      }
    } catch { /* Preserve an older plain-text draft below. */ }
  }
  if (mode === 'nextjs') {
    try { return JSON.stringify(JSON.parse(source), null, 2) } catch { /* Keep the earlier draft readable. */ }
  }
  return code
}

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
  const workingCode = course.id === 'ai-coding' && isLegacyVibeJournal(draft.code) ? project.starter : draft.code
  const workArtifact = project.mode === 'workspace' || project.mode === 'nextjs' ? draft.labState ?? project.starter : workingCode
  const ready = sourceStage.project.criteria.every(criterion => draft.criteria.includes(criterion)) && Boolean(workArtifact.trim()) && Boolean(draft.notes.trim())
  const passed = progress.checkpoints[course.id]?.passed
  function update(change: Partial<ProjectDraft>) {
    const projectWorkChanged = (change.code !== undefined && change.code !== draft.code) || (change.labState !== undefined && change.labState !== draft.labState) || (change.promptDraft !== undefined && change.promptDraft !== draft.promptDraft)
    const nextDraft = { ...draft, ...(projectWorkChanged ? { criteria: [] } : {}), ...change, completed: change.completed ?? false, updatedAt: new Date().toISOString() }
    progress.saveProject(course.id, nextDraft); setSavedNotice(false)
  }
  function download() {
    const projectWork = downloadableProjectWork(project.mode, workingCode, draft.labState)
    const prompt = draft.promptDraft ? (() => { try { const parsed = JSON.parse(draft.promptDraft!); return typeof parsed.prompt === 'string' ? parsed.prompt : draft.promptDraft! } catch { return draft.promptDraft! } })() : ''
    const projectLabel = project.mode === 'workspace' ? c('PROJECT FILES', 'FILE PROYEK') : c('CODE / PROJECT WORK', 'KODE / HASIL PROYEK')
    const text = `${project.title}\n\n${project.brief}\n\n${projectLabel}\n${projectWork}${prompt ? `\n\n${c('PROMPT DRAFT', 'DRAF PROMPT')}\n${prompt}` : ''}\n\n${c('REVIEW NOTES', 'CATATAN TINJAUAN')}\n${draft.notes}\n\n${c('SELF REVIEW', 'TINJAUAN MANDIRI')}\n${project.criteria.map((item, index) => `${draft.criteria.includes(sourceStage.project.criteria[index]) ? '[x]' : '[ ]'} ${item}`).join('\n')}`
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }))
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = `rancode-lab-${course.id}-project.txt`; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  return <div className="page-width journey-page project-page">
    <HistoryBackLink fallbackTo="/learn"/>
    <header className="journey-heading"><p className="eyebrow">{course.title} / {course.id === 'nextjs' ? c('Final project lab', 'Lab proyek akhir') : c('Interactive project lab', 'Lab proyek interaktif')}</p><h1>{project.title}</h1><p className="page-lead">{project.brief}</p></header>
    <div className="project-layout"><div className="project-main"><section className="project-brief"><h2>{c('Build it in steps', 'Bangun secara bertahap')}</h2><ol>{project.steps.map(step => <li key={step}>{step}</li>)}</ol></section>
      <Suspense fallback={<SectionLoadingSkeleton variant={project.mode === 'web' || project.mode === 'tailwind' || project.mode === 'workspace' || project.mode === 'vibe' || project.mode === 'nextjs' ? 'preview' : 'code'} label={c('Opening the project tools…', 'Menyiapkan alat proyek…')}/> }>
        {course.id === 'ai-coding' ? <VibeProjectLab initialCode={project.starter} value={workingCode} onChangeCode={code => update({ code })} promptValue={draft.promptDraft} onPromptChange={promptDraft => update({ promptDraft })}/> : project.mode === 'workspace' ? <WorkspaceProjectLab initialCode={project.starter} value={draft.labState ?? project.starter} legacyDraft={draft.code === project.starter ? '' : draft.code} onChange={labState => update({ labState })}/> : project.mode === 'nextjs' ? <NextProjectLab initialCode={project.starter} value={draft.labState ?? project.starter} legacyCode={draft.code === project.starter ? '' : draft.code} onChange={labState => update({ labState })}/> : project.mode === 'react' ? <ReactProjectLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })}/> : course.id === 'typescript' ? <LazyLab initialCode={project.starter} value={draft.code} onChange={code => update({ code: code.slice(0, 100000) })} title="project.ts"/> : project.mode === 'tailwind' ? <TailwindLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })}/> : project.mode === 'web' ? <WebLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })}/> : <ConsoleLab initialCode={project.starter} value={draft.code} onChange={code => update({ code })} title="project.js"/>}
      </Suspense>
      <div className="project-save-row"><span role="status" className="quiet-note">{progress.storageAvailable ? draft.updatedAt ? c('Draft and review saved in this browser.', 'Draf dan tinjauan tersimpan di browser ini.') : c('Changes are saved as you work.', 'Perubahanmu tersimpan otomatis.') : c('Session only. Download a copy to keep your work.', 'Tersimpan selama sesi ini saja. Unduh salinannya agar pekerjaanmu tetap aman.')}</span><button className="text-link" onClick={download}><Download size={15}/>{c('Download a copy', 'Unduh salinan')}</button></div>
      <label className="project-notes-label" htmlFor="project-notes">{c('Your review notes', 'Catatan tinjauanmu')}</label><p className="quiet-note">{c('What did you check? What happened? What would you improve? Note what you observed in the running project.', 'Apa yang kamu periksa? Apa hasilnya? Apa yang ingin kamu perbaiki? Catat hal yang kamu amati saat proyek dijalankan.')}</p><textarea id="project-notes" className="field project-notes" value={draft.notes} maxLength={20000} onChange={event => update({ notes: event.target.value })}/>
    </div><aside className="project-review"><h2>{c('Review your work', 'Tinjau hasil proyekmu')}</h2><p className="muted">{c('This is a self-review, not an automatic code grade. Check each item after you try it in your project.', 'Kamu meninjau hasilmu sendiri; kode tidak dinilai otomatis. Centang tiap poin setelah mencobanya di proyek.')}</p><div className="project-criteria">{project.criteria.map((criterion, index) => { const criterionKey = sourceStage.project.criteria[index]; return <label key={criterionKey}><input type="checkbox" checked={draft.criteria.includes(criterionKey)} onChange={event => update({ criteria: event.target.checked ? [...draft.criteria, criterionKey] : draft.criteria.filter(item => item !== criterionKey) })}/><span>{criterion}</span></label>})}</div>
      {!passed && <p className="project-checkpoint-note"><TextLink to={`/learn/${course.id}/checkpoint`}>{c('Pass the knowledge check', 'Selesaikan cek pemahaman')}<ArrowRight size={14}/></TextLink><span>{c('Complete this before finishing the stage.', 'Selesaikan cek ini sebelum menuntaskan tahap belajar.')}</span></p>}
      <button className="button primary" disabled={!ready || !passed || draft.completed} onClick={() => { update({ completed: true }); setSavedNotice(true) }}>{draft.completed ? <><CheckCircle2 size={16}/>{c('Project reviewed', 'Proyek sudah ditinjau')}</> : c('Finish project review', 'Tuntaskan tinjauan proyek')}</button>
      {!ready && <p className="quiet-note">{c('Add your project work and notes, then check every item to finish.', 'Tambahkan hasil proyek dan catatanmu, lalu centang semua poin untuk menyelesaikan tahap ini.')}</p>}
      {savedNotice && <p role="status" className="feedback success">{c('Project review saved. Stage complete.', 'Tinjauan proyek tersimpan. Tahap ini selesai.')}</p>}
      {draft.completed && <div className="stage-bridge"><p>{stage.bridge}</p>{localizedNext && next ? <TextLink to={`/learn/${next.id}`}>{c('Next', 'Berikutnya')}: {localizedNext.title}<ArrowRight size={14}/></TextLink> : course.path === 'companion' ? <HistoryBackLink fallbackTo="/learn"/> : <TextLink to="/learn">{c('View your completed journey', 'Lihat perjalananmu')}<ArrowRight size={14}/></TextLink>}</div>}
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
