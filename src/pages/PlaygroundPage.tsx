import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { courses, getCourseLessons, getLesson, lessonPath } from '../content'
import LessonLab from '../components/learning/LessonLab'
import { usePageTitle } from '../hooks/usePageTitle'
import SelectField from '../components/ui/SelectField'
import { useLearningCopy } from '../features/journey/useLearningCopy'
import { useLocale } from '../features/locale/LocaleProvider'
import { localizeCourse, localizeLesson } from '../content/localize'

function PlaygroundWorkspace({ lessonId }: { lessonId?: string }) {
  const c = useLearningCopy()
  const { locale, t } = useLocale()
  const requested = getLesson(lessonId)
  const starters = courses.map(course => getCourseLessons(course.id).find(lesson => lesson.lab !== 'read')).filter(lesson => lesson !== undefined)
  const sourceOptions = requested ? [requested, ...starters.filter(lesson => lesson.id !== requested.id)] : starters
  const options = sourceOptions.map(lesson => localizeLesson(lesson, locale))
  const [selected, setSelected] = useState(options[0].id)
  const [pending, setPending] = useState<string | null>(null)
  const lesson = options.find(item => item.id === selected) ?? options[0]
  return <div className="page-width playground-page"><header className="playground-header"><div><p className="eyebrow">{t('play.eyebrow')}</p><h1 className="page-heading">{t('play.heading')}</h1><p className="page-lead">{t('play.lead')}</p></div><Link className="text-link" to={lessonPath(lesson)}><ArrowLeft size={15}/>{c('Open the guided lesson', 'Buka pelajaran terpandu')}</Link></header>
    <div className="playground-toolbar"><SelectField id="playground-example" label={t('play.start')} value={pending ?? selected} onValueChange={value => { if (value !== selected) setPending(value) }} options={options.map(item => { const course = courses.find(course => course.id === item.courseId); return { value: item.id, label: `${course ? localizeCourse(course, locale).title : ''} · ${item.title}` } })}/></div>
    {pending && <div className="example-confirm" role="status"><p>{t('play.load', { title: options.find(item => item.id === pending)?.title ?? '' })}</p><button className="button secondary small" onClick={() => { setSelected(pending); setPending(null) }}>{t('play.loadButton')}</button><button className="button ghost small" onClick={() => setPending(null)}>{t('play.keep')}</button></div>}
    {lesson.practice && <p className="playground-practice">{lesson.practice}</p>}
    <LessonLab key={lesson.id} lesson={lesson}/>
    <div className="playground-notes"><p>{c('Playground edits are temporary. Use a stage project when you want to save a draft and review your work.', 'Perubahan di playground bersifat sementara. Gunakan proyek tahap belajar untuk menyimpan draft dan mereview hasilmu.')}</p><Link className="text-link" to={`/projects/${lesson.courseId}`}>{c('Open this stage’s project', 'Buka proyek tahap ini')}</Link></div>
  </div>
}

export default function PlaygroundPage() {
  const c = useLearningCopy()
  usePageTitle(c('Learning playground', 'Playground belajar'))
  const [params] = useSearchParams()
  const lessonId = params.get('example') ?? undefined
  return <PlaygroundWorkspace key={lessonId ?? 'default'} lessonId={lessonId}/>
}
