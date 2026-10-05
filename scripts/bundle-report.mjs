import { readFile, readdir, stat } from 'node:fs/promises'
import { gzipSync } from 'node:zlib'

const root = new URL('../dist/', import.meta.url)
const manifest = JSON.parse(await readFile(new URL('.vite/manifest.json', root), 'utf8'))
function dependencies(keys, seen = new Set()) {
  for (const key of keys) {
    if (seen.has(key)) continue
    if (!manifest[key]) throw new Error(`Missing build entry: ${key}`)
    seen.add(key)
    dependencies(manifest[key].imports ?? [], seen)
  }
  return [...seen]
}
const home = dependencies(['index.html', ...(manifest['src/pages/HomePage.tsx'] ? ['src/pages/HomePage.tsx'] : [])])
const homeFiles = [...new Set(home.map(key => manifest[key].file))]
const homeBuffers = await Promise.all(homeFiles.map(file => readFile(new URL(file, root))))
const assets = await readdir(new URL('assets/', root))
const worker = assets.find(file => /^typescript\.worker-.*\.js$/.test(file))
if (!worker) throw new Error('TypeScript worker missing from build')
const workerBytes = (await stat(new URL(`assets/${worker}`, root))).size
const fontFiles = assets.filter(file => file.endsWith('.woff2'))
const fonts = await Promise.all(fontFiles.map(file => stat(new URL(`assets/${file}`, root))))
const homeCss = [...new Set(home.flatMap(key => manifest[key].css ?? []))]
const cssBuffers = await Promise.all(homeCss.map(file => readFile(new URL(file, root))))
const curriculum = {}
for (const [key, entry] of Object.entries(manifest)) {
  if (!key.startsWith('src/generated/catalog/')) continue
  const bytes = await readFile(new URL(entry.file, root))
  curriculum[key.split('/').at(-1).replace('.json', '')] = gzipSync(bytes).length
}
const report = {
  homeJavaScriptBytes: homeBuffers.reduce((sum, bytes) => sum + bytes.length, 0),
  homeJavaScriptGzipBytes: homeBuffers.reduce((sum, bytes) => sum + gzipSync(bytes).length, 0),
  homeCssBytes: cssBuffers.reduce((sum, bytes) => sum + bytes.length, 0),
  homeCssGzipBytes: cssBuffers.reduce((sum, bytes) => sum + gzipSync(bytes).length, 0),
  curriculumGzipBytes: curriculum,
  typeScriptWorkerBytes: workerBytes,
  emittedFontBytes: fonts.reduce((sum, file) => sum + file.size, 0),
  emittedFontFiles: fontFiles.length,
  homeFiles,
}
console.log(JSON.stringify(report, null, 2))
// Transfer-size budgets cover the entire static dependency graph, not just the entry chunk.
if (process.argv.includes('--check')) {
  if (!report.emittedFontFiles) throw new Error('Font assets missing from build')
  const budgets = { homeJavaScriptGzipBytes: 135_000, homeCssGzipBytes: 10_000, typeScriptWorkerBytes: 6_500_000, emittedFontBytes: 60_000 }
  for (const [metric, limit] of Object.entries(budgets)) {
    if (report[metric] > limit) throw new Error(`${metric}: ${report[metric]} exceeds budget ${limit}`)
  }
  for (const [name, size] of Object.entries(curriculum)) {
    const limit = name.startsWith('meta-') ? 60_000 : name.startsWith('reference-') ? 115_000 : name.startsWith('challenges-') ? 100_000 : name.startsWith('search-') ? 105_000 : name.startsWith('playground-') ? 10_000 : 50_000
    if (size > limit) throw new Error(`Curriculum ${name}: ${size} exceeds budget ${limit}`)
  }
  if (Object.keys(curriculum).length < 32) throw new Error('Curriculum resources missing from build')
  if (homeFiles.some(file => /CodeEditor|typescript\.worker|SearchDialog|catalog|ContentBoundary|(?:meta|reference|challenges|search)-(?:en|id)/.test(file))) {
    throw new Error('An optional editor, compiler, or search feature leaked into the home graph')
  }
}
