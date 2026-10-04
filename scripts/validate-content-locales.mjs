import assert from 'node:assert/strict'

/** Run during content generation so untranslated additions cannot silently ship. */
export function validateContentLocales(catalog, localizers, copy) {
  const { lessons, concepts, getLesson } = catalog
  const { localizeLesson, localizeConcept } = localizers
  const { hasIndonesianLessonCopy, translateLessonCopy } = copy
  const snapshot = JSON.stringify({ lessons, concepts })
  const missing = []
  let checkedFields = 0

  function text(source, translated, course, path) {
    if (source === undefined) return
    checkedFields++
    if (!hasIndonesianLessonCopy(source, course)) missing.push(`${path}: ${source}`)
    assert.ok(typeof translated === 'string' && translated.trim(), `Empty translation: ${path}`)
    assert.ok(!translated.includes('\uFFFD'), `Invalid encoding: ${path}`)
    if (translated === source) {
      assert.equal(translateLessonCopy(source, course), source, `Translation not applied: ${path}`)
    }
  }

  function visual(source, translated, course, path) {
    if (!source) return
    assert.ok(translated, `Missing visual: ${path}`)
    for (const key of ['title', 'description']) text(source[key], translated[key], course, `${path}.${key}`)
    assert.equal(translated.nodes.length, source.nodes.length, `Node count: ${path}`)
    assert.equal(translated.edges.length, source.edges.length, `Edge count: ${path}`)
    source.nodes.forEach((node, i) => {
      const localized = translated.nodes[i]
      for (const key of ['id', 'tone']) assert.equal(localized[key], node[key], `${path}.nodes.${i}.${key}`)
      for (const key of ['label', 'detail']) text(node[key], localized[key], course, `${path}.nodes.${i}.${key}`)
    })
    source.edges.forEach((edge, i) => {
      for (const key of ['from', 'to']) assert.equal(translated.edges[i][key], edge[key], `${path}.edges.${i}.${key}`)
      text(edge.label, translated.edges[i].label, course, `${path}.edges.${i}.label`)
    })
  }

  for (const lesson of lessons) {
    const course = lesson.courseId ?? 'typescript'
    const id = lesson.id
    assert.equal(localizeLesson(lesson, 'en'), lesson, `English source changed: ${id}`)
    const localized = localizeLesson(lesson, 'id')
    for (const key of ['id', 'courseId', 'moduleId', 'minutes', 'language', 'lab', 'code', 'inspectSymbols', 'relatedConcepts']) {
      assert.deepEqual(localized[key], lesson[key], `Lesson contract changed: ${id}.${key}`)
    }
    for (const key of ['title', 'description', 'practice']) text(lesson[key], localized[key], course, `${id}.${key}`)
    for (const key of ['explanation', 'recap']) {
      assert.equal(localized[key].length, lesson[key].length, `${id}.${key} count`)
      lesson[key].forEach((value, i) => text(value, localized[key][i], course, `${id}.${key}.${i}`))
    }
    visual(lesson.visual, localized.visual, course, `${id}.visual`)
    const source = lesson.challenge
    const target = localized.challenge
    for (const key of ['id', 'kind', 'difficulty', 'language', 'code', 'options', 'answer', 'acceptedAnswers', 'answerType', 'solution', 'expectedTypes', 'validationCode', 'runtimeChecks']) {
      assert.deepEqual(target[key], source[key], `Challenge contract changed: ${id}.${key}`)
    }
    for (const key of ['prompt', 'hint', 'explanation', 'topic']) text(source[key], target[key], course, `${id}.challenge.${key}`)
    // Check:/Apply: titles are composed from the already checked lesson title.
    if (!/^(Check|Apply):/.test(source.title)) text(source.title, target.title, course, `${id}.challenge.title`)
    if (source.options) {
      assert.equal(target.optionLabels?.length, source.options.length, `Option label count: ${id}`)
      assert.equal(new Set(target.optionLabels).size, new Set(source.options).size, `Ambiguous translated options: ${id}`)
      source.options.forEach((option, i) => text(option, target.optionLabels[i], course, `${id}.options.${i}`))
    }
    if (lesson.comparison) {
      for (const key of ['before', 'after']) assert.equal(localized.comparison[key], lesson.comparison[key], `Comparison code changed: ${id}.${key}`)
      for (const key of ['beforeLabel', 'afterLabel']) text(lesson.comparison[key], localized.comparison[key], course, `${id}.${key}`)
    }
    assert.equal(localized.steps?.length, lesson.steps?.length, `Step count: ${id}`)
    lesson.steps?.forEach((step, i) => {
      for (const key of ['line', 'value']) assert.equal(localized.steps[i][key], step[key], `Step execution changed: ${id}.${i}.${key}`)
      for (const key of ['label', 'explanation']) text(step[key], localized.steps[i][key], course, `${id}.steps.${i}.${key}`)
    })
  }
  for (const concept of concepts) {
    const lesson = getLesson(concept.lessonId)
    assert.ok(lesson, `Missing concept lesson: ${concept.id}`)
    const localized = localizeConcept(concept, lesson, 'id')
    const course = concept.courseId ?? lesson.courseId ?? 'typescript'
    assert.equal(localizeConcept(concept, lesson, 'en'), concept)
    for (const key of ['id', 'lessonId', 'courseId', 'language', 'code']) assert.equal(localized[key], concept[key], `Concept contract changed: ${concept.id}.${key}`)
    for (const key of ['title', 'description', 'category']) text(concept[key], localized[key], course, `${concept.id}.${key}`)
    visual(concept.visual, localized.visual, course, `${concept.id}.visual`)
  }
  assert.equal(JSON.stringify({ lessons, concepts }), snapshot, 'Localization mutated source content')
  assert.equal(missing.length, 0, `Missing Indonesian copy (${missing.length} fields):\n${missing.slice(0, 20).join('\n')}`)
  return { lessons: lessons.length, concepts: concepts.length, checkedFields }
}
