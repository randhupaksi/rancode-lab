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
const home = dependencies(['index.html', 'src/pages/HomePage.tsx'])
const homeFiles = [...new Set(home.map(key => manifest[key].file))]
const homeBuffers = await Promise.all(homeFiles.map(file => readFile(new URL(file, root))))
const assets = await readdir(new URL('assets/', root))
const worker = assets.find(file => /^typescript\.worker-.*\.js$/.test(file))
if (!worker) throw new Error('TypeScript worker missing from build')
const workerBytes = (await stat(new URL(`assets/${worker}`, root))).size
const fontFiles = assets.filter(file => file.endsWith('.woff2'))
const fonts = await Promise.all(fontFiles.map(file => stat(new URL(`assets/${file}`, root))))
const report = {
  homeJavaScriptBytes: homeBuffers.reduce((sum, bytes) => sum + bytes.length, 0),
  homeJavaScriptGzipBytes: homeBuffers.reduce((sum, bytes) => sum + gzipSync(bytes).length, 0),
  typeScriptWorkerBytes: workerBytes,
  emittedFontBytes: fonts.reduce((sum, file) => sum + file.size, 0),
  emittedFontFiles: fontFiles.length,
  homeFiles,
}
console.log(JSON.stringify(report, null, 2))
// Transfer-size budgets cover the entire static dependency graph, not just the entry chunk.
if (process.argv.includes('--check')) {
  if (!report.emittedFontFiles) throw new Error('Font assets missing from build')
  const budgets = { homeJavaScriptGzipBytes: 175_000, typeScriptWorkerBytes: 6_500_000, emittedFontBytes: 60_000 }
  for (const [metric, limit] of Object.entries(budgets)) {
    if (report[metric] > limit) throw new Error(`${metric}: ${report[metric]} exceeds budget ${limit}`)
  }
  if (homeFiles.some(file => /CodeEditor|typescript\.worker|SearchDialog/.test(file))) {
    throw new Error('An optional editor, compiler, or search feature leaked into the home graph')
  }
}
