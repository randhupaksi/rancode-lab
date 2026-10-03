import { readFile } from 'node:fs/promises'

/** Resolve the same official library graph used by the browser compiler. */
export async function readCompilerLibraries() {
  const root = new URL('../node_modules/typescript-browser/lib/', import.meta.url)
  const libraries = new Map()
  async function visit(name) {
    if (libraries.has(name)) return
    const text = await readFile(new URL(name, root), 'utf8')
    libraries.set(name, text)
    for (const match of text.matchAll(/<reference\s+lib="([^"]+)"/g)) {
      await visit(`lib.${match[1]}.d.ts`)
    }
  }
  await visit('lib.es2022.d.ts')
  await visit('lib.dom.d.ts')
  return libraries
}
