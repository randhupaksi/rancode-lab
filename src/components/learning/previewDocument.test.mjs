import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { runInNewContext } from 'node:vm'
import ts from 'typescript-browser'

const source = await readFile(new URL('./previewDocument.ts', import.meta.url), 'utf8')
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
})
const { previewDocument, previewSandbox } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`)

class ElementStub {
  attributes = new Map()
  listeners = new Map()
  scrollCalls = 0
  focusCalls = []

  constructor(attributes = {}) {
    for (const [name, value] of Object.entries(attributes)) this.attributes.set(name, value)
  }

  getAttribute(name) { return this.attributes.get(name) ?? null }
  hasAttribute(name) { return this.attributes.has(name) }
  setAttribute(name, value) { this.attributes.set(name, value) }
  removeAttribute(name) { this.attributes.delete(name) }
  scrollIntoView() { this.scrollCalls++ }
  focus(options) { this.focusCalls.push(options) }
  addEventListener(name, callback, options) { this.listeners.set(name, { callback, once: options?.once }) }
  dispatch(name) {
    const listener = this.listeners.get(name)
    if (!listener) return
    listener.callback()
    if (listener.once) this.listeners.delete(name)
  }
}

class AnchorStub extends ElementStub {}

// These fixtures execute the real bootstrap; they do not simulate browser rendering.
function bootstrapHarness(targets = new Map()) {
  const events = new Map()
  const lookups = []
  const scrollCalls = []
  const messages = []
  const html = previewDocument('<h2 id="lesson">Synthetic lesson</h2>', 'en', 'preview-test')
  const script = /<script>([\s\S]*?)<\/script>/.exec(html)?.[1]
  assert.ok(script, 'The generated document must include the event bootstrap')
  runInNewContext(script, {
    addEventListener: (name, callback) => events.set(name, callback),
    HTMLAnchorElement: AnchorStub,
    document: { getElementById: (id) => { lookups.push(id); return targets.get(id) ?? null } },
    scrollTo: (...coordinates) => scrollCalls.push(coordinates),
    parent: { postMessage: (...message) => messages.push(message) },
  }, { timeout: 500 })
  return { events, lookups, scrollCalls, messages }
}

function eventStub(properties) {
  return {
    defaultPrevented: false,
    preventDefaultCalls: 0,
    preventDefault() { this.defaultPrevented = true; this.preventDefaultCalls++ },
    ...properties,
  }
}

function submit(harness, formMethod, submitterMethod) {
  const target = new ElementStub(formMethod === undefined ? {} : { method: formMethod })
  const event = eventStub({
    target,
    submitter: submitterMethod === undefined ? null : new ElementStub({ formmethod: submitterMethod }),
  })
  harness.events.get('submit')(event)
  return event
}

function click(harness, href) {
  const anchor = new AnchorStub(href === undefined ? {} : { href })
  const child = new ElementStub()
  const event = eventStub({ target: child, composedPath: () => [child, anchor] })
  harness.events.get('click')(event)
  return event
}

test('normal form submissions stay local, including a submitter override on a dialog form', () => {
  const harness = bootstrapHarness()
  for (const method of [undefined, 'get', 'post', '']) {
    const event = submit(harness, method)
    assert.equal(event.defaultPrevented, true, `Expected cancellation for ${method ?? 'default GET'}`)
    assert.equal(event.preventDefaultCalls, 1)
  }
  assert.equal(submit(harness, 'dialog', 'post').defaultPrevented, true)
  assert.equal(submit(harness, 'dialog', '').defaultPrevented, true, 'An empty override must not inherit dialog behavior')
})

test('native dialog submissions are left uncanceled, respecting the submitter formmethod', () => {
  const harness = bootstrapHarness()
  for (const method of ['dialog', ' DIALOG ']) {
    assert.equal(submit(harness, method).defaultPrevented, false)
  }
  assert.equal(submit(harness, 'post', 'dialog').defaultPrevented, false)
  assert.equal(submit(harness, undefined, 'DIALOG').defaultPrevented, false)
  const event = eventStub({ target: new ElementStub({ method: 'dialog' }), submitter: new ElementStub() })
  harness.events.get('submit')(event)
  assert.equal(event.defaultPrevented, false, 'A submitter without formmethod inherits the form method')
})

test('a fragment clicked through a child scrolls and focuses a target in the iframe document', () => {
  const target = new ElementStub()
  const harness = bootstrapHarness(new Map([['lesson', target]]))
  const event = click(harness, '#lesson')
  assert.equal(event.defaultPrevented, true, 'The inherited parent base URL must not handle this link')
  assert.deepEqual(harness.lookups, ['lesson'])
  assert.equal(target.scrollCalls, 1)
  assert.equal(target.focusCalls.length, 1)
  assert.equal(target.focusCalls[0].preventScroll, true)
  assert.equal(target.getAttribute('tabindex'), '-1', 'A heading needs temporary programmatic focusability')
  target.dispatch('blur')
  assert.equal(target.hasAttribute('tabindex'), false)
  assert.equal(target.listeners.has('blur'), false)
  assert.deepEqual(harness.messages, [], 'Fragment handling must not ask the parent to navigate')
})

test('encoded fragment IDs resolve literally and existing tabindex values are preserved', () => {
  const target = new ElementStub({ tabindex: '0' })
  const id = 'lesson café / [1]'
  const harness = bootstrapHarness(new Map([[id, target]]))
  assert.equal(click(harness, `#${encodeURIComponent(id)}`).defaultPrevented, true)
  assert.deepEqual(harness.lookups, [id])
  assert.equal(target.scrollCalls, 1)
  assert.equal(target.focusCalls.length, 1)
  target.dispatch('blur')
  assert.equal(target.getAttribute('tabindex'), '0')
})

test('missing and malformed fragment targets are canceled without scrolling or focusing', () => {
  const target = new ElementStub()
  const harness = bootstrapHarness(new Map([['lesson', target]]))
  assert.equal(click(harness, '#missing').defaultPrevented, true)
  for (const href of ['#%', '#%ZZ', '#%E0%A4%A']) {
    assert.doesNotThrow(() => assert.equal(click(harness, href).defaultPrevented, true))
  }
  assert.deepEqual(harness.lookups, ['missing'], 'Malformed IDs should not reach document lookup')
  assert.deepEqual(harness.scrollCalls, [])
  assert.equal(target.scrollCalls, 0)
  assert.equal(target.focusCalls.length, 0)
  assert.deepEqual(harness.messages, [])
})

test('an empty fragment scrolls to the document start and other links keep their native behavior', () => {
  const harness = bootstrapHarness()
  assert.equal(click(harness, '#').defaultPrevented, true)
  assert.deepEqual(harness.scrollCalls, [[0, 0]])
  assert.deepEqual(harness.lookups, [])
  for (const href of [undefined, '/learn/html', 'https://example.invalid/#lesson']) {
    assert.equal(click(harness, href).defaultPrevented, false)
  }
})

test('preview documents preserve network restrictions and an opaque sandbox while allowing forms', () => {
  const code = '<p>Synthetic lesson</p>'
  for (const locale of ['en', 'id']) {
    const html = previewDocument(code, locale, 'preview-test')
    assert.ok(html.startsWith(`<!doctype html><html lang="${locale}">`))
    assert.ok(html.endsWith(`<body>${code}</body></html>`))
    const policy = /http-equiv="Content-Security-Policy" content="([^"]+)"/.exec(html)?.[1]
    assert.ok(policy)
    const directives = new Map(policy.split(';').map(value => {
      const [name, ...tokens] = value.trim().split(/\s+/)
      return [name, tokens.join(' ')]
    }))
    for (const directive of ['default-src', 'connect-src', 'form-action', 'base-uri']) {
      assert.equal(directives.get(directive), "'none'", `${directive} must stay blocked`)
    }
    assert.equal(directives.get('img-src'), 'data:')
  }
  assert.deepEqual(new Set(previewSandbox.split(/\s+/)), new Set(['allow-scripts', 'allow-forms']))
})
