import ts from 'typescript-browser'
import type { AnalysisRequest, AnalysisResponse, AnalysisResult, InferredType } from './types'

// Ship official lib definitions with the worker: inference never needs a CDN or network request.
const rawLibraries = import.meta.glob('../../../node_modules/typescript-browser/lib/lib.*.d.ts', {
  query: '?raw', import: 'default', eager: true,
}) as Record<string, string>
const libraries = new Map(Object.entries(rawLibraries).map(([path, text]) => [`/${path.split('/').at(-1)}`, text]))
const sourceCache = new Map<string, ts.SourceFile>()
const fileName = '/lesson.ts'
const options: ts.CompilerOptions = {
  target: ts.ScriptTarget.ES2022,
  module: ts.ModuleKind.ESNext,
  moduleResolution: ts.ModuleResolutionKind.Bundler,
  strict: true,
  noUncheckedIndexedAccess: true,
  exactOptionalPropertyTypes: true,
  skipLibCheck: true,
  noEmit: true,
  lib: ['lib.es2022.d.ts', 'lib.dom.d.ts'],
  types: [],
}

function analyze(code: string, requested: string[]): AnalysisResult {
  // Analyze each snippet as its own module. Appending preserves original line
  // positions, avoids collisions with DOM globals such as `name` and `status`,
  // and permits top-level await. Transpilation below uses the original snippet.
  const analysisCode = `${code}\nexport {};\n`
  const source = ts.createSourceFile(fileName, analysisCode, options.target!, true)
  const host: ts.CompilerHost = {
    getSourceFile: (name, languageVersion) => {
      if (name === fileName) return source
      const text = libraries.get(name)
      if (text === undefined) return undefined
      let cached = sourceCache.get(name)
      if (!cached) {
        cached = ts.createSourceFile(name, text, languageVersion, true)
        sourceCache.set(name, cached)
      }
      return cached
    },
    getDefaultLibFileName: () => '/lib.es2022.d.ts',
    writeFile: () => {},
    getCurrentDirectory: () => '/',
    getDirectories: () => [],
    fileExists: (name) => name === fileName || libraries.has(name),
    readFile: (name) => name === fileName ? analysisCode : libraries.get(name),
    getCanonicalFileName: (name) => name,
    useCaseSensitiveFileNames: () => true,
    getNewLine: () => '\n',
  }
  const program = ts.createProgram([fileName], options, host)
  const checker = program.getTypeChecker()
  const diagnostics = [...program.getSyntacticDiagnostics(source), ...program.getSemanticDiagnostics(source)].map((diagnostic) => {
    const position = source.getLineAndCharacterOfPosition(diagnostic.start ?? 0)
    return {
      message: ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n'),
      line: position.line + 1,
      column: position.character + 1,
      category: diagnostic.category === ts.DiagnosticCategory.Warning ? 'warning' as const : 'error' as const,
      code: diagnostic.code,
    }
  })
  const found = new Map<string, InferredType>()
  const requestedSet = new Set(requested)
  function visit(node: ts.Node) {
    let named: ts.Node | undefined
    let kind = 'expression'
    if (ts.isVariableDeclaration(node) || ts.isParameter(node)) { named = node.name; kind = 'value' }
    else if (ts.isFunctionDeclaration(node) && node.name) { named = node.name; kind = 'function' }
    else if (ts.isTypeAliasDeclaration(node) || ts.isInterfaceDeclaration(node)) { named = node.name; kind = 'type' }
    else if (requestedSet.size && (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node))) named = node
    if (named) {
      const name = named.getText(source)
      if ((!requestedSet.size || requestedSet.has(name)) && !found.has(name) && found.size < 30) {
        const type = checker.typeToString(checker.getTypeAtLocation(named), named, ts.TypeFormatFlags.NoTruncation)
        found.set(name, { name, type, explanation: `TypeScript resolves this ${kind} as ${type}.` })
      }
    }
    ts.forEachChild(node, visit)
  }
  visit(source)
  const types = requested.length ? requested.flatMap((name) => found.has(name) ? [found.get(name)!] : []) : [...found.values()]
  const javascript = ts.transpileModule(code, { compilerOptions: {
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.ESNext,
    // Preserve standalone snippets for the runner's async function wrapper;
    // the analysis-only module marker must never reach executable output.
    moduleDetection: ts.ModuleDetectionKind.Legacy,
  } }).outputText
  return { diagnostics, types, javascript }
}

self.onmessage = ({ data }: MessageEvent<AnalysisRequest>) => {
  let response: AnalysisResponse
  try { response = { id: data.id, result: analyze(data.code, data.symbols) } }
  catch (error) { response = { id: data.id, error: error instanceof Error ? error.message : 'TypeScript could not analyze this snippet.' } }
  self.postMessage(response)
}
