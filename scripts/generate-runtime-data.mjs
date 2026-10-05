import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import { readCompilerLibraries } from './compiler-libraries.mjs'
import { validateContentLocales } from './validate-content-locales.mjs'

const output = new URL('../src/generated/', import.meta.url)
await mkdir(output, { recursive: true })
async function save(name, text) {
  const path = new URL(name, output)
  if (await readFile(path, 'utf8').catch(() => '') !== text) await writeFile(path, text)
}

// Evaluate curriculum on the build machine. The home page only receives navigation metadata.
const server = await createServer({
  configFile: false,
  root: fileURLToPath(new URL('../', import.meta.url)),
  server: { middlewareMode: true, hmr: false, ws: false, watch: null },
  optimizeDeps: { noDiscovery: true, include: [] },
  appType: 'custom',
})
try {
  const catalog = await server.ssrLoadModule('/src/content/index.ts')
  const { courses, modules, lessons, concepts } = catalog
  const { journey, projectStages, experienceOptions } = await server.ssrLoadModule('/src/content/journey.ts')
  const localizers = await server.ssrLoadModule('/src/content/localize.ts')
  const { localizeLesson } = localizers
  const copy = await server.ssrLoadModule('/src/content/locales/id.ts')
  const coverage = validateContentLocales(catalog, localizers, copy)
  console.log(`Verified Indonesian copy: ${coverage.lessons} lessons, ${coverage.concepts} concepts, ${coverage.checkedFields} fields.`)
  const { localizeJourneyStage } = await server.ssrLoadModule('/src/content/journey-localize.ts')
  for (const stage of projectStages) {
    if (localizeJourneyStage(stage, 'id').project.criteria.length !== stage.project.criteria.length) {
      throw new Error(`Project review translations must preserve criteria order and count: ${stage.courseId}`)
    }
  }
  const data = {
    courseCount: courses.length,
    lessons: lessons.map(lesson => ({ id: lesson.id, courseId: lesson.courseId ?? 'typescript', title: lesson.title, titleId: localizeLesson(lesson, 'id').title })),
    journey: journey.map(stage => ({ courseId: stage.courseId, project: { title: stage.project.title, titleId: localizeJourneyStage(stage, 'id').project.title } })),
  }
  await save('navigation.json', `${JSON.stringify(data, null, 2)}\n`)
  await mkdir(new URL('catalog/', output), { recursive: true })
  for (const locale of ['en', 'id']) {
    const courseData = courses.map(course => localizers.localizeCourse(course, locale))
    const moduleData = modules.map(module => localizers.localizeModule(module, locale))
    const lessonData = lessons.map(lesson => localizeLesson(lesson, locale))
    const conceptData = concepts.map(concept => localizers.localizeConcept(concept, catalog.getLesson(concept.lessonId), locale))
    // List/roadmap routes need identities and copy, never executable examples or grading payloads.
    const summaries = lessonData.map(lesson => ({ id: lesson.id, courseId: lesson.courseId, moduleId: lesson.moduleId, title: lesson.title, minutes: lesson.minutes, lab: lesson.lab, language: lesson.language, challengeId: lesson.challenge.id }))
    await save(`catalog/meta-${locale}.json`, JSON.stringify({ courses: courseData, modules: moduleData, lessons: summaries, concepts: conceptData.map(concept => ({ id: concept.id, title: concept.title, courseId: concept.courseId, lessonId: concept.lessonId })), stages: projectStages, localizedStages: locale === 'id' ? projectStages.map(stage => localizeJourneyStage(stage, locale)) : [], experienceOptions }))
    for (const course of courses) {
      await save(`catalog/${course.id}-${locale}.json`, JSON.stringify({ lessons: lessonData.filter(lesson => lesson.courseId === course.id), concepts: conceptData.filter(concept => concept.courseId === course.id) }))
    }
    const referenceConcepts = conceptData.map(concept => ({ ...concept, visual: concept.visual ?? lessonData.find(lesson => lesson.id === concept.lessonId)?.visual }))
    await save(`catalog/reference-${locale}.json`, JSON.stringify({ lessons: [], concepts: referenceConcepts }))
    await save(`catalog/challenges-${locale}.json`, JSON.stringify({ lessons: [], concepts: [], challenges: lessonData.map(lesson => lesson.challenge) }))
    const starters = courses.map(course => lessonData.find(lesson => lesson.courseId === course.id && (lesson.lab !== 'read' || lesson.promptExample))).filter(Boolean)
    await save(`catalog/playground-${locale}.json`, JSON.stringify({ lessons: starters, concepts: [] }))
    const label = locale === 'id' ? { lesson: 'Pelajaran', concept: 'Konsep', challenge: 'Tantangan', reference: 'Referensi' } : { lesson: 'lesson', concept: 'Concept', challenge: 'Challenge', reference: 'Reference' }
    const entries = [
      ...lessonData.map(lesson => ({ id: 'lesson-' + lesson.id, title: lesson.title, description: lesson.description, type: courseData.find(course => course.id === lesson.courseId).title + ' ' + label.lesson, url: catalog.lessonPath(lesson) })),
      ...conceptData.map(concept => ({ id: 'concept-' + concept.id, title: concept.title, description: concept.description, type: label.concept, url: '/explore/' + concept.id })),
      ...lessonData.map(lesson => ({ id: 'challenge-' + lesson.challenge.id, title: lesson.challenge.title, description: lesson.challenge.prompt, type: label.challenge, url: '/challenges/' + lesson.challenge.id })),
      ...conceptData.map(concept => ({ id: 'reference-' + concept.id, title: concept.title, description: concept.description, type: label.reference, url: '/cheat-sheet#' + concept.id })),
    ]
    await save(`catalog/search-${locale}.json`, JSON.stringify(entries))
  }
} finally {
  await server.close()
}

const libraries = await readCompilerLibraries()
const names = [...libraries.keys()].sort()
await save('compiler-libraries.ts', [
  '// Generated by npm run content:generate. Do not edit manually.',
  ...names.map((name, index) => `import lib${index} from '../../node_modules/typescript-browser/lib/${name}?raw'`),
  'export default {',
  ...names.map((name, index) => `  '${name}': lib${index},`),
  '} satisfies Record<string, string>',
  '',
].join('\n'))
console.log(`Generated navigation metadata and ${names.length} compiler libraries.`)
