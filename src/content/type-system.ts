import type { Lesson } from './types'
import { flow, node } from './visuals'

export const typeSystem: Lesson[] = [
  {
    id: 'primitive-types', title: 'Primitive Types', moduleId: 'type-system', minutes: 6,
    description: 'Give strings, numbers, booleans, and absence precise meanings.',
    explanation: [
      'string holds text, number holds JavaScript numbers, and boolean holds true or false. Use the lowercase names: String, Number, and Boolean refer to wrapper object types and are almost never what you want.',
      'null and undefined represent absence. With strict null checking, neither can be assigned to a plain string. When absence is intentional, include it in the contract, such as string | null.',
      'unknown represents a value whose type you have not established; check it before using it. any disables many checks and can allow errors to spread. never describes a value that cannot occur, such as the result of a function that always throws. These are useful tools, not substitutes for describing a known value accurately.',
    ],
    code: 'const title: string = "TypeScript";\nconst lessons: number = 30;\nconst published: boolean = true;\nconst subtitle: string | null = null;\n\nconst incoming: unknown = "Welcome";\nconst greeting = typeof incoming === "string"\n  ? incoming.toUpperCase()\n  : "Hello";',
    inspectSymbols: ['title', 'lessons', 'published', 'subtitle', 'incoming', 'greeting'],
    visual: flow('Choose a set of values', 'Different primitive types permit different operations. Absence needs an explicit place in the contract.', [
      node('text', 'string', 'Text values such as "TypeScript".', 'type'),
      node('count', 'number', 'Numeric values such as 30, 1.5, and NaN.', 'type'),
      node('flag', 'boolean', 'Exactly true or false.', 'type'),
      node('empty', 'null / undefined', 'Absent values, checked separately in strict mode.'),
    ], []),
    challenge: { id: 'primitive-types-check', title: 'Handle an absent subtitle', topic: 'Types', difficulty: 'Beginner', kind: 'choice', prompt: 'Which annotation intentionally allows both text and null?', code: 'const subtitle = null;', options: ['string', 'string | null', 'String'], answer: 'string | null', hint: 'The vertical bar combines allowed sets of values.', explanation: 'string | null accepts text or null. With strict null checking, string alone does not accept null; String is a wrapper object type, not a solution to absence.' },
    recap: ['Use lowercase primitive names.', 'Model null and undefined explicitly under strict checking.', 'Prefer unknown over any when a value truly has an unknown shape.'], relatedConcepts: ['primitives', 'nullish-values', 'unknown', 'never'],
  },
  {
    id: 'type-inference', title: 'Type Inference', moduleId: 'type-system', minutes: 6,
    description: 'See how values give the checker enough information to infer types.',
    explanation: [
      'An annotation is not required for every variable. When you write let score = 10, TypeScript uses the initializer to infer number. Assigning another number is fine; assigning text is a mismatch.',
      'const and let give the checker different clues. A const primitive cannot be reassigned, so const mode = "learn" has the specific literal type "learn". A let binding can change, so let mode = "learn" is normally widened to string.',
      'const does not make an object deeply immutable. Properties of const settings = { mode: "learn" } can still change, so settings.mode normally has type string. Try adding as const to preserve literal values and mark the properties readonly at the type level.',
    ],
    code: 'let score = 10;\nconst mode = "learn";\nconst settings = { mode: "learn" };\nconst fixedSettings = { mode: "learn" } as const;\n\nscore = 20;',
    inspectSymbols: ['score', 'mode', 'settings', 'fixedSettings'],
    visual: flow('A value becomes a type', 'The declaration context determines whether TypeScript preserves a literal or widens it.', [
      node('value', '"learn"', 'The same initial value can produce different inferred types.', 'value'),
      node('let', 'let → string', 'Reassignment is possible, so other strings remain allowed.', 'type'),
      node('const', 'const → "learn"', 'A const primitive binding retains the specific literal.', 'type'),
    ], [{ from: 'value', to: 'let', label: 'mutable binding' }, { from: 'value', to: 'const', label: 'constant binding' }]),
    challenge: { id: 'type-inference-check', title: 'Read the inferred type', topic: 'Types', difficulty: 'Beginner', kind: 'choice', prompt: 'What is the inferred type of status?', code: 'let status = "draft";', options: ['"draft"', 'string', 'unknown'], answer: 'string', hint: 'The binding uses let, so a different string may be assigned later.', explanation: 'A mutable string variable is widened to string. const status = "draft" would preserve the literal type "draft".' },
    recap: ['Initializers often provide enough type information.', 'let commonly widens primitive literals.', 'A const binding does not freeze an object.'], relatedConcepts: ['inference', 'literal-types', 'readonly'],
  },
  {
    id: 'arrays', title: 'Arrays', moduleId: 'type-system', minutes: 6,
    description: 'Describe a collection by the values each element can hold.',
    explanation: [
      'number[] is an array of numbers. Array<number> means the same thing. The element contract applies when you create the array, push a value, or replace an element.',
      'Array methods preserve useful relationships: mapping numbers through a function that returns strings produces string[]. TypeScript reads the callback’s result to infer the new element type.',
      'An index may be out of bounds at runtime. With noUncheckedIndexedAccess enabled, scores[0] includes undefined even for number[]. Check for absence before using an indexed value. A tuple can express fixed positions when the length and roles are known.',
    ],
    code: 'const scores: number[] = [8, 9, 10];\nscores.push(7);\n\nconst labels = scores.map(score => `Score: ${score}`);\nconst first = scores[0];\nconst firstLabel = first === undefined\n  ? "No score yet"\n  : first.toFixed(1);',
    inspectSymbols: ['scores', 'labels', 'first', 'firstLabel'],
    visual: flow('One element contract', 'Mapping creates a new collection whose element type comes from the callback result.', [
      node('input', 'number[]', 'Every element in scores must be a number.', 'type'),
      node('map', 'score → string', 'The callback creates a label from each number.'),
      node('output', 'string[]', 'The new array contains the returned strings.', 'type'),
    ]),
    challenge: { id: 'arrays-check', title: 'Type a list of labels', topic: 'Types', difficulty: 'Beginner', kind: 'fill', prompt: 'Complete the annotation for an array of strings.', code: 'const labels: ___ = ["Learn", "Practice"];', answer: 'string[]', answerType: 'string[]', acceptedAnswers: ['Array<string>', 'string []'], hint: 'Add square brackets after the element type.', explanation: 'string[] describes an array whose elements are strings. Array<string> is equivalent.', solution: 'const labels: string[] = ["Learn", "Practice"];' },
    recap: ['T[] and Array<T> describe the same array type.', 'map can transform one element type into another.', 'Check indexed values that may be absent.'], relatedConcepts: ['arrays', 'inference', 'nullish-values'],
  },
  {
    id: 'objects', title: 'Objects', moduleId: 'type-system', minutes: 6,
    description: 'Model a value by the properties it needs.',
    explanation: [
      'An object type lists property names and the types of their values. A learner needs a name that is a string and a completed count that is a number. Missing a required property or assigning the wrong value produces a diagnostic.',
      'TypeScript uses structural typing: compatible shapes matter more than the name of a class or where an object was created. A value with the required properties can usually be used even when it also has extra properties.',
      'Fresh object literals get an additional excess-property check, which is helpful for catching typos. A literal with completedd instead of completed should not silently pass. Named types in the next modules make these shapes easier to reuse.',
    ],
    code: 'const learner: { name: string; completed: number } = {\n  name: "Maya",\n  completed: 3,\n};\n\nlearner.completed += 1;\nconst summary = `${learner.name}: ${learner.completed} lessons`;',
    inspectSymbols: ['learner', 'summary'],
    visual: flow('A shape is a contract', 'Each required property must exist and carry a compatible value.', [
      node('learner', 'learner', 'An object with two required properties.', 'value'),
      node('name', 'name: string', 'Text used to identify the learner.', 'type'),
      node('completed', 'completed: number', 'A numeric count of finished lessons.', 'type'),
    ], [{ from: 'learner', to: 'name', label: 'requires' }, { from: 'learner', to: 'completed', label: 'requires' }]),
    challenge: { id: 'objects-check', title: 'Repair the property value', topic: 'Structures', difficulty: 'Beginner', kind: 'fix', prompt: 'Keep the Learner contract and change completed to a number.', code: 'type Learner = { name: string; completed: number };\nconst learner: Learner = { name: "Maya", completed: "3" };', answer: 'number', expectedTypes: { learner: 'Learner' }, validationCode: "type __UnderCodeLearner = __UnderCodeAssert<__UnderCodeEqual<__UnderCodeShape<Learner>, { name: string; completed: number }>>;\ntype __UnderCodeLearnerValue = __UnderCodeAssert<__UnderCodeEqual<typeof learner, Learner>>;", hint: 'The quotation marks turn 3 into a string.', explanation: 'completed must be numeric. Removing the quotes gives the object the shape required by Learner.', solution: 'type Learner = { name: string; completed: number };\nconst learner: Learner = { name: "Maya", completed: 3 };' },
    recap: ['Object types describe required property shapes.', 'Compatibility is primarily structural.', 'Fresh object literals receive extra typo checks.'], relatedConcepts: ['object-shapes', 'structural-typing'],
  },
  {
    id: 'union-types', title: 'Union Types', moduleId: 'type-system', minutes: 7,
    description: 'Allow several possibilities while handling each safely.',
    explanation: [
      'A union such as string | number means a value may be either member. It does not mean the value has the abilities of both types at once.',
      'You can use operations that are valid for every member. To call toUpperCase, first show the checker that the value is a string. A typeof check narrows the union inside that branch.',
      'Unions also describe absence, such as string | undefined, and finite states such as "idle" | "loading". Keep the contract as precise as the domain requires: allowing more possibilities makes consumers handle more cases.',
    ],
    code: 'function displayId(id: string | number): string {\n  if (typeof id === "string") {\n    return id.toUpperCase();\n  }\n  return id.toFixed(0);\n}\n\nconst label = displayId("ts-01");',
    inspectSymbols: ['displayId', 'label'],
    visual: flow('Either member, one safe path', 'A union starts broad. Evidence selects the operations available within a branch.', [
      node('union', 'string | number', 'The caller may provide either type.', 'type'),
      node('string', 'string branch', 'typeof id === "string" permits toUpperCase.', 'type'),
      node('number', 'number branch', 'After returning from the string branch, only number remains.', 'type'),
    ], [{ from: 'union', to: 'string', label: 'typeof === "string"' }, { from: 'union', to: 'number', label: 'otherwise' }]),
    challenge: { id: 'union-types-check', title: 'Use a union safely', topic: 'Types', difficulty: 'Beginner', kind: 'choice', prompt: 'What must happen before calling toUpperCase on id?', code: 'function show(id: string | number) {\n  // use id here\n}', options: ['Check that typeof id is "string"', 'Assert that every id is a string', 'Nothing; a union has both sets of methods'], answer: 'Check that typeof id is "string"', hint: 'A method must be valid for the actual member in that branch.', explanation: 'A typeof guard provides evidence that narrows id to string. An assertion bypasses the check and does not convert a number into text.' },
    recap: ['A union represents alternative possibilities.', 'Only shared operations are safe before narrowing.', 'A guard provides evidence for one branch.'], relatedConcepts: ['unions', 'narrowing', 'type-assertions'],
  },
]
