import { useEffect, useId, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { nextProjectStarter, type NextProjectState } from '../../content/project-starters'
import { useLearningCopy } from '../journey/useLearningCopy'
import './project-labs.css'

type Filter = 'all' | 'open' | 'done'

function readState(value: string): NextProjectState {
  try {
    const state = JSON.parse(value) as Partial<NextProjectState>
    if (state.version === 1 && ['dashboard', 'project', 'missing'].includes(state.route ?? '') && ['loading', 'success', 'empty', 'error'].includes(state.dataState ?? '') && Array.isArray(state.tasks)) {
      return { version: 1, route: state.route!, dataState: state.dataState!, slug: typeof state.slug === 'string' ? state.slug.slice(0, 60) : 'study-sprint', tasks: state.tasks.filter(task => task && typeof task.title === 'string').slice(0, 60).map(task => ({ id: Number.isFinite(task.id) ? task.id : Date.now(), title: task.title.slice(0, 120), done: task.done === true })) }
    }
  } catch { /* Older project text remains available in the separate review notes. */ }
  return JSON.parse(nextProjectStarter) as NextProjectState
}

export default function NextProjectLab({ initialCode, value, legacyCode, onChange }: { initialCode: string; value: string; legacyCode?: string; onChange: (value: string) => void }) {
  const c = useLearningCopy()
  const id = useId()
  const timer = useRef<number | undefined>(undefined)
  const [state, setState] = useState(() => readState(value || initialCode))
  const [newTask, setNewTask] = useState('')
  const [message, setMessage] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [narrow, setNarrow] = useState(false)

  useEffect(() => () => window.clearTimeout(timer.current), [])
  function save(next: NextProjectState) { window.clearTimeout(timer.current); timer.current = undefined; setState(next); onChange(JSON.stringify(next)) }
  function retry() {
    window.clearTimeout(timer.current)
    const loading: NextProjectState = { ...state, dataState: 'loading' }
    setState(loading)
    onChange(JSON.stringify(loading))
    timer.current = window.setTimeout(() => save({ ...loading, dataState: 'success' }), 750)
  }
  function reset() { window.clearTimeout(timer.current); const next = JSON.parse(nextProjectStarter) as NextProjectState; setMessage(''); setNewTask(''); setFilter('all'); save(next) }
  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const title = newTask.trim()
    if (!title) { setMessage(c('Add a task name first.', 'Tulis nama tugas dulu.')); return }
    const next = { ...state, dataState: 'success' as const, tasks: [...state.tasks, { id: Date.now(), title, done: false }] }
    save(next); setNewTask(''); setMessage(c('Task added to the project.', 'Tugas ditambahkan ke proyek.'))
  }
  function toggleTask(taskId: number) { save({ ...state, dataState: 'success', tasks: state.tasks.map(task => task.id === taskId ? { ...task, done: !task.done } : task) }) }
  const path = state.route === 'dashboard' ? '/dashboard' : state.route === 'project' ? `/projects/${state.slug || '[slug]'}` : '/an-unknown-route'
  const visibleTasks = state.tasks.filter(task => filter === 'all' || (filter === 'open' ? !task.done : task.done))
  const remaining = state.tasks.filter(task => !task.done).length

  return <section className="project-lab next-project-lab" aria-label={c('Next.js route and data lab', 'Lab route dan data Next.js')}>
    <div className="project-lab-heading"><div><p className="eyebrow">{c('APP ROUTER PROJECT LAB', 'LAB PROYEK APP ROUTER')}</p><h2>{c('Explore a dashboard route from end to end', 'Jelajahi route dashboard dari awal sampai akhir')}</h2><p>{c('Open routes, try every data state, and test the task controls. The files stay in Rancode while the simulator shows how the experience fits together.', 'Buka route, coba semua status data, dan gunakan kontrol tugas. File tetap di Rancode, sementara simulator memperlihatkan hubungan tiap bagiannya.')}</p></div><button type="button" className="button ghost small" onClick={reset}><RotateCcw size={14}/>{c('Reset project', 'Reset proyek')}</button></div>
    <div className="next-project-filemap"><div><p className="eyebrow">{c('A POSSIBLE APP ROUTER SHAPE', 'CONTOH STRUKTUR APP ROUTER')}</p><code>app/page.tsx</code><code>app/projects/[slug]/page.tsx</code><code>app/projects/[slug]/loading.tsx</code><code>app/projects/[slug]/error.tsx</code><code>app/projects/[slug]/not-found.tsx</code></div><p>{c('Keep route data and page structure on the server where possible. Place task state and event handlers in a focused Client Component.', 'Pertahankan data route dan struktur halaman di server jika memungkinkan. Letakkan state tugas dan event handler di Client Component yang terarah.')}</p></div>
    {legacyCode && legacyCode !== initialCode && <details className="project-legacy-draft"><summary>{c('Keep the earlier code draft', 'Simpan draf kode sebelumnya')}</summary><pre>{legacyCode}</pre></details>}
    <div className="next-lab-controls">
      <div className="next-route-controls"><div><p className="eyebrow">{c('ROUTE', 'ROUTE')}</p><div className="segmented-control" role="group" aria-label={c('Choose a route', 'Pilih route')}><button type="button" aria-pressed={state.route === 'dashboard'} onClick={() => save({ ...state, route: 'dashboard' })}>{c('Dashboard', 'Dashboard')}</button><button type="button" aria-pressed={state.route === 'project'} onClick={() => save({ ...state, route: 'project' })}>{c('Project detail', 'Detail proyek')}</button><button type="button" aria-pressed={state.route === 'missing'} onClick={() => save({ ...state, route: 'missing' })}>{c('Unknown route', 'Route tak dikenal')}</button></div></div>
        <label htmlFor={`${id}-slug`}>{c('Dynamic project slug', 'Slug proyek dinamis')}<input id={`${id}-slug`} className="field" value={state.slug} maxLength={60} onChange={event => save({ ...state, slug: event.target.value.replace(/[^a-zA-Z0-9-]/g, '').slice(0, 60) })}/></label><code className="next-current-path">{path}</code>
      </div>
      <div><p className="eyebrow">{c('DATA STATE', 'STATUS DATA')}</p><div className="segmented-control" role="group" aria-label={c('Choose a data state', 'Pilih status data')}>{(['loading', 'success', 'empty', 'error'] as const).map(dataState => <button type="button" aria-pressed={state.dataState === dataState} key={dataState} onClick={() => save({ ...state, dataState, ...(dataState === 'empty' ? { tasks: [] } : {}) })}>{c(dataState[0].toUpperCase() + dataState.slice(1), dataState === 'loading' ? 'Memuat' : dataState === 'success' ? 'Berhasil' : dataState === 'empty' ? 'Kosong' : 'Error')}</button>)}</div></div>
    </div>
    <div className="next-preview-toolbar"><span>{c('ROUTE PREVIEW', 'PRATINJAU ROUTE')} · <code>{path}</code></span><button type="button" className="text-link" aria-pressed={narrow} onClick={() => setNarrow(value => !value)}>{narrow ? c('Wide view', 'Tampilan lebar') : c('Narrow view', 'Tampilan sempit')}</button></div>
    <div className={`next-app-preview ${narrow ? 'is-narrow' : ''}`}>
      <header className="next-app-header"><span className="next-app-mark">S</span><strong>Study Sprint</strong><span className="next-app-route-name">{state.route === 'project' ? c('Project', 'Proyek') : state.route === 'missing' ? '404' : c('Dashboard', 'Dashboard')}</span></header>
      {state.route === 'missing' ? <main className="next-app-content next-not-found"><p className="eyebrow">404</p><h3>{c('This route is not here', 'Route ini tidak ditemukan')}</h3><p>{c('Check the URL or go back to the dashboard.', 'Periksa URL atau kembali ke dashboard.')}</p><button type="button" className="button secondary small" onClick={() => save({ ...state, route: 'dashboard' })}><ArrowLeft size={14}/>{c('Open dashboard', 'Buka dashboard')}</button></main> : <main className="next-app-content">
        <div className="next-app-title"><div><p className="eyebrow">{state.route === 'project' ? c('PROJECT DETAIL', 'DETAIL PROYEK') : c('YOUR LEARNING SPACE', 'RUANG BELAJARMU')}</p><h3>{state.route === 'project' ? (state.slug.split('-').map(word => word ? word[0].toUpperCase() + word.slice(1) : '').join(' ') || c('Project', 'Proyek')) : c('A good next step starts small', 'Langkah berikutnya dimulai dari hal kecil')}</h3><p>{state.route === 'project' ? c('A focused project with a clear goal and a few useful checks.', 'Proyek terarah dengan tujuan jelas dan beberapa pemeriksaan penting.') : c('Pick one task and make a little progress today.', 'Pilih satu tugas dan buat sedikit progres hari ini.')}</p></div><span className="next-app-count">{remaining} {c('open', 'terbuka')}</span></div>
        <div className="next-boundary-note"><span><strong>{c('Server Component', 'Server Component')}</strong><small>{c('Route data and page structure', 'Data route dan struktur halaman')}</small></span><ArrowRight size={14}/><span><strong>{c('Client Component', 'Client Component')}</strong><small>{c('Task state and button events', 'State tugas dan event tombol')}</small></span></div>
        <section className="next-task-panel" aria-labelledby={`${id}-tasks`}><div className="next-task-heading"><div><p className="eyebrow">{c('TODAY', 'HARI INI')}</p><h4 id={`${id}-tasks`}>{c('Study tasks', 'Tugas belajar')}</h4></div><span>{state.dataState === 'loading' ? c('Loading', 'Memuat') : state.dataState === 'error' ? c('Needs attention', 'Perlu diperiksa') : c('Local demo data', 'Data demo lokal')}</span></div>
          {state.dataState === 'loading' && <div className="next-skeleton" role="status" aria-label={c('Loading tasks', 'Memuat tugas')}><span/><span/><span/></div>}
          {state.dataState === 'error' && <div className="next-state-card is-error" role="alert"><strong>{c('We could not load these tasks.', 'Tugas belum bisa dimuat.')}</strong><p>{c('Your work is safe. Try loading the sample data again.', 'Pekerjaanmu tetap aman. Coba muat ulang data contoh.')}</p><button type="button" className="button secondary small" onClick={retry}>{c('Try again', 'Coba lagi')}</button></div>}
          {state.dataState === 'empty' && <div className="next-state-card"><strong>{c('A clear start, with room for one task.', 'Mulai dengan jelas, sisakan ruang untuk satu tugas.')}</strong><p>{c('Add a task below to turn this empty state into a useful next step.', 'Tambahkan tugas di bawah untuk mengubah kondisi kosong ini menjadi langkah berikutnya.')}</p><button type="button" className="button secondary small" onClick={() => document.getElementById(`${id}-new-task`)?.focus()}>{c('Add the first task', 'Tambah tugas pertama')}</button></div>}
          {(state.dataState === 'success' || state.dataState === 'empty') && <>
            <form className="next-task-form" onSubmit={addTask}><label className="sr-only" htmlFor={`${id}-new-task`}>{c('New task', 'Tugas baru')}</label><input id={`${id}-new-task`} className="field" value={newTask} onChange={event => setNewTask(event.target.value)} placeholder={c('Add a small next step', 'Tambahkan satu langkah kecil')}/><button className="button primary small" type="submit">{c('Add', 'Tambah')}</button></form>
            {message && <p className="quiet-note" role="status">{message}</p>}
            <div className="next-task-filters" role="group" aria-label={c('Filter tasks', 'Filter tugas')}>{(['all', 'open', 'done'] as const).map(item => <button type="button" key={item} aria-pressed={filter === item} onClick={() => setFilter(item)}>{item === 'all' ? c('All', 'Semua') : item === 'open' ? c('To do', 'Belum selesai') : c('Done', 'Selesai')}</button>)}</div>
            {visibleTasks.length ? <ul className="next-task-list">{visibleTasks.map(task => <li key={task.id} className={task.done ? 'is-done' : ''}><label><input type="checkbox" checked={task.done} onChange={() => toggleTask(task.id)}/><span>{task.title}</span></label></li>)}</ul> : <p className="quiet-note">{c('Nothing matches this filter yet.', 'Belum ada tugas yang cocok dengan filter ini.')}</p>}
          </>}
        </section>
      </main>}
      <footer className="next-app-footer"><span>{c('Preview document title', 'Judul document preview')}</span><code>{state.route === 'project' ? `${state.slug || 'project'} · Study Sprint` : state.route === 'missing' ? 'Not found · Study Sprint' : 'Dashboard · Study Sprint'}</code></footer>
    </div>
    <p className="lab-footnote">{c('This is an interactive Next.js flow simulator, not a Next.js server. It models routes, rendering boundaries, and data states in this browser; it does not compile the App Router code or make network requests.', 'Ini simulator alur Next.js interaktif, bukan server Next.js. Simulator memodelkan route, batas rendering, dan status data di browser ini; tidak mengompilasi kode App Router atau mengirim request jaringan.')}</p>
  </section>
}
