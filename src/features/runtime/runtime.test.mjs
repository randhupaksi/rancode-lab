import assert from 'node:assert/strict'
import { readFile, readdir } from 'node:fs/promises'
import test from 'node:test'
import ts from 'typescript-browser'

async function loadSource(relativePath, transform = (value) => value) {
  const source = transform(await readFile(new URL(relativePath, import.meta.url), 'utf8'))
  const { outputText } = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext } })
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)
}

test('compiler provides real literals, standard library inference, generics, and positioned diagnostics', async () => {
  const libraryRoot = new URL('../../../node_modules/typescript-browser/lib/', import.meta.url)
  const entries = await readdir(libraryRoot)
  globalThis.__undercodeTestCompiler = ts
  globalThis.__undercodeTestLibraries = Object.fromEntries(await Promise.all(entries.filter((name) => /^lib\..*\.d\.ts$/.test(name)).map(async (name) => [name, await readFile(new URL(name, libraryRoot), 'utf8')])))
  let response
  globalThis.self = { postMessage: (message) => { response = message } }
  await loadSource('./typescript.worker.ts', (source) => source
    .replace("import ts from 'typescript-browser'", 'const ts = globalThis.__undercodeTestCompiler')
    .replace(/const rawLibraries = import\.meta\.glob\([\s\S]*?as Record<string, string>/, 'const rawLibraries = globalThis.__undercodeTestLibraries'))

  function analyze(code, symbols = []) {
    self.onmessage({ data: { id: 1, code, symbols } })
    assert.equal(response.error, undefined)
    return response.result
  }

  const inferred = analyze('const greeting = "hello"; let count = 3; const names = ["Ada"]; const upper = names.map(name => name.toUpperCase());', ['greeting', 'count', 'upper'])
  assert.deepEqual(inferred.diagnostics, [])
  assert.deepEqual(inferred.types.map(({ name, type }) => ({ name, type })), [
    { name: 'greeting', type: '"hello"' }, { name: 'count', type: 'number' }, { name: 'upper', type: 'string[]' },
  ])

  const generic = analyze('function first<T>(items: T[]): T | undefined { return items[0]; } const item = first([1, 2]);', ['item'])
  assert.equal(generic.types[0].type, 'number | undefined')
  assert.deepEqual(generic.diagnostics, [])

  const invalid = analyze('// incorrect assignment\nconst count: number = "wrong";')
  assert.equal(invalid.diagnostics[0].code, 2322)
  assert.equal(invalid.diagnostics[0].line, 2)
  assert.equal(invalid.diagnostics[0].category, 'error')
  assert.match(invalid.diagnostics[0].message, /not assignable/)

  assert.ok(analyze('const item: number = null;').diagnostics.some(({ code }) => code === 2322), 'strict null checking must be enabled')
  assert.ok(analyze('const = ;').diagnostics.length, 'malformed syntax must not silently pass')
  assert.equal(analyze('const value: number = 2;').javascript.includes(': number'), false, 'emitted code must erase annotations')
  delete globalThis.self
  delete globalThis.__undercodeTestCompiler
  delete globalThis.__undercodeTestLibraries
})

test('console formatter handles circular values, bigints, errors, and output limits', async () => {
  const { serializeConsoleValue: format } = await loadSource('./serializeConsole.ts')
  assert.equal(format(undefined), 'undefined')
  assert.equal(format(23n), '23n')
  assert.equal(format(new Error('example failed')), 'Error: example failed')
  assert.equal(format(Symbol('key')), 'Symbol(key)')
  const circular = { name: 'example', count: 2n }
  circular.self = circular
  assert.match(format(circular), /Circular/)
  assert.match(format(circular), /2n/)
  assert.equal(format('a'.repeat(5000)).length, 2000)
  assert.equal(format(Object.create(null)), '{}')
  assert.equal(format({ toJSON() { throw new Error('broken') }, toString() { throw new Error('also broken') } }), '[Unprintable value]')
})

test('analysis client maps out-of-order responses to the correct request and rejects oversized input', async () => {
  const originalWorker = globalThis.Worker
  let instance
  class TestWorker {
    messages = []
    constructor() { instance = this }
    postMessage(message) { this.messages.push(message) }
    terminate() {}
  }
  globalThis.Worker = TestWorker
  try {
    const { analyzeCode } = await loadSource('./client.ts', (source) => source.replace("new URL('./typescript.worker.ts', import.meta.url)", "'test-worker'"))
    const first = analyzeCode('const first = 1')
    const second = analyzeCode('const second = 2')
    const firstId = instance.messages[0].id
    const secondId = instance.messages[1].id
    instance.onmessage({ data: { id: 999, result: { diagnostics: [], types: [], javascript: '' } } })
    const secondResult = { diagnostics: [], types: [{ name: 'second', type: '2', explanation: '' }], javascript: 'const second = 2;' }
    instance.onmessage({ data: { id: secondId, result: secondResult } })
    assert.deepEqual(await second, secondResult)
    const firstResult = { diagnostics: [], types: [{ name: 'first', type: '1', explanation: '' }], javascript: 'const first = 1;' }
    instance.onmessage({ data: { id: firstId, result: firstResult } })
    assert.deepEqual(await first, firstResult)
    await assert.rejects(analyzeCode('a'.repeat(50_001)), /50,000/)
  } finally { globalThis.Worker = originalWorker }
})
