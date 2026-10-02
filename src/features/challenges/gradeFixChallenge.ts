import type { Challenge } from '../../content/types'
import { analyzeCode } from '../runtime/client'

export interface ChallengeFeedback { success: boolean; message: string }

// These helpers and the authored fixture are checked in the TypeScript worker only.
// Comparing aliases by their printed name cannot detect a changed property contract.
const assertionHelpers = `
type __UnderCodeAssert<T extends true> = T;
type __UnderCodeShape<T> = { [K in keyof T]: T[K] };
type __UnderCodeEqual<A, B> =
  0 extends (1 & A) ? false :
  0 extends (1 & B) ? false :
  (<T>() => T extends A ? 1 : 2) extends
  (<T>() => T extends B ? 1 : 2)
    ? (<T>() => T extends B ? 1 : 2) extends
      (<T>() => T extends A ? 1 : 2) ? true : false
    : false;
`

export async function gradeFixChallenge(challenge: Challenge, code: string): Promise<ChallengeFeedback> {
  const fail = (message: string): ChallengeFeedback => ({ success: false, message })
  if (!code.trim()) return fail('Keep the example and fix its types. An empty program does not solve this challenge.')
  if (/@ts-(?:ignore|nocheck|expect-error)\b/.test(code)) return fail('Fix the type error directly. Suppressing the compiler check does not solve this challenge.')

  // Analyze the untouched learner snippet first so diagnostic lines always match the editor.
  const result = await analyzeCode(code, Object.keys(challenge.expectedTypes ?? {}))
  const errors = result.diagnostics.filter((diagnostic) => diagnostic.category === 'error')
  if (errors.length) return fail(`Not quite yet. Line ${errors[0].line}: ${errors[0].message}`)

  const actualTypes = new Map(result.types.map((type) => [type.name, type.type]))
  const unmet = Object.entries(challenge.expectedTypes ?? {}).filter(([name, type]) => actualTypes.get(name)?.replace(/\s/g, '') !== type.replace(/\s/g, ''))
  if (unmet.length) return fail(`Your code compiles. Now make ${unmet.map(([name, type]) => `${name} have type ${type}`).join(', ')} to meet the challenge.`)
  if (code.trim() === challenge.code.trim()) return fail('Make your change to the example, then check again.')

  if (challenge.validationCode) {
    const checked = await analyzeCode(`${code}\n\n${assertionHelpers}\n${challenge.validationCode}`, [])
    if (checked.diagnostics.some((diagnostic) => diagnostic.category === 'error')) {
      return fail('Your code compiles, but an original type or function contract changed. Keep the required types, properties, and function signatures from the starter, then fix the values or implementation. Open the hint for guidance.')
    }
  }

  return { success: true, message: challenge.explanation }
}
