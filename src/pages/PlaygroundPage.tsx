import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import TextLink from '../components/ui/TextLink'
import { courses, getCourseLessons, getLesson, getFullLesson, lessonPath } from '../content/runtime/catalog'
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
  const starters = courses.map(course => getCourseLessons(course.id).find(lesson => lesson.lab !== 'read' || Boolean(lesson.promptExample))).filter(lesson => lesson !== undefined)
  const sourceOptions = requested ? [requested, ...starters.filter(lesson => lesson.id !== requested.id)] : starters
  const options = sourceOptions.map(lesson => localizeLesson(lesson, locale))
  const [selected, setSelected] = useState(options[0].id)
  const [pending, setPending] = useState<string | null>(null)
  const chosen = options.find(item => item.id === selected) ?? options[0]
  const lesson = getFullLesson(chosen.id)!
  return <div className="page-width playground-page"><header className="playground-header"><div><p className="eyebrow">{t('play.eyebrow')}</p><h1 className="page-heading">{lesson.promptExample ? c('Practice your prompt', 'Latih prompt-mu') : t('play.heading')}</h1><p className="page-lead">{lesson.promptExample ? c('Adapt the example, copy it into your chosen AI coding agent, and inspect the result.', 'Sesuaikan contoh, salin ke AI coding agent pilihanmu, lalu periksa hasilnya.') : t('play.lead')}</p></div><TextLink to={lessonPath(lesson)}><ArrowLeft size={15}/>{c('Open the guided lesson', 'Buka pelajaran terpandu')}</TextLink></header>
    <div className="playground-toolbar"><SelectField id="playground-example" label={t('play.start')} value={pending ?? selected} onValueChange={value => { if (value !== selected) setPending(value) }} options={options.map(item => { const course = courses.find(course => course.id === item.courseId); return { value: item.id, label: `${course ? localizeCourse(course, locale).title : ''} · ${item.title}` } })}/></div>
    {pending && <div className="example-confirm" role="status"><p>{t('play.load', { title: options.find(item => item.id === pending)?.title ?? '' })}</p><button className="button secondary small" onClick={() => { setSelected(pending); setPending(null) }}>{t('play.loadButton')}</button><button className="button ghost small" onClick={() => setPending(null)}>{t('play.keep')}</button></div>}
    {lesson.practice && <p className="playground-practice">{lesson.practice}</p>}
    <LessonLab key={lesson.id + locale} lesson={lesson}/>
    <div className="playground-notes"><p>{lesson.promptExample ? c('Prompt drafts are kept in this browser when storage is available. Use the project journal to record what you built and checked.', 'Draf prompt disimpan di browser ini saat storage tersedia. Pakai jurnal proyek untuk mencatat hasil pembangunan dan pemeriksaanmu.') : c('Playground edits are temporary. Use a stage project to save a draft and keep notes on your work.', 'Perubahan di Lab Kode hanya sementara. Gunakan proyek tahap belajar untuk menyimpan draf dan mencatat hasilnya.')}</p><TextLink to={`/projects/${lesson.courseId}`}>{c('Open this stage’s project', 'Buka proyek tahap ini')}</TextLink></div>
  </div>
}

export default function PlaygroundPage() {
  const c = useLearningCopy()
  usePageTitle(c('Learning playground', 'Playground belajar'))
  const [params] = useSearchParams()
  const lessonId = params.get('example') ?? undefined
  return <PlaygroundWorkspace key={lessonId ?? 'default'} lessonId={lessonId}/>
}
