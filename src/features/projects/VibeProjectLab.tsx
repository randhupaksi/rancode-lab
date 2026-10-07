import { useEffect, useId, useState } from 'react'
import { Copy, RotateCcw } from 'lucide-react'
import { copyText } from '../../lib/clipboard'
import WebLab from '../../components/learning/WebLab'
import { useLearningCopy } from '../journey/useLearningCopy'
import { useLocale } from '../locale/LocaleProvider'
import './project-labs.css'

interface PromptPlan { user: string; outcome: string; scope: string; visual: string; checks: string }
interface PromptDraft { version: 1; plan: PromptPlan; prompt: string; previousJournal: string }

function starterPlan(locale: 'en' | 'id'): PromptPlan {
  return locale === 'id'
    ? { user: 'Pelajar yang ingin menyelesaikan satu hal saat jeda singkat.', outcome: 'Membantu pengguna memilih satu tugas belajar dan melihat progresnya.', scope: 'Tambah tugas, tandai selesai, filter tugas, dan tampilkan kondisi kosong.', visual: 'Ruang belajar yang tenang, rapi, dan terasa ringan.', checks: 'Keyboard, input kosong, judul panjang, daftar kosong, layar sempit, dan hasil build.' }
    : { user: 'A learner choosing one useful task during a short study break.', outcome: 'Help them pick one study task and see their progress.', scope: 'Add tasks, mark them done, filter the list, and show an empty state.', visual: 'A calm, tidy study space that feels light and focused.', checks: 'Keyboard use, blank input, long titles, an empty list, a narrow screen, and the production build.' }
}

function starterPrompt(plan: PromptPlan, locale: 'en' | 'id') {
  if (locale === 'id') return `Bantu bangun aplikasi Study Sprint di workspace proyek ini. Mulai dengan memeriksa struktur file dan tools yang sudah ada.\n\nPengguna dan momen: ${plan.user}\nTujuan utama: ${plan.outcome}\nCakupan versi pertama: ${plan.scope}\nArah visual: ${plan.visual}\n\nKerjakan dalam beberapa perubahan kecil. Pertahankan pola dan dependency yang sudah dipakai proyek. Jangan menambah fitur atau dependency tanpa alasan yang jelas.\n\nPastikan tiap kontrol benar-benar bekerja, teks pengguna ditampilkan dengan aman, feedback mudah dipahami, fokus keyboard terlihat, dan layout tetap nyaman di layar sempit. Hindari placeholder, lorem ipsum, dan kontrol yang hanya terlihat bisa dipakai.\n\nPeriksa hasil dengan: ${plan.checks}\n\nSetelah selesai, ringkas file yang berubah, pemeriksaan yang benar-benar dijalankan, hasilnya, serta batas yang masih ada. Jangan mengklaim pemeriksaan yang belum dilakukan.`
  return `Build a Study Sprint app in this project workspace. First inspect the existing files and tools.\n\nUser and moment: ${plan.user}\nMain outcome: ${plan.outcome}\nFirst-version scope: ${plan.scope}\nVisual direction: ${plan.visual}\n\nWork in a few small changes. Follow the project's existing patterns and dependencies. Do not add features or dependencies without a clear reason.\n\nMake every control work, render user text safely, give clear feedback, keep keyboard focus visible, and make the layout comfortable on narrow screens. Avoid placeholders, lorem ipsum, and controls that only look interactive.\n\nCheck: ${plan.checks}\n\nWhen done, summarize the changed files, checks actually run and their results, and any remaining limits. Do not claim a check that was not run.`
}

function readPromptDraft(value: string | undefined, locale: 'en' | 'id'): PromptDraft {
  const plan = starterPlan(locale)
  try {
    const parsed = JSON.parse(value ?? '') as Partial<PromptDraft>
    if (parsed.version === 1 && parsed.plan && typeof parsed.prompt === 'string') return { version: 1, plan: { ...plan, ...parsed.plan }, prompt: parsed.prompt.slice(0, 20000), previousJournal: typeof parsed.previousJournal === 'string' ? parsed.previousJournal.slice(0, 20000) : '' }
  } catch { /* Plain text from the earlier build journal is preserved below. */ }
  return { version: 1, plan, prompt: starterPrompt(plan, locale), previousJournal: value && !value.startsWith('{') ? value.slice(0, 20000) : '' }
}

function isRunnableDraft(value: string) { return /<(?:main|div|section|article)\b/i.test(value) && /<\/?(?:script|h1|form)\b/i.test(value) }

export default function VibeProjectLab({ initialCode, value, onChangeCode, promptValue, onPromptChange }: { initialCode: string; value: string; onChangeCode: (value: string) => void; promptValue?: string; onPromptChange: (value: string) => void }) {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const id = useId()
  const [saved] = useState(() => readPromptDraft(promptValue, locale))
  const [draft, setDraft] = useState(saved)
  const [code, setCode] = useState(() => isRunnableDraft(value) ? value : initialCode)
  const [notice, setNotice] = useState('')
  const hasLegacy = Boolean(saved.previousJournal || (value && !isRunnableDraft(value)))

  useEffect(() => {
    if (!promptValue) onPromptChange(JSON.stringify(draft))
  // Save the starter prompt and preserve any earlier journal once.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function savePrompt(next: PromptDraft) { setDraft(next); onPromptChange(JSON.stringify(next)); setNotice('') }
  function updatePlan(key: keyof PromptPlan, nextValue: string) { savePrompt({ ...draft, plan: { ...draft.plan, [key]: nextValue }, prompt: starterPrompt({ ...draft.plan, [key]: nextValue }, locale) }) }
  async function copyPrompt() {
    setNotice(await copyText(draft.prompt) ? c('Prompt copied. Paste it into the AI coding agent you choose.', 'Prompt tersalin. Tempelkan ke AI coding agent pilihanmu.') : c('Select the prompt and copy it manually.', 'Pilih prompt lalu salin secara manual.'))
  }
  function resetPrompt() { const plan = starterPlan(locale); savePrompt({ version: 1, plan, prompt: starterPrompt(plan, locale), previousJournal: draft.previousJournal }) }

  return <section className="project-lab vibe-project-lab" aria-label={c('Vibe coding project lab', 'Lab proyek vibe coding')}>
    <div className="project-lab-heading"><div><p className="eyebrow">{c('VIBE CODING WORKSPACE', 'RUANG KERJA VIBE CODING')}</p><h2>{c('Shape the brief, then build and review the app', 'Susun brief, lalu bangun dan tinjau aplikasinya')}</h2><p>{c('Use this prompt with an AI coding agent you choose. The app preview below runs in Rancode, so you can check real interactions here.', 'Pakai prompt ini dengan AI coding agent pilihanmu. Preview aplikasi di bawah berjalan di Rancode, jadi kamu bisa memeriksa interaksinya di sini.')}</p></div></div>
    {hasLegacy && <details className="project-legacy-draft"><summary>{c('Your earlier build journal is kept here', 'Jurnal pembangunanmu sebelumnya tetap tersimpan di sini')}</summary><pre>{draft.previousJournal || value}</pre></details>}
    <div className="vibe-prompt-builder">
      <div className="vibe-prompt-heading"><div><p className="eyebrow">{c('PROMPT BRIEF', 'BRIEF PROMPT')}</p><h3>{c('Give the agent useful context', 'Beri agent konteks yang cukup')}</h3></div><button type="button" className="text-link" onClick={resetPrompt}><RotateCcw size={13}/>{c('Reset brief', 'Reset brief')}</button></div>
      <div className="vibe-brief-grid">
        <label htmlFor={`${id}-user`}>{c('Who is it for, and when?', 'Untuk siapa, dan kapan dipakai?')}<textarea id={`${id}-user`} className="field" value={draft.plan.user} onChange={event => updatePlan('user', event.target.value)} maxLength={500}/></label>
        <label htmlFor={`${id}-outcome`}>{c('What should it help them do?', 'Apa yang perlu dibantu?')}<textarea id={`${id}-outcome`} className="field" value={draft.plan.outcome} onChange={event => updatePlan('outcome', event.target.value)} maxLength={500}/></label>
        <label htmlFor={`${id}-scope`}>{c('What belongs in the first version?', 'Apa yang masuk versi pertama?')}<textarea id={`${id}-scope`} className="field" value={draft.plan.scope} onChange={event => updatePlan('scope', event.target.value)} maxLength={800}/></label>
        <label htmlFor={`${id}-visual`}>{c('What should the interface feel like?', 'Seperti apa rasa tampilannya?')}<textarea id={`${id}-visual`} className="field" value={draft.plan.visual} onChange={event => updatePlan('visual', event.target.value)} maxLength={500}/></label>
        <label htmlFor={`${id}-checks`} className="vibe-brief-wide">{c('What will you check before calling it done?', 'Apa yang akan diperiksa sebelum dianggap selesai?')}<textarea id={`${id}-checks`} className="field" value={draft.plan.checks} onChange={event => updatePlan('checks', event.target.value)} maxLength={800}/></label>
      </div>
      <label htmlFor={`${id}-prompt`} className="vibe-final-prompt-label">{c('Prompt to take to your AI coding agent', 'Prompt untuk dibawa ke AI coding agent')}</label>
      <textarea id={`${id}-prompt`} className="field vibe-final-prompt" value={draft.prompt} onChange={event => savePrompt({ ...draft, prompt: event.target.value.slice(0, 20000) })} maxLength={20000} spellCheck/>
      <div className="vibe-prompt-actions"><p className="quiet-note">{c('The prompt stays in this browser. Rancode does not send it to an AI agent.', 'Prompt tersimpan di browser ini. Rancode tidak mengirimnya ke AI agent.')}</p><div><span role="status" className="quiet-note">{notice}</span><button type="button" className="button secondary small" onClick={() => void copyPrompt()} disabled={!draft.prompt.trim()}><Copy size={14}/>{c('Copy prompt', 'Salin prompt')}</button></div></div>
    </div>
    <div className="vibe-build-heading"><div><p className="eyebrow">{c('BUILD AND CHECK', 'BANGUN DAN PERIKSA')}</p><h3>{c('Make the first version work', 'Pastikan versi pertamanya berfungsi')}</h3></div><p>{c('Edit the starter app, then try the task flow, empty input, and keyboard controls in its live preview.', 'Edit aplikasi awal, lalu coba alur tugas, input kosong, dan kontrol keyboard melalui preview langsung.')}</p></div>
    <WebLab initialCode={initialCode} value={code} onChange={next => { setCode(next); onChangeCode(next) }} title="study-sprint.html" footnote={c('The app runs in an isolated browser preview. Network requests and form submissions are blocked; the AI coding agent is not connected to this page.', 'Aplikasi berjalan di preview browser terisolasi. Request jaringan dan pengiriman form diblokir; AI coding agent tidak terhubung ke halaman ini.')}/>
  </section>
}
