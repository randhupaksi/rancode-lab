import type { Challenge } from '../../content/types'
import { analyzeCode } from '../runtime/client'
import { assertionHelpers } from './assertionHelpers'

export async function gradeFillChallenge(challenge: Challenge, answer: string): Promise<boolean> {
  const value = answer.trim()
  if (!challenge.answerType) return [challenge.answer, ...(challenge.acceptedAnswers ?? [])].some(expected => value === expected.trim())
  // This field accepts one type expression, never statements or diagnostic suppression.
  if (!value || value.length > 1000 || /;|\/\/|\/\*|@ts-/.test(value)) return false
  const code = `${challenge.code.replace('___', value)}\n${assertionHelpers}\ntype __RancodeLabFilled = ${value};\ntype __RancodeLabExpected = __RancodeLabAssert<__RancodeLabEqual<__RancodeLabFilled, ${challenge.answerType}>>;`
  const result = await analyzeCode(code, [])
  return !result.diagnostics.some(diagnostic => diagnostic.category === 'error')
}
