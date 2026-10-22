import { useState } from 'react'
import { BookOpen } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import {
  courses,
  getCourseLessons,
  getLesson,
  getFullLesson,
  lessonPath,
} from '../content/runtime/catalog'
import { LessonPractice } from '../components/learning/LessonReading'
import LessonLab from '../components/learning/LessonLab'
import { usePageTitle } from '../hooks/usePageTitle'
import SelectField from '../components/ui/SelectField'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse, localizeLesson } from '../content/runtime/localize'

function PlaygroundWorkspace({ lessonId }: { lessonId?: string }) {
  const c = useLearningCopy()
  const { locale, t } = useLocale()
  const requested = getLesson(lessonId)
  const starters = courses
    .map(course =>
      getCourseLessons(course.id).find(
        lesson => lesson.lab !== 'read' || Boolean(lesson.promptExample),
      ),
    )
    .filter(lesson => lesson !== undefined)
  const sourceOptions = requested
    ? [requested, ...starters.filter(lesson => lesson.id !== requested.id)]
    : starters
  const options = sourceOptions.map(lesson => localizeLesson(lesson, locale))
  const [selected, setSelected] = useState(options[0].id)
  const [pending, setPending] = useState<string | null>(null)
  const chosen = options.find(item => item.id === selected) ?? options[0]
  const lesson = getFullLesson(chosen.id)!
  return (
    <div className="page-width playground-page">
      <header className="playground-header">
        <div className="playground-intro">
          <p className="eyebrow">{t('play.eyebrow')}</p>
          <h1 className="page-heading">
            {lesson.promptExample
              ? c('Practice your prompt', 'Latih prompt-mu')
              : t('play.heading')}
          </h1>
          <p className="page-lead">
            {lesson.promptExample
              ? c(
                  'Adapt the example, copy it into your chosen AI coding agent, and inspect the result.',
                  'Sesuaikan contoh, salin ke AI coding agent pilihanmu, lalu periksa hasilnya.',
                )
              : t('play.lead')}
          </p>
        </div>
        <TextLink to={lessonPath(lesson)}>
          <BookOpen size={15} />
          {c('Open the guided lesson', 'Buka pelajaran terpandu')}
        </TextLink>
      </header>

      <section
        className="playground-stage playground-example-stage"
        aria-labelledby="playground-example-title"
      >
        <div className="playground-stage-heading">
          <span className="playground-stage-index" aria-hidden="true">
            01
          </span>
          <div>
            <p className="eyebrow">{c('Start here', 'Mulai di sini')}</p>
            <h2 id="playground-example-title">{c('Choose an example', 'Pilih contoh')}</h2>
            <p>
              {c(
                'Pick a starting point. Your current edits stay safe until you confirm a new example.',
                'Pilih titik awal. Perubahanmu tetap aman sampai kamu mengonfirmasi contoh baru.',
              )}
            </p>
          </div>
        </div>
        <div className="playground-example-controls">
          <SelectField
            className="playground-example-select"
            id="playground-example"
            label={c('Example', 'Contoh')}
            value={pending ?? selected}
            onValueChange={value => {
              if (value !== selected) setPending(value)
            }}
            options={options.map(item => {
              const course = courses.find(course => course.id === item.courseId)
              return {
                value: item.id,
                label: `${course ? localizeCourse(course, locale).title : ''} · ${item.title}`,
              }
            })}
          />
          {pending && (
            <div className="example-confirm" role="status">
              <p>
                {t('play.load', { title: options.find(item => item.id === pending)?.title ?? '' })}
              </p>
              <div>
                <button
                  className="button secondary small"
                  onClick={() => {
                    setSelected(pending)
                    setPending(null)
                  }}
                >
                  {t('play.loadButton')}
                </button>
                <button className="button ghost small" onClick={() => setPending(null)}>
                  {t('play.keep')}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <section
        className="playground-stage playground-practice-stage"
        aria-labelledby="playground-practice-title"
      >
        <div className="playground-stage-heading">
          <span className="playground-stage-index" aria-hidden="true">
            02
          </span>
          <div>
            <p className="eyebrow">{c('Before you edit', 'Sebelum mengedit')}</p>
            <h2 id="playground-practice-title">{c('Try these steps', 'Ikuti langkah ini')}</h2>
            <p>
              {lesson.promptExample
                ? c(
                    'Use these steps to shape a clear prompt before trying it in your AI tool.',
                    'Gunakan langkah ini untuk menyusun prompt yang jelas sebelum mencobanya di alat AI.',
                  )
                : c(
                    'Start with one small change so you can connect the code to what happens.',
                    'Mulai dari satu perubahan kecil supaya kamu bisa menghubungkan kode dengan hasilnya.',
                  )}
            </p>
          </div>
        </div>
        <LessonPractice lesson={lesson} />
      </section>

      <section
        className="playground-stage playground-workbench-stage"
        aria-labelledby="playground-workbench-title"
      >
        <div className="playground-stage-heading">
          <span className="playground-stage-index" aria-hidden="true">
            03
          </span>
          <div>
            <p className="eyebrow">
              {lesson.promptExample
                ? c('Your workspace', 'Ruang kerjamu')
                : c('Experiment', 'Eksperimen')}
            </p>
            <h2 id="playground-workbench-title">
              {lesson.promptExample
                ? c('Shape the prompt', 'Susun prompt-mu')
                : c('Change it and observe', 'Ubah lalu amati')}
            </h2>
            <p>
              {lesson.promptExample
                ? c(
                    'Edit your draft here, then copy it into your chosen AI coding tool to try it.',
                    'Edit draf di sini, lalu salin ke alat AI pilihanmu untuk mencobanya.',
                  )
                : c(
                    'Make one change at a time, then compare the output or preview.',
                    'Ubah satu bagian setiap kali, lalu bandingkan output atau preview-nya.',
                  )}
            </p>
          </div>
        </div>
        <LessonLab key={lesson.id + locale} lesson={lesson} />
      </section>

      <aside className="playground-notes">
        <p>
          {lesson.promptExample
            ? c(
                'Prompt drafts are kept in this browser when storage is available. Use the project journal to record what you built and checked.',
                'Draf prompt disimpan di browser ini saat storage tersedia. Pakai jurnal proyek untuk mencatat hasil pembangunan dan pemeriksaanmu.',
              )
            : c(
                'Playground edits are temporary. Use a stage project to save a draft and keep notes on your work.',
                'Perubahan di Lab Kode hanya sementara. Gunakan proyek tahap ini untuk menyimpan draf dan catatanmu.',
              )}
        </p>
        <TextLink to={`/projects/${lesson.courseId}`}>
          {c('Open this stage’s project', 'Buka proyek tahap ini')}
        </TextLink>
      </aside>
    </div>
  )
}

export default function PlaygroundPage() {
  const c = useLearningCopy()
  usePageTitle(c('Learning playground', 'Playground belajar'))
  const [params] = useSearchParams()
  const lessonId = params.get('example') ?? undefined
  return <PlaygroundWorkspace key={lessonId ?? 'default'} lessonId={lessonId} />
}
