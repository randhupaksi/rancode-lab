import { useEffect, useId, useRef, useState } from 'react'
import { CheckCircle2, ChevronDown, Lightbulb, RotateCcw } from 'lucide-react'
import type { Challenge } from '../../content/types'
import CodeBlock from '../../components/ui/CodeBlock'
import CodeEditor from '../editor/CodeEditor'
import { gradeFixChallenge } from './gradeFixChallenge'
import { useProgress } from '../progress/ProgressProvider'
import { useLocale } from '../locale/LocaleProvider'
import { useLearningCopy } from '../journey/useLearningCopy'
import '../../styles/reference.css'

interface Props { challenge: Challenge; onComplete?: () => void }
interface Feedback { success: boolean; message: string }

export default function ChallengeBlock({ challenge, onComplete }: Props) {
  return <ChallengeAttempt key={challenge.id} challenge={challenge} onComplete={onComplete} />
}

function ChallengeAttempt({ challenge, onComplete }: Props) {
  const inputId = useId()
  const { completeChallenge } = useProgress()
  const { locale, t } = useLocale()
  const c = useLearningCopy()
  const [answer, setAnswer] = useState('')
  const [code, setCode] = useState(challenge.code)
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [attempted, setAttempted] = useState(false)
  const [hintOpen, setHintOpen] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [checking, setChecking] = useState(false)
  const request = useRef(0)
  useEffect(() => () => { request.current++ }, [])

  function editAnswer(value: string) { request.current++; setAnswer(value); setFeedback(null); setChecking(false) }
  function editCode(value: string) { request.current++; setCode(value); setFeedback(null); setChecking(false) }
  function reset() {
    request.current++
    setCode(challenge.code)
    setAnswer('')
    setFeedback(null)
    setAttempted(false)
    setHintOpen(false)
    setSolutionOpen(false)
    setChecking(false)
  }

  async function checkAnswer() {
    const current = ++request.current
    setAttempted(true)
    setChecking(true)
    setFeedback(null)
    let success = false
    let message = ''
    try {
      if (challenge.kind === 'fix') {
        const result = await gradeFixChallenge(challenge, code)
        success = result.success
        message = result.message
      } else {
        success = [challenge.answer, ...(challenge.acceptedAnswers ?? [])].some((expected) => answer.trim() === expected.trim())
        message = success ? challenge.explanation : c('Not quite. Follow the example one step at a time. Open a hint if you need a nudge.', 'Belum tepat. Ikuti contohnya selangkah demi selangkah. Buka petunjuk jika kamu membutuhkannya.')
      }
      if (current !== request.current) return
      setFeedback({ success, message })
      if (success) { completeChallenge(challenge.id); onComplete?.() }
    } catch {
      if (current === request.current) setFeedback({ success: false, message: c('The TypeScript checker could not finish. Your code is still here. Try checking again.', 'Pemeriksa TypeScript belum bisa menyelesaikan pemeriksaan. Kodemu tetap tersimpan; coba periksa lagi.') })
    } finally { if (current === request.current) setChecking(false) }
  }

  const canCheck = challenge.kind === 'fix' ? Boolean(code.trim()) : Boolean(answer.trim())
  const difficulty = locale === 'id' ? ({ Beginner: 'Pemula', Intermediate: 'Menengah', Advanced: 'Lanjutan' } as const)[challenge.difficulty] : challenge.difficulty

  return <section className="challenge-block" aria-label={challenge.title}>
    <div className="challenge-kind-label"><span>{challenge.kind === 'choice' ? t('challenge.choice') : challenge.kind === 'fill' ? t('challenge.fill') : t('challenge.fix')}</span><span className="badge">{difficulty}</span></div>
    <h3 className="challenge-prompt">{challenge.prompt}</h3>
    {challenge.kind === 'fix' ? <CodeEditor label={t('challenge.editor')} value={code} onChange={editCode} minHeight={220} /> : <CodeBlock code={challenge.code} language={challenge.language} />}
    {challenge.kind === 'choice' && <fieldset className="challenge-options"><legend className="sr-only">{t('challenge.choice')}</legend>{challenge.options?.map((option, index) => <label key={option} className={`challenge-option ${answer === option ? 'is-selected' : ''}`}><input type="radio" name={inputId} value={option} checked={answer === option} onChange={() => editAnswer(option)} /><span className="challenge-option-letter">{String.fromCharCode(65 + index)}</span><code>{option}</code></label>)}</fieldset>}
    {challenge.kind === 'fill' && <div className="challenge-fill"><label htmlFor={inputId}>{t('challenge.replace')}</label><input id={inputId} className="field" value={answer} onChange={(event) => editAnswer(event.target.value)} placeholder={t('challenge.answer')} autoComplete="off" autoCapitalize="off" spellCheck={false} onKeyDown={(event) => { if (event.key === 'Enter' && canCheck && !checking) void checkAnswer() }} /></div>}
    <div className="challenge-actions"><button className="button primary" disabled={!canCheck || checking} onClick={() => void checkAnswer()}>{checking ? t('challenge.checking') : t('challenge.check')}{!checking && <CheckCircle2 size={16} aria-hidden="true" />}</button><button className="button ghost" onClick={() => setHintOpen(!hintOpen)} aria-expanded={hintOpen} aria-controls={`${inputId}-hint`}><Lightbulb size={16} aria-hidden="true" /> {hintOpen ? t('challenge.hideHint') : t('challenge.hint')}</button><button className="icon-button challenge-reset" aria-label={t('challenge.reset')} title={t('challenge.reset')} onClick={reset}><RotateCcw size={16} /></button></div>
    {hintOpen && <aside className="challenge-hint" id={`${inputId}-hint`}><Lightbulb size={17} aria-hidden="true" /><p>{challenge.hint}</p></aside>}
    {feedback && <div className={`feedback ${feedback.success ? 'success' : 'error'}`} role="status"><strong>{feedback.success ? t('challenge.right') : t('challenge.retry')}</strong><p>{feedback.message}</p></div>}
    {attempted && <div className="challenge-solution"><button className="button ghost" onClick={() => setSolutionOpen(!solutionOpen)} aria-expanded={solutionOpen} aria-controls={`${inputId}-solution`}>{solutionOpen ? t('challenge.hideExplanation') : t('challenge.showExplanation')}<ChevronDown size={14} aria-hidden="true" /></button>{solutionOpen && <div id={`${inputId}-solution`}><CodeBlock code={challenge.solution ?? challenge.answer} language={challenge.language} /><p>{challenge.explanation}</p></div>}</div>}
  </section>
}
