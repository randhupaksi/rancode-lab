import type { Lesson } from './types'
import { flow, node } from './visuals'

export const gettingStarted: Lesson[] = [
  {
    id: 'why-typescript', title: 'Why TypeScript?', moduleId: 'getting-started', minutes: 5,
    description: 'Catch a mismatch before your code reaches a user.',
    explanation: [
      'JavaScript can run a function with values its author never intended. A price formatter expects a number, but a string from a form can slip through and fail later. TypeScript describes those expectations and checks them while you write.',
      'A type is a description of the values a piece of code accepts. In this example, price must be a number and the result is a string. Change the argument to "19.5" and inspect the diagnostic: the checker catches the mismatch before execution.',
      'TypeScript removes type annotations when it produces JavaScript. Its checker does not run alongside your app, validate an API response, or prevent every bug. You still need runtime checks at the boundaries where data arrives.',
    ],
    code: 'function formatPrice(price: number): string {\n  return "$" + price.toFixed(2);\n}\n\nconst receipt = formatPrice(19.5);',
    inspectSymbols: ['formatPrice', 'receipt'],
    visual: flow('An earlier feedback loop', 'A type contract connects the value you provide with the operation the function can safely perform.', [
      node('price', '19.5', 'A number is a valid input to this contract.', 'value'),
      node('contract', 'price: number', 'The checker verifies the argument before the app runs.', 'type'),
      node('result', '"$19.50"', 'toFixed is available on numbers; the result is a string.', 'value'),
    ]),
    challenge: { id: 'why-typescript-check', title: 'What can the checker catch?', topic: 'Foundations', difficulty: 'Beginner', kind: 'choice', prompt: 'Which problem can this type signature catch before running the code?', code: 'function formatPrice(price: number): string {\n  return "$" + price.toFixed(2);\n}', options: ['Passing "19.5" instead of 19.5', 'An API returning the wrong price tomorrow', 'A user deciding not to buy'], answer: 'Passing "19.5" instead of 19.5', hint: 'Look at the kind of value accepted by the parameter.', explanation: 'A string argument violates the number parameter. TypeScript checks code statically; it cannot guarantee the contents of future network responses or user behavior.' },
    recap: ['Types make expectations explicit.', 'Diagnostics are feedback before execution.', 'TypeScript types are erased and do not validate external data.'],
    relatedConcepts: ['static-checking', 'annotations'],
  },
  {
    id: 'javascript-vs-typescript', title: 'JavaScript vs TypeScript', moduleId: 'getting-started', minutes: 6,
    description: 'Keep JavaScript behavior while adding a layer of checks.',
    explanation: [
      'TypeScript builds on JavaScript. Expressions, loops, objects, and functions still follow JavaScript rules. The extra type syntax helps the checker understand which uses of those constructs you intended.',
      'JavaScript allows 4 + "2" and produces the string "42". A TypeScript function with two number parameters refuses that string argument. It does not change how + works; it points out the mismatch before that call runs.',
      'The comparison shows source code before and after types are removed. Both versions calculate 6 when called with 4 and 2. Try changing the call, then distinguish the checker’s complaint from JavaScript’s runtime behavior.',
    ],
    code: 'function add(left: number, right: number): number {\n  return left + right;\n}\n\nconst total = add(4, 2);',
    inspectSymbols: ['add', 'total'],
    comparison: { beforeLabel: 'JavaScript', afterLabel: 'TypeScript', before: 'function add(left, right) {\n  return left + right;\n}\n\nadd(4, "2"); // "42"', after: 'function add(left: number, right: number): number {\n  return left + right;\n}\n\nadd(4, "2"); // Type error' },
    visual: flow('Types leave; behavior stays', 'Type annotations belong to the checking step. The browser eventually executes JavaScript.', [
      node('source', 'TypeScript source', 'JavaScript plus type annotations such as : number.'),
      node('check', 'Static checking', 'The checker identifies incompatible arguments.', 'type'),
      node('runtime', 'JavaScript runtime', 'Annotations are erased. Ordinary JavaScript behavior remains.', 'value'),
    ]),
    challenge: { id: 'javascript-vs-typescript-check', title: 'Predict JavaScript’s addition', topic: 'Foundations', difficulty: 'Beginner', kind: 'choice', prompt: 'What does JavaScript produce for the expression below?', code: '4 + "2"', options: ['6', '"42"', 'A runtime type error'], answer: '"42"', hint: 'With a string operand, + performs string concatenation here.', explanation: 'The number is converted to a string and concatenated, producing "42". TypeScript helps reject unintended inputs, but does not redefine JavaScript operators.' },
    recap: ['TypeScript extends JavaScript with static checks.', 'Type annotations are removed from emitted JavaScript.', 'A type error and a runtime exception are different things.'],
    relatedConcepts: ['static-checking', 'primitives'],
  },
  {
    id: 'your-first-type', title: 'Your First Type', moduleId: 'getting-started', minutes: 5,
    description: 'Write a contract with a colon and a type.',
    explanation: [
      'Place a type annotation after a variable name: let progress: number = 0. The annotation states which values may be assigned to that variable, including later assignments.',
      'Think of number as a set of allowed values, rather than a label attached to one particular value. Both 0 and 50 belong to that set; "halfway" does not.',
      'Try assigning true or "50" to progress. The assignment is checked against the original annotation. TypeScript will often infer this same contract without an annotation; the next module explores when that happens.',
    ],
    code: 'let progress: number = 0;\nprogress = 50;\n\nconst message: string = "Keep going";\nconst finished: boolean = progress === 100;',
    inspectSymbols: ['progress', 'message', 'finished'],
    visual: flow('One contract, many possible values', 'An annotation constrains every assignment to a variable, not just its initial value.', [
      node('zero', '0 → 50', 'Both values are allowed for progress.', 'value'),
      node('type', 'number', 'The declared contract remains number.', 'type'),
      node('invalid', '"halfway"', 'This string cannot be assigned to progress.', 'error'),
    ], [{ from: 'zero', to: 'type', label: 'accepted' }, { from: 'invalid', to: 'type', label: 'rejected' }]),
    challenge: { id: 'your-first-type-check', title: 'Annotate a completion flag', topic: 'Foundations', difficulty: 'Beginner', kind: 'fill', prompt: 'Replace ___ with the primitive type that accepts true and false', code: 'const isComplete: ___ = false;', answer: 'boolean', answerType: 'boolean', hint: 'This primitive has exactly two possible values.', explanation: 'boolean describes the values true and false. Use the lowercase primitive type, rather than the Boolean wrapper object type.', solution: 'const isComplete: boolean = false;' },
    recap: ['Annotations follow a name and a colon.', 'The type describes a set of valid values.', 'Later assignments must satisfy the same contract.'],
    relatedConcepts: ['annotations', 'primitives'],
  },
]
