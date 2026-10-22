import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { fileURLToPath } from 'node:url'
import { readFile } from 'node:fs/promises'
import { createServer } from 'vite'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import {
  applyLearningCopy,
  applyConceptLearningCopy,
  loadLearningCopy,
  validateLearningCopy,
} from './learning-copy.mjs'

let server, catalog, localizers, copy, Reading, Inline, Practice, LocaleProvider
before(async () => {
  server = await createServer({
    configFile: false,
    root: fileURLToPath(new URL('../', import.meta.url)),
    server: { middlewareMode: true, hmr: false, ws: false, watch: null },
    optimizeDeps: { noDiscovery: true, include: [] },
    appType: 'custom',
  })
  catalog = await server.ssrLoadModule('/src/content/index.ts')
  localizers = await server.ssrLoadModule('/src/content/localize.ts')
  copy = await loadLearningCopy(catalog.courses, catalog.lessons)
  const ui = await server.ssrLoadModule('/src/components/learning/LessonReading.tsx')
  Reading = ui.default
  Inline = ui.InlineLearningText
  Practice = ui.LessonPractice
  ;({ LocaleProvider } = await server.ssrLoadModule('/src/features/locale/LocaleProvider.tsx'))
})
after(async () => {
  await server?.close()
})

test('all 341 bilingual guides preserve executable and grading contracts without mutating sources', () => {
  assert.equal(Object.keys(copy).length, 341)
  for (const source of catalog.lessons)
    for (const locale of ['id', 'en']) {
      const original = localizers.localizeLesson(source, locale)
      const snapshot = JSON.stringify(original)
      const revised = applyLearningCopy(original, locale, copy)
      for (const key of [
        'id',
        'courseId',
        'moduleId',
        'minutes',
        'lab',
        'language',
        'code',
        'inspectSymbols',
        'relatedConcepts',
        'comparison',
        'steps',
      ])
        assert.deepEqual(revised[key], original[key], source.id + '.' + key)
      const scoring = challenge =>
        Object.fromEntries(
          Object.entries(challenge).filter(([key]) => !['hint', 'explanation'].includes(key)),
        )
      assert.deepEqual(scoring(revised.challenge), scoring(original.challenge), source.id)
      assert.deepEqual(
        revised.visual.nodes.map(({ detail: _detail, ...node }) => node),
        original.visual.nodes.map(({ detail: _detail, ...node }) => node),
        source.id + ': canvas identities',
      )
      assert.deepEqual(revised.visual.edges, original.visual.edges)
      assert.deepEqual(revised.visual.simulation, original.visual.simulation)
      assert.equal(JSON.stringify(original), snapshot)
      assert.ok(revised.reading.blocks.length)
      assert.ok(revised.reading.practiceSteps.length)
      assert.ok(!revised.challenge.hint.startsWith('Perhatikan langkah'))
      assert.ok(
        !/^Follow the .+ step and compare it with the result[.]/.test(revised.challenge.hint),
      )
      assert.ok(!revised.recap.includes(original.description), source.id + ': repeated opening')
    }
})

test('guide validation rejects untranslated entries, unknown lessons, unsupported fields and mismatched lists', () => {
  const source = catalog.lessons.find(lesson => lesson.id === 'logic-instructions')
  const sample = () => structuredClone({ [source.id]: copy[source.id] })
  let invalid = sample()
  delete invalid[source.id].en
  assert.throws(() => validateLearningCopy(invalid, [source]), /Missing en/)
  invalid = sample()
  invalid[source.id].id.code = 'unapproved replacement'
  assert.throws(() => validateLearningCopy(invalid, [source]), /Unsupported/)
  invalid = sample()
  invalid[source.id].en.blocks[1].items.pop()
  assert.throws(() => validateLearningCopy(invalid, [source]), /Different bilingual/)
  invalid = { missing: sample()[source.id] }
  assert.throws(() => validateLearningCopy(invalid, [source]), /Unknown lesson/)
})

test('reading renders semantic ordered and unordered lists and escapes learner-facing code', () => {
  for (const source of catalog.lessons)
    for (const locale of ['id', 'en']) {
      const lesson = applyLearningCopy(localizers.localizeLesson(source, locale), locale, copy)
      const html = renderToStaticMarkup(createElement(Reading, { lesson }))
      for (const block of lesson.reading.blocks.filter(block => block.kind === 'list'))
        assert.ok(html.includes(block.ordered ? '<ol>' : '<ul>'), source.id)
    }
  const marker = String.fromCharCode(96)
  const escaped = renderToStaticMarkup(
    createElement(Inline, { text: '<script>alert(1)</script> ' + marker + '<h1>' + marker }),
  )
  assert.ok(!escaped.includes('<script>'))
  assert.ok(escaped.includes('<code'))
  assert.ok(escaped.includes('&lt;h1&gt;'))
})

test('reference and prompt guidance does not imply execution that the workspace cannot provide', () => {
  const renderPractice = id => {
    const source = catalog.getLesson(id)
    const lesson = applyLearningCopy(localizers.localizeLesson(source, 'id'), 'id', copy)
    return renderToStaticMarkup(
      createElement(LocaleProvider, null, createElement(Practice, { lesson })),
    )
  }
  assert.match(renderPractice('logic-pseudocode'), /pseudocode bukan JavaScript/)
  assert.match(renderPractice('next-async-route-inputs'), /tidak ada tombol Jalankan/)
  assert.match(renderPractice('react-components'), /belum menjalankan framework/)
  assert.match(renderPractice('ai-capstone'), /bukan mengirimkannya ke agen AI/)
  assert.match(copy['ai-capstone'].id.practiceSteps.join(' '), /ruang proyek Rancode/)
})

test('list markers and inline code use existing theme tokens and wrap at narrow widths', async () => {
  const css = await readFile(new URL('../src/styles/lesson-reading.css', import.meta.url), 'utf8')
  assert.match(css, /list-style: decimal outside/)
  assert.match(css, /list-style: disc outside/)
  assert.match(css, /overflow-wrap: anywhere/)
  assert.ok(!css.includes('var(--text)') && !css.includes('var(--accent)'))
})

test('reference copy follows revised lessons without mutating source concepts or replacing custom visuals', () => {
  const original = catalog.getLesson('react-components')
  const revised = applyLearningCopy(original, 'en', copy)
  const concept = { id: 'demo', description: original.description, visual: original.visual }
  const snapshot = JSON.stringify(concept)
  const updated = applyConceptLearningCopy(concept, original, revised)
  assert.equal(JSON.stringify(concept), snapshot)
  assert.equal(updated.visual, revised.visual)
  const custom = { ...concept, visual: { ...concept.visual, title: 'A custom comparison' } }
  assert.equal(applyConceptLearningCopy(custom, original, revised).visual, custom.visual)
})
