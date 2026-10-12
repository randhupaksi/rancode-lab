import { Fragment } from 'react'
import type { Lesson } from '../../content/types'
import { useLearningCopy } from '../../features/journey/useLearningCopy'
import '../../styles/lesson-reading.css'

/** Only explicit inline code is interpreted. Content remains escaped React text. */
export function InlineLearningText({ text }: { text: string }) {
  const marker = String.fromCharCode(96)
  const parts = text.split(marker)
  return <>{parts.map((part, index) => <Fragment key={index}>{index % 2 === 1 && index < parts.length - 1 ? <code className="learning-inline-code">{part}</code> : part}</Fragment>)}</>
}
export default function LessonReading({ lesson }: { lesson: Lesson }) {
  const blocks = lesson.reading?.blocks ?? lesson.explanation.map(text => ({ kind: 'paragraph' as const, text }))
  return <div className="lesson-prose lesson-reading">{blocks.map((block, index) => {
    if (block.kind === 'list') {
      const List = block.ordered ? 'ol' : 'ul'
      return <div className="learning-reading-group" key={index}>{block.title && <h3>{block.title}</h3>}<List>{block.items.map((text, item) => <li key={item}><InlineLearningText text={text}/></li>)}</List></div>
    }
    if (block.kind === 'note') return <aside className="learning-reading-note" key={index}>{block.title && <h3>{block.title}</h3>}<p><InlineLearningText text={block.text}/></p></aside>
    return <p key={index}><InlineLearningText text={block.text}/></p>
  })}</div>
}
export function LessonPractice({ lesson }: { lesson: Lesson }) {
  const c = useLearningCopy()
  const steps = lesson.reading?.practiceSteps
  return <div className="lesson-practice-guide lesson-reading">
    {steps?.length ? steps.length > 1 ? <ol>{steps.map((text, index) => <li key={index}><InlineLearningText text={text}/></li>)}</ol> : <p><InlineLearningText text={steps[0]}/></p> : lesson.practice && <p>{lesson.practice}</p>}
    {lesson.reading?.expected && <p className="learning-expected"><strong>{c('What to observe', 'Yang perlu diamati')}: </strong><InlineLearningText text={lesson.reading.expected}/></p>}
    {(lesson.courseId === 'react' || lesson.courseId === 'nextjs') && lesson.lab !== 'read' && <p className="learning-lab-note">{c('The Rancode editor runs a JavaScript or TypeScript model. Component and route examples need a local React or Next.js project; this editor does not run the framework.', 'Editor Rancode menjalankan model JavaScript atau TypeScript. Contoh komponen dan halaman perlu proyek React atau Next.js lokal; editor ini belum menjalankan framework tersebut.')}</p>}
    {lesson.lab === 'read' && !lesson.promptExample && <p className="learning-lab-note">{lesson.courseId === 'logic' || lesson.courseId === 'web' ? c('This reference is for reading and tracing, so there is no Run button. Diagrams and pseudocode are not JavaScript; terminal commands belong in your local terminal.', 'Referensi ini untuk dibaca dan ditelusuri, sehingga tidak ada tombol Jalankan. Diagram dan pseudocode bukan JavaScript; perintah terminal dikerjakan di terminal lokal.') : c('This is a reference example to read, so there is no Run button here. Follow the steps in your local project; examples with file comments need separate files.', 'Ini contoh untuk dibaca, sehingga tidak ada tombol Jalankan di sini. Ikuti langkahnya di proyek lokal; contoh dengan penanda nama file perlu dipisahkan ke file masing-masing.')}</p>}
    {lesson.promptExample && <p className="learning-lab-note">{c('This space helps you write a prompt. It does not send requests to an AI agent. Copy the prompt into your chosen tool, then inspect and try its result.', 'Ruang ini membantu kamu menulis prompt, bukan mengirimkannya ke agen AI. Salin prompt ke alat pilihanmu, lalu periksa dan coba hasilnya.')}</p>}
  </div>
}
