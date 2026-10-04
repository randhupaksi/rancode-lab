import { useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLesson, lessonPath } from '../../content'
import type { CheckpointQuestion } from '../../content/journey'
import { useLearningCopy } from './useLearningCopy'
import { useLocale } from '../locale/LocaleProvider'
import { localizeLesson } from '../../content/localize'

export default function CheckpointQuiz({ questions, onComplete, onRetry }: { questions: CheckpointQuestion[]; onComplete: (score: number, total: number) => void; onRetry?: () => void }) {
  const c = useLearningCopy()
  const { locale } = useLocale()
  const id = useId()
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [submitted, setSubmitted] = useState(false)
  const summary = useRef<HTMLDivElement>(null)
  const score = questions.filter(question => answers[question.id] === question.options.indexOf(question.answer)).length
  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (questions.some(question => answers[question.id] === undefined)) return
    setSubmitted(true)
    onComplete(score, questions.length)
    requestAnimationFrame(() => summary.current?.focus())
  }
  return <form className="checkpoint-quiz" onSubmit={submit}>
    <p className="quiet-note">{c('Answer each question. You can review the explanations and try again as often as you like.', 'Jawab semua pertanyaan. Baca penjelasannya, lalu coba lagi kapan pun kamu mau.')}</p>
    {questions.map((question, index) => {
      const correct = answers[question.id] === question.options.indexOf(question.answer)
      const sourceLesson = getLesson(question.lessonId)
      const lesson = sourceLesson ? localizeLesson(sourceLesson, locale) : undefined
      const offset = index % question.options.length
      const options = [...question.options.slice(offset), ...question.options.slice(0, offset)]
      return <fieldset className="checkpoint-question" key={question.id}>
        <legend><span className="number-label">{String(index + 1).padStart(2, '0')}</span> {question.prompt}</legend>
        <div className="checkpoint-options">{options.map(option => { const optionIndex = question.options.indexOf(option); return <label key={option} className={"checkpoint-option " + (answers[question.id] === optionIndex ? "selected" : "")}>
          <input type="radio" name={id + "-" + question.id} value={optionIndex} checked={answers[question.id] === optionIndex} disabled={submitted} onChange={() => setAnswers(current => ({ ...current, [question.id]: optionIndex }))}/><span>{option}</span>
        </label> })}</div>
        {submitted && <div className={`feedback ${correct ? 'success' : 'error'}`}><strong>{correct ? c('Correct.', 'Benar.') : c('Review this idea.', 'Tinjau kembali ide ini.')}</strong><p>{question.explanation}</p>{!correct && lesson && <Link className="text-link" to={lessonPath(lesson)}>{c('Review lesson', 'Tinjau pelajaran')}: {lesson.title}</Link>}</div>}
      </fieldset>
    })}
    {submitted ? <div className="checkpoint-result" ref={summary} tabIndex={-1} role="status"><h2>{score}/{questions.length} · {score === questions.length ? c('Ready for the next step', 'Siap ke langkah berikutnya') : c('A few ideas to revisit', 'Ada beberapa ide untuk ditinjau')}</h2><p>{c('Use the explanations above to understand the result.', 'Baca penjelasan di atas untuk memahami hasilnya.')}</p><button type="button" className="button secondary" onClick={() => { setSubmitted(false); setAnswers({}); onRetry?.() }}>{c('Try again', 'Coba lagi')}</button></div> : <button className="button primary" disabled={questions.some(question => answers[question.id] === undefined)}>{c('Check my understanding', 'Cek pemahamanku')}</button>}
  </form>
}
