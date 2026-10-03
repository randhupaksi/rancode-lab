import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { Script } from 'node:vm'
import { createServer } from 'vite'

let server, catalog, journey, recommendNext, progressSchema
before(async () => {
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('../../../', import.meta.url)),
    server: { middlewareMode: true, hmr: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  })
  catalog = await server.ssrLoadModule('/src/content/index.ts')
  ;({ journey } = await server.ssrLoadModule('/src/content/journey.ts'))
  ;({ recommendNext } = await server.ssrLoadModule('/src/features/journey/recommendation.ts'))
  ;({ progressSchema } = await server.ssrLoadModule('/src/features/progress/model.ts'))
})
after(async () => { await server?.close() })

test('learning stages have consistent ordering, valid review links, and executable JavaScript models', () => {
  for (const collection of ['courses', 'modules', 'lessons', 'concepts', 'challenges']) {
    assert.equal(new Set(catalog[collection].map(item => item.id)).size, catalog[collection].length, `${collection}: duplicate IDs`)
  }
  assert.deepEqual(catalog.courses.map(course => course.id), journey.map(stage => stage.courseId))
  for (const stage of journey) {
    const lessons = catalog.getCourseLessons(stage.courseId)
    assert.ok(lessons.length, `Empty stage: ${stage.courseId}`)
    const syllabus = catalog.getCourseModules(stage.courseId).flatMap(module => catalog.getModuleLessons(module.id))
    catalog.getCourseModules(stage.courseId).forEach((module, index) => {
      assert.equal(module.number, String(index + 1).padStart(2, '0'))
      assert.ok(catalog.getModuleLessons(module.id).length, `Empty module: ${module.id}`)
    })
    assert.deepEqual(lessons.map(lesson => lesson.id), syllabus.map(lesson => lesson.id), `Pagination differs from syllabus: ${stage.courseId}`)
    for (const question of stage.checkpoint) {
      assert.equal(catalog.getLesson(question.lessonId)?.courseId, stage.courseId, `Invalid checkpoint review link: ${question.id}`)
      assert.ok(question.options.includes(question.answer), `Missing correct option: ${question.id}`)
    }
    assert.ok(stage.project.starter.trim())
    assert.ok(stage.project.criteria.length)
    for (const lesson of lessons) {
      assert.ok(catalog.getCourse(lesson.courseId))
      for (const id of lesson.relatedConcepts) assert.ok(catalog.concepts.some(concept => concept.id === id), `Missing related concept: ${id}`)
      if (lesson.challenge.kind === 'choice') assert.ok(lesson.challenge.options.includes(lesson.challenge.answer))
      if (lesson.language === 'javascript' && lesson.lab !== 'read') {
        assert.doesNotThrow(() => new Script(`(async () => { ${lesson.code}\n })`), `Not valid plain JavaScript: ${lesson.id}`)
      }
      if (lesson.lab === 'web') {
        for (const match of lesson.code.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)) {
          assert.doesNotThrow(() => new Script(match[1]), `Invalid preview script: ${lesson.id}`)
        }
      }
    }
  }
  for (const id of ['html', 'css', 'javascript', 'browser', 'react', 'typescript', 'nextjs']) assert.ok(catalog.getCourseLessons(id).length > 30, `Expected a broad curriculum: ${id}`)
  for (const id of ['logic', 'web']) assert.ok(catalog.getCourseLessons(id).length >= 12, `Expected a focused foundation: ${id}`)
  for (const [course, finalLesson] of [['react', 'react-feature-architecture'], ['typescript', 'final-challenge'], ['nextjs', 'next-full-route-review']]) {
    assert.equal(catalog.getCourseLessons(course).at(-1).id, finalLesson, 'Final practice should follow the depth modules')
  }
  for (const lesson of catalog.getCourseLessons('react')) {
    assert.equal(lesson.language, 'javascript')
    assert.ok(lesson.comparison.after.trim())
  }
})

test('existing lesson progress survives the additive journey fields and project drafts round-trip', () => {
  const old = { version: 1, completedLessons: ['why-typescript'], completedChallenges: ['why-typescript-check'], lastLesson: 'why-typescript' }
  const restored = progressSchema.parse(old)
  assert.deepEqual(restored.completedLessons, old.completedLessons)
  assert.deepEqual(restored.completedChallenges, old.completedChallenges)
  assert.equal(restored.lastLesson, old.lastLesson)
  assert.equal(restored.learningProfile, null)
  assert.deepEqual(restored.projects, {})
  restored.projects.html = { code: '<h1>Practice</h1>', notes: 'Checked the heading.', criteria: [], completed: false, updatedAt: '2026-10-03T00:00:00.000Z' }
  assert.deepEqual(progressSchema.parse(JSON.parse(JSON.stringify(restored))), restored)
})

test('recommendations move through lesson, checkpoint, project, and next stage without awarding skipped work', () => {
  const progress = progressSchema.parse({ version: 1, completedLessons: [], completedChallenges: [], lastLesson: null })
  assert.equal(recommendNext(progress).courseId, 'logic')
  assert.equal(recommendNext(progress).kind, 'lesson')
  progress.completedLessons = catalog.getCourseLessons('logic').map(lesson => lesson.id)
  assert.equal(recommendNext(progress).kind, 'checkpoint')
  progress.checkpoints.logic = { score: 2, total: 3, passed: false }
  assert.equal(recommendNext(progress).kind, 'checkpoint')
  progress.checkpoints.logic = { score: 3, total: 3, passed: true }
  assert.equal(recommendNext(progress).kind, 'project')
  progress.projects.logic = { code: 'example', notes: 'checked', criteria: [], completed: true, updatedAt: '' }
  assert.equal(recommendNext(progress).courseId, 'web')
  progress.learningProfile = { experience: 'react', startCourseId: 'typescript' }
  assert.equal(recommendNext(progress).courseId, 'typescript')
  assert.equal(progress.completedLessons.includes('react-components'), false)
  progress.checkpoints.typescript = { score: 3, total: 3, passed: true }
  assert.equal(recommendNext(progress).kind, 'project', 'Checkpoint proficiency permits skipping lesson review')
  for (const id of ['typescript', 'nextjs']) {
    progress.checkpoints[id] = { score: 3, total: 3, passed: true }
    progress.projects[id] = { code: 'example', notes: 'checked', criteria: [], completed: true, updatedAt: '' }
  }
  assert.equal(recommendNext(progress).kind, 'finished')
})
