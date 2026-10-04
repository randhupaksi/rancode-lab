import assert from 'node:assert/strict'
import { before, after, test } from 'node:test'
import { readFile } from 'node:fs/promises'
import { Script } from 'node:vm'
import { createServer } from 'vite'
import ts from 'typescript-browser'
import { readCompilerLibraries } from '../../../scripts/compiler-libraries.mjs'

let server, lessons, gradeFixChallenge, gradeFillChallenge
async function load(path, transform = source => source) {
  const source = transform(await readFile(new URL(path, import.meta.url), 'utf8'))
  const out = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } }).outputText
  return import(`data:text/javascript;base64,${Buffer.from(out).toString('base64')}`)
}
before(async () => {
  server = await createServer({ configFile: false, server: { middlewareMode: true, hmr: false, ws: false, watch: null }, optimizeDeps: { noDiscovery: true, include: [] }, appType: 'custom' })
  const modules = await Promise.all(['getting-started', 'type-system', 'functions', 'structures', 'advanced-types', 'generics', 'real-world'].map(name => server.ssrLoadModule(`/src/content/${name}.ts`)))
  lessons = modules.flatMap(module => Object.values(module).flat())
  globalThis.__gradingCompiler = ts
  globalThis.__gradingLibraries = Object.fromEntries(await readCompilerLibraries())
  let response
  globalThis.self = { postMessage: value => { response = value } }
  await load('../runtime/typescript.worker.ts', source => source
    .replace("import ts from 'typescript-browser'", 'const ts = globalThis.__gradingCompiler')
    .replace("import rawLibraries from '../../generated/compiler-libraries'", 'const rawLibraries = globalThis.__gradingLibraries'))
  globalThis.__gradingAnalyze = async (code, symbols = []) => {
    self.onmessage({ data: { id: 1, code, symbols } })
    assert.equal(response.error, undefined)
    return response.result
  }
  // Transport replacement only: use the real compiler and authored runtime harness.
  // Actual iframe isolation/timeouts remain the production runner's responsibility.
  globalThis.__gradingRun = async code => {
    const { javascript } = await globalThis.__gradingAnalyze(code)
    const output = []
    try {
      new Script(javascript).runInNewContext({ console: { log: (...values) => output.push(values.map(String).join(' ')) } }, { timeout: 500 })
      return { output }
    } catch (error) { return { output, error: String(error) } }
  }
  globalThis.__gradingAssertions = (await load('./assertionHelpers.ts')).assertionHelpers
  const dependencies = source => source
    .replace("import { analyzeCode } from '../runtime/client'", 'const analyzeCode = globalThis.__gradingAnalyze')
    .replace("import { assertionHelpers } from './assertionHelpers'", 'const assertionHelpers = globalThis.__gradingAssertions')
  ;({ gradeFixChallenge } = await load('./gradeFixChallenge.ts', source => dependencies(source).replace("import { runCode } from '../runtime/runner'", 'const runCode = globalThis.__gradingRun')))
  ;({ gradeFillChallenge } = await load('./gradeFillChallenge.ts', dependencies))
})
after(async () => {
  await server?.close()
  for (const key of ['self', '__gradingCompiler', '__gradingLibraries', '__gradingAnalyze', '__gradingRun', '__gradingAssertions']) delete globalThis[key]
})

test('authored repairs pass and broken starters fail', async () => {
  for (const lesson of lessons.filter(item => item.challenge.kind === 'fix')) {
    const challenge = lesson.challenge
    assert.equal((await gradeFixChallenge(challenge, challenge.code)).success, false, lesson.id)
    assert.equal((await gradeFixChallenge(challenge, challenge.solution)).success, true, lesson.id)
  }
})
test('matching types cannot hide incorrect function behavior', async () => {
  const length = lessons.find(item => item.id === 'return-types').challenge
  assert.equal((await gradeFixChallenge(length, length.solution.replace('return text.length;', 'return 999;'))).success, false)
  const union = lessons.find(item => item.id === 'narrowing').challenge
  const constant = union.solution.replace('if (result.ok) return result.data;\n  return result.error;', 'return "";')
  assert.notEqual(constant, union.solution)
  assert.equal((await gradeFixChallenge(union, constant)).success, false)
  const summary = lessons.find(item => item.id === 'final-challenge').challenge
  assert.equal((await gradeFixChallenge(summary, summary.solution.replace('total: lessons.length,', 'total: 999,'))).success, false)
})
test('equivalent implementations and object property ordering remain valid', async () => {
  const length = lessons.find(item => item.id === 'return-types').challenge
  assert.equal((await gradeFixChallenge(length, length.solution.replace('return text.length;', 'return text.split("").length;'))).success, true)
  const summary = lessons.find(item => item.id === 'final-challenge').challenge
  const reordered = summary.solution.replace(/total: lessons.length,\s*completed: lessons.filter\(lesson => lesson.status === "complete"\).length,/, 'completed: lessons.filter(lesson => lesson.status === "complete").length,\n    total: lessons.length,')
  assert.notEqual(reordered, summary.solution)
  assert.equal((await gradeFixChallenge(summary, reordered)).success, true)
})
test('type blanks accept equivalent syntax while rejecting different contracts', async () => {
  const challenge = lessons.find(item => item.id === 'arrays').challenge
  for (const answer of ['string[]', 'Array<string>', 'Array< string >', '(string)[]', 'string [ ]']) assert.equal(await gradeFillChallenge(challenge, answer), true, answer)
  for (const answer of ['number[]', 'any', 'any[]', 'readonly string[]', 'string | number[]', 'string[]; const bypass = 1', 'string[] // @ts-ignore']) assert.equal(await gradeFillChallenge(challenge, answer), false, answer)
  for (const lesson of lessons.filter(item => item.challenge.kind === 'fill')) assert.equal(await gradeFillChallenge(lesson.challenge, lesson.challenge.answer), true, lesson.id)
})
