import type { Lesson } from './types'
import { flow, node } from './visuals'

export const functions: Lesson[] = [
  {
    id: 'parameters', title: 'Parameters', moduleId: 'functions', minutes: 5,
    description: 'Make a function’s input expectations visible at its boundary.',
    explanation: [
      'A parameter annotation tells callers what to provide and tells the function body what it can use. In repeatLabel, label is text and count is numeric, so repeat is available and its argument is checked.',
      'Required parameters also describe how many inputs a call needs. Omitting count is a type error. Defaults and optional parameters let you deliberately relax that rule.',
      'A number annotation does not mean a positive whole number. repeat throws for a negative count, so this example checks the value at runtime. Types can describe a broad category while runtime checks enforce a more specific business rule.',
    ],
    code: 'function repeatLabel(label: string, count: number): string {\n  if (!Number.isInteger(count) || count < 0) {\n    return "Choose a non-negative whole number";\n  }\n  return label.repeat(count);\n}\n\nconst banner = repeatLabel("TS ", 3);',
    inspectSymbols: ['repeatLabel', 'banner'],
    visual: flow('The function boundary', 'Parameters define the shape of inputs; value-specific rules still belong in runtime logic.', [
      node('arguments', '"TS ", 3', 'Arguments supplied by this particular caller.', 'value'),
      node('parameters', 'string, number', 'The general contract accepted by the function.', 'type'),
      node('body', 'Validate → repeat', 'The body checks that count is a valid repetition count.'),
    ]),
    challenge: { id: 'parameters-check', title: 'Describe the numeric input', topic: 'Functions', difficulty: 'Beginner', kind: 'fill', prompt: 'Complete the parameter type for a numeric quantity', code: 'function double(quantity: ___) {\n  return quantity * 2;\n}', answer: 'number', answerType: 'number', hint: 'Multiplication here expects a numeric value.', explanation: 'number allows the arithmetic operation. The annotation checks calls as well as how quantity is used inside the function.', solution: 'function double(quantity: number) {\n  return quantity * 2;\n}' },
    recap: ['Parameters are the input side of a contract.', 'Required parameters must be supplied.', 'A type category may still need a runtime value check.'], relatedConcepts: ['parameters', 'annotations'],
  },
  {
    id: 'return-types', title: 'Return Types', moduleId: 'functions', minutes: 6,
    description: 'Connect every return path to a predictable result.',
    explanation: [
      'A return annotation appears after the parameter list. It describes what the caller receives. TypeScript can usually infer it, but an explicit annotation makes a public function’s promise easy to read and protects it from accidental changes.',
      'Every return path must match that promise. If a function sometimes returns a number and sometimes text, an inferred union describes both. An explicit number annotation catches the text branch at the function definition.',
      'void means a function does not promise a useful result to its caller. never means it cannot finish normally, as with a function that always throws. Neither means an asynchronous result; async functions return promises.',
    ],
    code: 'function remaining(total: number, completed: number): number {\n  return Math.max(0, total - completed);\n}\n\nconst count = remaining(30, 8);\n\nfunction fail(message: string): never {\n  throw new Error(message);\n}',
    inspectSymbols: ['remaining', 'count', 'fail'],
    visual: flow('A promise to the caller', 'The declared result is checked against every reachable return statement.', [
      node('inputs', 'total − completed', 'A numeric calculation inside the function.'),
      node('return', 'return number', 'The result must match the declared number type.', 'type'),
      node('caller', 'count: number', 'The caller can safely use numeric operations.', 'value'),
    ]),
    challenge: { id: 'return-types-check', title: 'Keep the return contract', topic: 'Functions', difficulty: 'Beginner', kind: 'fix', prompt: 'Return the numeric length while preserving the number return annotation', code: 'function countLetters(text: string): number {\n  return text.length.toString();\n}\nconst size = countLetters("code");', answer: 'number', runtimeChecks: [{ expression: 'countLetters("")', expected: 0 }, { expression: 'countLetters("code")', expected: 4 }, { expression: 'countLetters("typescript")', expected: 10 }], expectedTypes: { size: 'number' }, validationCode: "type __RancodeLabCounter = __RancodeLabAssert<__RancodeLabEqual<typeof countLetters, (text: string) => number>>;\ntype __RancodeLabSize = __RancodeLabAssert<__RancodeLabEqual<typeof size, number>>;", hint: 'length is already a number; toString changes it to text.', explanation: 'Returning text.length satisfies number. Converting it to text breaks the function’s declared output contract.', solution: 'function countLetters(text: string): number {\n  return text.length;\n}\nconst size = countLetters("code");' },
    recap: ['Return annotations describe what callers receive.', 'All reachable return paths must satisfy the contract.', 'void has no promised useful result; never cannot return normally.'], relatedConcepts: ['return-types', 'never', 'void'],
  },
  {
    id: 'optional-parameters', title: 'Optional Parameters', moduleId: 'functions', minutes: 6,
    description: 'Make omitted inputs an intentional part of a function.',
    explanation: [
      'A question mark makes a parameter optional: greet(name?: string). Callers may omit it, so the body must handle string | undefined. Optional parameters normally follow required ones.',
      'A default value is another way to accept omission. In greet(name = "friend"), the body sees a string because JavaScript uses the default when the argument is omitted or explicitly undefined.',
      'Use ?? when you want a fallback only for null or undefined. Unlike ||, it preserves valid falsy values such as an empty string or 0. The example deliberately uses undefined to mean the caller did not provide a nickname.',
    ],
    code: 'function greet(name: string, nickname?: string): string {\n  const displayName = nickname ?? name;\n  return `Hello, ${displayName}`;\n}\n\nconst firstGreeting = greet("Maya");\nconst secondGreeting = greet("Maya", "May");',
    inspectSymbols: ['greet', 'firstGreeting', 'secondGreeting'],
    visual: flow('Omission has a value', 'An omitted optional argument becomes undefined. A fallback gives the rest of the function a definite string.', [
      node('optional', 'nickname?: string', 'The caller may supply text or omit the argument.', 'type'),
      node('body', 'string | undefined', 'The body must account for the missing case.', 'type'),
      node('fallback', 'nickname ?? name', 'A string is produced by choosing the provided nickname or name.', 'value'),
    ]),
    challenge: { id: 'optional-parameters-check', title: 'Predict the fallback', topic: 'Functions', difficulty: 'Beginner', kind: 'choice', prompt: 'What string does this call return?', code: 'function greet(name: string, nickname?: string) {\n  return nickname ?? name;\n}\ngreet("Maya", "");', options: ['"Maya"', '""', 'undefined'], answer: '""', hint: 'An empty string is not null or undefined.', explanation: '?? preserves the supplied empty string. A logical OR fallback would instead choose "Maya", because an empty string is falsy.' },
    recap: ['An optional parameter includes undefined inside the body.', 'Defaults apply to omitted or undefined arguments.', '?? preserves meaningful falsy values.'], relatedConcepts: ['optional-parameters', 'nullish-values'],
  },
  {
    id: 'function-types', title: 'Function Types', moduleId: 'functions', minutes: 7,
    description: 'Pass behavior around using a contract for its inputs and result.',
    explanation: [
      'Functions are values, so they can have named types and be passed to other functions. The type (value: number) => string describes a function that receives a number and returns text.',
      'A callback’s context can supply its parameter types. When formatter is annotated as Formatter, the arrow function’s value parameter is inferred as number. Repeating the annotation on the parameter is unnecessary.',
      'Keep the two uses of => separate: in a type, it separates input types from the return type; in an expression, it begins an arrow function’s body. Both follow the same useful mental model of input → output.',
    ],
    code: 'type Formatter = (value: number) => string;\n\nconst formatPercent: Formatter = value => `${value}%`;\n\nfunction describe(score: number, format: Formatter): string {\n  return format(score);\n}\n\nconst label = describe(80, formatPercent);',
    inspectSymbols: ['formatPercent', 'describe', 'label'],
    visual: flow('Behavior with a shape', 'A callback is compatible when its inputs and result satisfy the receiving contract.', [
      node('input', 'number', 'The caller provides a numeric score.', 'type'),
      node('callback', 'Formatter', '(value: number) => string describes the callable shape.'),
      node('output', 'string', 'The caller receives formatted text.', 'type'),
    ]),
    challenge: { id: 'function-types-check', title: 'Finish a predicate type', topic: 'Functions', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the result type for a function that answers yes or no', code: 'type IsPassing = (score: number) => ___;\nconst isPassing: IsPassing = score => score >= 70;', answer: 'boolean', answerType: 'boolean', hint: 'A comparison expression produces true or false.', explanation: 'A predicate returns boolean. The contextual function type also tells TypeScript that score is a number.', solution: 'type IsPassing = (score: number) => boolean;\nconst isPassing: IsPassing = score => score >= 70;' },
    recap: ['Function types describe callable values.', 'Callbacks can inherit parameter types from context.', 'Input and output relationships matter when passing behavior.'], relatedConcepts: ['function-types', 'inference', 'parameters'],
  },
]
