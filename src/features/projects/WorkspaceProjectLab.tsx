import { useEffect, useMemo, useState } from 'react'
import { GitBranch, Network, RotateCcw, Search } from 'lucide-react'
import { starterWorkspaceFiles, type WorkspaceProjectFiles, type WorkspaceProjectState } from '../../content/project-starters'
import { useLearningCopy } from '../journey/useLearningCopy'
import { WebPreview } from '../../components/learning/WebLab'
import './project-labs.css'

type FileKey = keyof WorkspaceProjectFiles
type Tool = 'elements' | 'network' | 'git'
const fileNames: Record<FileKey, string> = { html: 'index.html', css: 'styles.css', js: 'app.js' }

function readProjectState(value: string): { state: WorkspaceProjectState; legacy: string } {
  try {
    const parsed = JSON.parse(value) as Partial<WorkspaceProjectState>
    if (parsed.version === 1 && parsed.files && typeof parsed.files.html === 'string' && typeof parsed.files.css === 'string' && typeof parsed.files.js === 'string') {
      return { state: { version: 1, files: { html: parsed.files.html.slice(0, 25000), css: parsed.files.css.slice(0, 25000), js: parsed.files.js.slice(0, 25000) }, git: { staged: parsed.git?.staged === true, committed: parsed.git?.committed === true, pushed: parsed.git?.pushed === true } }, legacy: '' }
    }
  } catch { /* A pre-lab text draft is retained below. */ }
  return { state: { version: 1, files: { ...starterWorkspaceFiles }, git: { staged: false, committed: false, pushed: false } }, legacy: value === JSON.stringify(starterWorkspaceFiles) ? '' : value }
}

function composePreview(files: WorkspaceProjectFiles) { return `<style>${files.css}</style>${files.html}<script>${files.js}</script>` }

export default function WorkspaceProjectLab({ initialCode, value, legacyDraft, onChange }: { initialCode: string; value: string; legacyDraft?: string; onChange: (value: string) => void }) {
  const c = useLearningCopy()
  const [loaded] = useState(() => readProjectState(value || initialCode))
  const [project, setProject] = useState(loaded.state)
  const [legacy, setLegacy] = useState(legacyDraft || loaded.legacy)
  const [file, setFile] = useState<FileKey>('html')
  const [tool, setTool] = useState<Tool>('elements')
  const [selection, setSelection] = useState('')
  const [narrow, setNarrow] = useState(false)
  const source = project.files[file]
  const document = useMemo(() => new DOMParser().parseFromString(project.files.html, 'text/html'), [project.files.html])
  const elements = useMemo(() => [...document.body.querySelectorAll('*')].slice(0, 40), [document])
  const preview = useMemo(() => composePreview(project.files), [project.files])
  const [livePreview, setLivePreview] = useState(() => composePreview(loaded.state.files))

  useEffect(() => {
    if (preview === livePreview) return
    const timeout = window.setTimeout(() => setLivePreview(preview), 400)
    return () => window.clearTimeout(timeout)
  }, [preview, livePreview])

  function save(next: WorkspaceProjectState, preservedLegacy = legacy) {
    setProject(next)
    onChange(JSON.stringify(next).slice(0, 100000))
    if (!preservedLegacy) setLegacy('')
  }
  function editFile(next: string) {
    save({ ...project, files: { ...project.files, [file]: next.slice(0, 25000) }, git: { staged: false, committed: false, pushed: false } }, '')
  }
  function updateGit(change: Partial<WorkspaceProjectState['git']>) { save({ ...project, git: { ...project.git, ...change } }) }
  function reset() { setLegacy(''); save({ version: 1, files: { ...starterWorkspaceFiles }, git: { staged: false, committed: false, pushed: false } }, '') }
  const toolTabs: { id: Tool; label: string; icon: typeof Search }[] = [
    { id: 'elements', label: c('Elements', 'Elemen'), icon: Search },
    { id: 'network', label: c('Network', 'Jaringan'), icon: Network },
    { id: 'git', label: c('Git flow', 'Alur Git'), icon: GitBranch },
  ]

  return <section className="project-lab foundation-lab" aria-label={c('Web workspace lab', 'Lab ruang kerja web')}>
    <div className="project-lab-heading"><div><p className="eyebrow">{c('WORKSPACE LAB', 'LAB RUANG KERJA')}</p><h2>{c('Build, inspect, and save a small page', 'Buat, periksa, dan simpan halaman kecil')}</h2><p>{c('Edit the three files and watch your page update. Then explore the browser and Git workflow here.', 'Edit tiga file lalu lihat halamanmu berubah. Setelah itu, pelajari alur browser dan Git di sini.')}</p></div><button type="button" className="button ghost small" onClick={reset}><RotateCcw size={14}/>{c('Reset files', 'Reset file')}</button></div>
    {legacy && <details className="project-legacy-draft"><summary>{c('Keep notes from your earlier draft', 'Simpan catatan dari draf sebelumnya')}</summary><pre>{legacy}</pre><button type="button" className="text-link" onClick={() => { setLegacy(''); onChange(JSON.stringify(project)) }}>{c('Dismiss old draft', 'Tutup draf lama')}</button></details>}
    <div className="foundation-files">
      <div className="foundation-editor"><div className="project-file-tabs" role="group" aria-label={c('Project files', 'File proyek')}>{(Object.keys(fileNames) as FileKey[]).map(key => <button type="button" key={key} aria-pressed={file === key} onClick={() => setFile(key)}>{fileNames[key]}</button>)}</div><label className="sr-only" htmlFor="workspace-source">{c('Project file editor', 'Editor file proyek')} · {fileNames[file]}</label><textarea id="workspace-source" className="project-file-editor" value={source} onChange={event => editFile(event.target.value)} spellCheck={false} translate="no" autoCapitalize="off" maxLength={25000}/></div>
      <div className="foundation-preview"><div className="project-preview-bar"><span>{c('LIVE PAGE', 'HALAMAN LANGSUNG')}</span><span role="status" className="quiet-note">{preview === livePreview ? c('Preview updates automatically', 'Preview diperbarui otomatis') : c('Preview updates after a short pause', 'Preview diperbarui setelah jeda singkat')}</span><button type="button" className="text-link" aria-pressed={narrow} onClick={() => setNarrow(current => !current)}>{narrow ? c('Wide view', 'Tampilan lebar') : c('Narrow view', 'Tampilan sempit')}</button></div><WebPreview code={livePreview} title={c('Workspace page preview', 'Pratinjau halaman ruang kerja')} narrow={narrow}/></div>
    </div>
    <div className="project-tools"><div className="project-tool-tabs" role="group" aria-label={c('Project tools', 'Alat proyek')}>{toolTabs.map(({ id, label, icon: Icon }) => <button type="button" aria-pressed={tool === id} key={id} onClick={() => setTool(id)}><Icon size={14}/>{label}</button>)}</div><div className="project-tool-panel" role="region" aria-label={toolTabs.find(tab => tab.id === tool)?.label}>
      {tool === 'elements' && <div className="inspector-simulator"><div><p className="eyebrow">{c('DOM TREE · FROM YOUR HTML FILE', 'POHON DOM · DARI FILE HTML-MU')}</p><p className="quiet-note">{c('Select an element to inspect its tag and text.', 'Pilih elemen untuk melihat tag dan teksnya.')}</p><ul className="inspector-tree">{elements.length ? elements.map((element, index) => { const summary = `<${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ''}>`; return <li key={`${summary}-${index}`}><button type="button" className={selection === summary ? 'selected' : ''} onClick={() => setSelection(summary)}><code>{summary}</code><span>{element.textContent?.trim().replace(/\s+/g, ' ').slice(0, 56) || c('No text', 'Tanpa teks')}</span></button></li> }) : <li className="quiet-note">{c('Add an element in index.html to see it here.', 'Tambahkan elemen di index.html agar muncul di sini.')}</li>}</ul></div><div className="inspector-detail"><p className="eyebrow">{c('SELECTED ELEMENT', 'ELEMEN TERPILIH')}</p><code>{selection || c('Choose an element', 'Pilih elemen')}</code><p>{selection ? c('This local inspector reads your HTML. It does not inspect other websites.', 'Pemeriksa lokal ini membaca HTML-mu. Alat ini tidak memeriksa website lain.') : c('Choose a row to inspect its page structure.', 'Pilih baris untuk melihat struktur halamannya.')}</p></div></div>}
      {tool === 'network' && <div className="network-simulator"><div><p className="eyebrow">{c('LOCAL PREVIEW REQUESTS', 'REQUEST PREVIEW LOKAL')}</p><p className="quiet-note">{c('A teaching model: these rows represent your local files. The preview sends no HTTP requests.', 'Model pembelajaran: baris ini mewakili file lokalmu. Preview tidak mengirim request HTTP.')}</p></div><div className="network-table" role="table" aria-label={c('Simulated network requests', 'Simulasi request jaringan')}><div role="row"><strong>{c('File', 'File')}</strong><strong>{c('Type', 'Jenis')}</strong><strong>{c('Status', 'Status')}</strong></div>{(['html', 'css', 'js'] as const).map(key => <div role="row" key={key}><code>{fileNames[key]}</code><span>{key === 'html' ? 'document' : key === 'css' ? 'stylesheet' : 'script'}</span><span className="status-pill">200 · {c('local', 'lokal')}</span></div>)}</div></div>}
      {tool === 'git' && <div className="git-simulator"><div><p className="eyebrow">{c('LOCAL VERSION-CONTROL PRACTICE', 'LATIHAN VERSION CONTROL LOKAL')}</p><p>{c('Move through the steps to see what staging, committing, and pushing mean. This simulation never connects to GitHub or changes your repository.', 'Ikuti langkahnya untuk memahami staging, commit, dan push. Simulasi ini tidak terhubung ke GitHub dan tidak mengubah repository-mu.')}</p></div><ol className="git-flow-steps">{[[c('Edit files', 'Edit file'), true], [c('Stage changes', 'Stage perubahan'), project.git.staged], [c('Commit locally', 'Commit lokal'), project.git.committed], [c('Push to remote', 'Push ke remote'), project.git.pushed]].map(([label, done], index) => <li key={String(label)} className={done ? 'is-complete' : ''}><span>{index + 1}</span><div><strong>{label}</strong><small>{[c('Your working copy', 'Salinan kerja'), c('Choose what belongs in this snapshot', 'Pilih perubahan untuk snapshot ini'), c('Save the snapshot in local history', 'Simpan snapshot di riwayat lokal'), c('Send committed history to a remote', 'Kirim riwayat commit ke remote')][index]}</small></div></li>)}</ol><div className="git-simulator-actions">{!project.git.staged && <button type="button" className="button secondary small" onClick={() => updateGit({ staged: true, committed: false, pushed: false })}>{c('Stage these changes', 'Stage perubahan ini')}</button>}{project.git.staged && !project.git.committed && <button type="button" className="button secondary small" onClick={() => updateGit({ committed: true, pushed: false })}>{c('Create local commit', 'Buat commit lokal')}</button>}{project.git.committed && !project.git.pushed && <button type="button" className="button secondary small" onClick={() => updateGit({ pushed: true })}>{c('Simulate push', 'Simulasikan push')}</button>}{project.git.pushed && <p role="status" className="feedback success">{c('Done. The remote has the committed snapshot in this simulation.', 'Selesai. Dalam simulasi ini, remote memiliki snapshot yang sudah di-commit.')}</p>}{(project.git.staged || project.git.committed || project.git.pushed) && <button type="button" className="text-link" onClick={() => updateGit({ staged: false, committed: false, pushed: false })}>{c('Start the flow again', 'Ulangi alur')}</button>}</div></div>}
    </div></div>
  </section>
}
