import type { Challenge } from '../../content/types'
import { analyzeCode } from '../runtime/client'
import { runCode } from '../runtime/runner'
import { assertionHelpers } from './assertionHelpers'

export interface ChallengeFeedback { success: boolean; message: string }

// These helpers and the authored fixture are checked in the TypeScript worker only.
// Comparing aliases by their printed name cannot detect a changed property contract.
export async function gradeFixChallenge(challenge: Challenge, code: string, locale: 'en' | 'id' = 'en'): Promise<ChallengeFeedback> {
  const copy = (english: string, indonesian: string) => locale === 'id' ? indonesian : english
  const fail = (message: string): ChallengeFeedback => ({ success: false, message })
  if (!code.trim()) return fail(copy('Keep the example and fix its types. An empty program does not solve this challenge.', 'Pertahankan contohnya, lalu perbaiki type-nya. Mengosongkan program belum menyelesaikan tantangan ini.'))
  if (/@ts-(?:ignore|nocheck|expect-error)\b/.test(code)) return fail(copy('Fix the type error directly. Suppressing the compiler check does not solve this challenge.', 'Perbaiki error type-nya langsung. Menonaktifkan pemeriksaan compiler belum menyelesaikan tantangan ini.'))

  // Analyze the untouched learner snippet first so diagnostic lines always match the editor.
  const result = await analyzeCode(code, Object.keys(challenge.expectedTypes ?? {}))
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.category === 'error')
  if (errors.length) return fail(copy(`Not quite yet. Line ${errors[0].line}: ${errors[0].message}`, `Masih ada error di baris ${errors[0].line}. Pesan TypeScript: ${errors[0].message}`))

  const actualTypes = new Map(result.types.map((type) => [type.name, type.type]))
  const unmet = Object.entries(challenge.expectedTypes ?? {}).filter(([name, type]) => actualTypes.get(name)?.replace(/\s/g, '') !== type.replace(/\s/g, ''))
  if (unmet.length) return fail(copy(`Your code compiles. Now make ${unmet.map(([name, type]) => `${name} have type ${type}`).join(', ')} to meet the challenge.`, `Kodemu sudah lolos kompilasi. Sekarang sesuaikan type-nya: ${unmet.map(([name, type]) => `${name} perlu bertipe ${type}`).join(', ')}.`))
  if (code.trim() === challenge.code.trim()) return fail(copy('Make your change to the example, then check again.', 'Coba ubah contohnya dulu, lalu periksa lagi.'))

  if (challenge.validationCode) {
    const checked = await analyzeCode(`${code}\n\n${assertionHelpers}\n${challenge.validationCode}`, [])
    if (checked.diagnostics.some((diagnostic) => diagnostic.category === 'error')) {
      return fail(copy('Your code compiles, but an original type or function contract changed. Keep the required types, properties, and function signatures from the starter, then fix the values or implementation. Open the hint for guidance.', 'Kodemu sudah lolos kompilasi, tetapi ada kontrak type atau function awal yang berubah. Pertahankan type, properti, dan signature function yang diminta, lalu perbaiki nilai atau implementasinya. Buka petunjuk kalau perlu arahan.'))
    }
  }

  if (challenge.runtimeChecks?.length) {
    const marker = `undercode-check-${crypto.randomUUID()}`
    const cases = challenge.runtimeChecks.map(check => `__UnderCodeMatches(${check.expression}, ${JSON.stringify(check.expected)})`)
    const compare = `function __UnderCodeMatches(value: unknown, expected: unknown): boolean {
      if (Object.is(value, expected)) return true;
      if (!value || !expected || typeof value !== "object" || typeof expected !== "object") return false;
      if (Array.isArray(value) !== Array.isArray(expected)) return false;
      const actual = value as Record<string, unknown>, target = expected as Record<string, unknown>;
      const keys = Object.keys(target);
      return Object.keys(actual).length === keys.length && keys.every(key => Object.hasOwn(actual, key) && __UnderCodeMatches(actual[key], target[key]));
    }`
    const execution = await runCode(`${code}\n${compare}\nconsole.log(${JSON.stringify(marker)}, [${cases.join(', ')}].every(Boolean));`)
    if (execution.error || !execution.output.includes(`${marker} true`)) {
      return fail(copy('The types fit, but the function does not yet return the expected results for every input. Try an empty value and both branches, then check again.', 'Type-nya sudah cocok, tetapi hasil function belum sesuai untuk semua input. Coba nilai kosong dan kedua cabangnya, lalu periksa lagi.'))
    }
  }

  return { success: true, message: challenge.explanation }
}
