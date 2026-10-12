import { readFile } from 'node:fs/promises'
const locales = ['id', 'en']
const blockKinds = new Set(['paragraph', 'list', 'note'])
function assertText(value, label) {
  if (typeof value !== 'string' || !value.trim() || value.includes('�')) throw new Error('Invalid learning copy: ' + label)
  if ((value.split(String.fromCharCode(96)).length - 1) % 2) throw new Error('Unpaired inline code: ' + label)
}
export function validateLearningCopy(copy, lessons) {
  const known = new Map(lessons.map(lesson => [lesson.id, lesson]))
  for (const [id, entry] of Object.entries(copy)) {
    if (!known.has(id)) throw new Error('Unknown lesson in learning copy: ' + id)
    for (const locale of locales) {
      const text = entry[locale]
      if (!text) throw new Error('Missing ' + locale + ' learning copy: ' + id)
      for (const field of Object.keys(text)) if (!['description', 'hint', 'quizExplanation', 'blocks', 'practiceSteps', 'recap', 'expected', 'visualDetails'].includes(field)) throw new Error('Unsupported learning-copy field: ' + id + '.' + field)
      for (const field of ['description', 'hint', 'quizExplanation']) if (text[field] !== undefined) assertText(text[field], id + '.' + field)
      if (text.blocks) {
        if (!text.blocks.length) throw new Error('Empty reading: ' + id)
        for (const block of text.blocks) {
          if (!blockKinds.has(block.kind)) throw new Error('Unknown reading block: ' + id)
          if (block.kind === 'list') {
            if (!block.items?.length) throw new Error('Empty reading list: ' + id)
            block.items.forEach(item => assertText(item, id))
          } else assertText(block.text, id)
          if (block.title !== undefined) assertText(block.title, id)
        }
      }
      for (const field of ['practiceSteps', 'recap', 'visualDetails']) if (text[field]) {
        if (!text[field].length) throw new Error('Empty ' + field + ': ' + id)
        text[field].forEach(item => assertText(item, id))
      }
      if (text.expected) assertText(text.expected, id)
      if (text.visualDetails && text.visualDetails.length !== known.get(id).visual.nodes.length) throw new Error('Different canvas structure: ' + id)
    }
    const shape = locale => entry[locale].blocks?.map(block => [block.kind, block.items?.length, block.ordered ?? false])
    if (JSON.stringify(shape('id')) !== JSON.stringify(shape('en')) || entry.id.practiceSteps?.length !== entry.en.practiceSteps?.length) throw new Error('Different bilingual structure: ' + id)
  }
  if (Object.keys(copy).length !== lessons.length) throw new Error('Learning copy must cover every lesson')
}
export async function loadLearningCopy(courses, lessons) {
  const copy = Object.assign({}, ...await Promise.all(courses.map(async course => JSON.parse(await readFile(new URL('../src/content/learning-copy/' + course.id + '.json', import.meta.url), 'utf8')))))
  validateLearningCopy(copy, lessons)
  return copy
}
const plain = text => text.split(String.fromCharCode(96)).join('')
export function applyLearningCopy(lesson, locale, copy) {
  const text = copy[lesson.id]?.[locale]
  if (!text) throw new Error('Missing authored learning copy: ' + lesson.id)
  const explanation = text.blocks?.flatMap(block => block.kind === 'list' ? block.items.map(plain) : [plain(block.text)]) ?? lesson.explanation
  return {
    ...lesson,
    ...(text.description ? { description: plain(text.description) } : {}),
    explanation,
    visual: { ...lesson.visual, nodes: lesson.visual.nodes.map((node, index) => ({ ...node, detail: text.visualDetails ? plain(text.visualDetails[index]) : text.description && node.detail === lesson.description ? plain(text.description) : node.detail })) },
    ...(text.practiceSteps ? { practice: text.practiceSteps.map(plain).join(' ') } : {}),
    ...(text.recap ? { recap: text.recap.map(plain) } : {}),
    reading: { blocks: text.blocks ?? lesson.explanation.map(paragraph => ({ kind: 'paragraph', text: paragraph })), practiceSteps: text.practiceSteps, expected: text.expected },
    challenge: { ...lesson.challenge, ...(text.hint ? { hint: text.hint } : {}), ...(text.quizExplanation ? { explanation: text.quizExplanation } : {}) },
  }
}

/** Keep lesson and reference views aligned without changing source objects or custom diagrams. */
export function applyConceptLearningCopy(concept, original, revised) {
  return {
    ...concept,
    description: concept.description === original.description ? revised.description : concept.description,
    ...(concept.visual && JSON.stringify(concept.visual) === JSON.stringify(original.visual) ? { visual: revised.visual } : {}),
  }
}
