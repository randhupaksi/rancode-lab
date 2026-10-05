import type { Challenge, Concept, Course, CourseModule, Lesson } from '../types'
import type { JourneyStage } from '../journey'
import { lessons as navigationLessons, getLesson as getNavigationLesson } from '../navigation'
const courseIds = new Set(navigationLessons.map(lesson => lesson.courseId))
export type { Challenge, Concept, Course, CourseModule, Lesson } from '../types'
export type { JourneyStage, CheckpointQuestion } from '../journey'
type Locale = 'en' | 'id'
export type LessonSummary = Pick<Lesson, 'id' | 'title' | 'courseId' | 'moduleId' | 'minutes' | 'lab' | 'language' | 'promptExample'>
type Summary = LessonSummary & { challengeId: string }
interface Metadata { courses: Course[]; modules: CourseModule[]; lessons: Summary[]; concepts: Pick<Concept, 'id' | 'title' | 'courseId' | 'lessonId'>[]; stages: JourneyStage[]; localizedStages: JourneyStage[]; experienceOptions: { id: string; startCourseId: string; assessCourseId: string | null; label: string; labelId: string; detail: string; detailId: string }[] }
interface CourseData { lessons: Lesson[]; concepts: Concept[]; challenges?: Challenge[] }
const files = import.meta.glob<string>('../../generated/catalog/*.json', { eager: true, query: '?url', import: 'default' })
const metadata = new Map<Locale, Metadata>()
const data = new Map<string, CourseData>()
const requests = new Map<string, Promise<void>>()
async function load(key: string, commit: (value: Metadata | CourseData) => void) {
  const previous = requests.get(key)
  if (previous) return previous
  const url = files['../../generated/catalog/' + key + '.json']
  if (!url) throw new Error('Unknown curriculum resource: ' + key)
  const request = fetch(url).then(response => {
    if (!response.ok) throw new Error('Curriculum request failed: ' + response.status)
    return response.json() as Promise<Metadata | CourseData>
  }).then(commit).catch(error => { requests.delete(key); throw error })
  requests.set(key, request)
  return request
}
export let courses: Course[] = []
export let modules: CourseModule[] = []
export let lessons: LessonSummary[] = []
export let concepts: Concept[] = []
export let challenges: Challenge[] = []
export let journey: JourneyStage[] = []
export let companionStages: JourneyStage[] = []
export let projectStages: JourneyStage[] = []
export let experienceOptions: Metadata['experienceOptions'] = []
let selected = ''
let lessonIndex = new Map<string, LessonSummary>()
let fullLessonIndex = new Map<string, Lesson>()
let courseIndex = new Map<string, Course>()
let challengeIndex = new Map<string, LessonSummary>()
let courseLessons = new Map<string, LessonSummary[]>()
let moduleLessons = new Map<string, LessonSummary[]>()
let courseModules = new Map<string, CourseModule[]>()
function group<T>(items: T[], key: (item: T) => string | undefined) {
  const result = new Map<string, T[]>()
  for (const item of items) { const id = key(item); if (id) { const group = result.get(id) ?? []; group.push(item); result.set(id, group) } }
  return result
}
function sectionResources(pathname: string) {
  const url = new URL(pathname, 'https://rancode.invalid')
  const path = url.pathname.split('/').filter(Boolean)
  let ids: string[] = []
  if (path[0] === 'learn' && path.length === 3 && path[2] !== 'checkpoint' && courseIds.has(path[1])) {
    ids = [path[1]]
  } else if (path[0] === 'explore' || path[0] === 'cheat-sheet') {
    ids = ['reference']
  } else if (path[0] === 'challenges') {
    ids = ['challenges']
  } else if (path[0] === 'playground') {
    const example = getNavigationLesson(url.searchParams.get('example') ?? undefined)
    ids = example ? ['playground', example.courseId] : ['playground']
  }
  return ids
}

export function catalogReady(pathname: string, locale: Locale) {
  return metadata.has(locale) && sectionResources(pathname).every(id => data.has(id + '-' + locale))
}

export async function prepareCatalog(pathname: string, locale: Locale) {
  // Start metadata and section data together, instead of serial requests.
  await Promise.all([
    load('meta-' + locale, value => metadata.set(locale, value as Metadata)),
    ...sectionResources(pathname).map(id => load(id + '-' + locale, value => data.set(id + '-' + locale, value as CourseData))),
  ])
}
export function activateCatalog(locale: Locale) {
  const meta = metadata.get(locale)
  if (!meta) throw new Error('Curriculum metadata is not ready')
  const loaded = [...data.entries()].filter(([key]) => key.endsWith('-' + locale)).map(([, value]) => value)
  const signature = locale + ':' + loaded.length
  if (selected === signature) return
  selected = signature
  activeMetadata = meta
  courses = meta.courses; modules = meta.modules; projectStages = meta.stages
  journey = projectStages.filter(stage => courses.find(course => course.id === stage.courseId)?.path !== 'companion')
  companionStages = projectStages.filter(stage => !journey.includes(stage)); experienceOptions = meta.experienceOptions
  const full = new Map(loaded.flatMap(item => item.lessons).map(lesson => [lesson.id, lesson]))
  const fullChallenges = new Map(loaded.flatMap(item => item.challenges ?? []).map(challenge => [challenge.id, challenge]))
  // Metadata-only routes use titles and progress IDs; reading/interactive routes are prepared before mounting.
  fullLessonIndex = full
  lessons = meta.lessons.map(lesson => full.get(lesson.id) ?? lesson)
  const fullConcepts = new Map(loaded.flatMap(item => item.concepts).map(concept => [concept.id, concept]))
  concepts = meta.concepts.map(concept => fullConcepts.get(concept.id) ?? { ...concept, category: '', description: '', code: '' })
  challenges = meta.lessons.map(lesson => fullChallenges.get(lesson.challengeId) ?? full.get(lesson.id)?.challenge).filter(challenge => challenge !== undefined)
  lessonIndex = new Map(lessons.map(lesson => [lesson.id, lesson])); courseIndex = new Map(courses.map(course => [course.id, course]))
  challengeIndex = new Map(meta.lessons.map(lesson => [lesson.challengeId, lessonIndex.get(lesson.id)!]))
  courseLessons = group(lessons, lesson => lesson.courseId); moduleLessons = group(lessons, lesson => lesson.moduleId); courseModules = group(modules, module => module.courseId)
}
export function getLesson(id: string | undefined) { return id ? lessonIndex.get(id) : undefined }
/** Full examples must be prepared by the route boundary; summaries cannot silently act as lesson bodies. */
export function getFullLesson(id: string | undefined): Lesson | undefined {
  if (!id || !lessonIndex.has(id)) return undefined
  const lesson = fullLessonIndex.get(id)
  if (!lesson) throw new Error('Lesson content was not prepared: ' + id)
  return lesson
}
export function getCourse(id: string | undefined) { return id ? courseIndex.get(id) : undefined }
export function getCourseLessons(id: string): readonly LessonSummary[] { return courseLessons.get(id) ?? [] }
export function getModuleLessons(id: string): readonly LessonSummary[] { return moduleLessons.get(id) ?? [] }
export function getCourseModules(id: string): readonly CourseModule[] { return courseModules.get(id) ?? [] }
export function getLessonForChallenge(id: string) { return challengeIndex.get(id) }
export function lessonPath(lesson: Pick<Lesson, 'id' | 'courseId'>) { return '/learn/' + (lesson.courseId ?? 'typescript') + '/' + lesson.id }
export function getNextCourse(id: string | undefined) { const path = courses.filter(course => course.path !== 'companion'); const index = path.findIndex(course => course.id === id); return index >= 0 ? path[index + 1] : undefined }
export function localizedStage(stage: JourneyStage) { return activeMetadata?.localizedStages.find(item => item.courseId === stage.courseId) ?? stage }
let activeMetadata: Metadata | undefined
export function getStage(id: string | undefined) { return projectStages.find(stage => stage.courseId === id) }
