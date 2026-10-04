import type { Lesson } from './types'
import { flow, node } from './visuals'

export const generics: Lesson[] = [
  {
    id: 'why-generics', title: 'Why Generics?', moduleId: 'generics', minutes: 7,
    description: 'Keep a relationship that unknown or a broad union would lose.',
    explanation: [
      'A function accepting unknown and returning unknown can safely accept many values, but its caller loses the connection between the input and result. A generic captures that relationship with a type parameter.',
      'In identity<T>(value: T): T, the same T appears at the input and output. The function works for many types, but each call remembers its own chosen type. The checker can infer T from the argument.',
      'T is a placeholder for a type during checking, not a runtime variable. Generics do not create a separate JavaScript implementation for every possible type. The function body must be valid for any type allowed by its contract.',
    ],
    code: 'function identity<T>(value: T): T {\n  return value;\n}\n\nconst learner = identity({ name: "Maya", completed: 4 });\nconst score = identity<number>(90);\nconst learnerName = learner.name;',
    inspectSymbols: ['identity', 'learner', 'score', 'learnerName'],
    comparison: { beforeLabel: 'Relationship lost', afterLabel: 'Relationship preserved', before: 'function identity(value: unknown): unknown {\n  return value;\n}\nconst result = identity("hello");\n// result is unknown', after: 'function identity<T>(value: T): T {\n  return value;\n}\nconst result = identity("hello");\n// result retains the input type' },
    visual: flow('One type travels through a function', 'A type parameter connects the input and result without hard-coding a single type.', [
      node('input', 'number input', 'This call explicitly chooses number.', 'value'),
      node('resolve', 'T = number', 'The type parameter represents the chosen type for this call.', 'type'),
      node('output', 'number result', 'Returning T preserves the relationship.', 'type'),
    ]),
    challenge: { id: 'why-generics-check', title: 'Keep the relationship', topic: 'Generics', difficulty: 'Intermediate', kind: 'choice', prompt: 'Why is the generic signature more useful to callers?', code: 'function identity<T>(value: T): T { return value; }', options: ['It preserves the type relationship between input and output', 'It validates API data at runtime', 'It converts every input into a string'], answer: 'It preserves the type relationship between input and output', hint: 'Notice where the same T appears.', explanation: 'Both positions share T, so the return type follows the input type. Generics do not validate or convert values at runtime.' },
    recap: ['Generics preserve relationships across types.', 'Each call can infer or explicitly supply its type argument.', 'Type parameters are erased at runtime.'], relatedConcepts: ['generics', 'unknown', 'inference'],
  },
  {
    id: 'generic-functions', title: 'Generic Functions', moduleId: 'generics', minutes: 7,
    description: 'Build reusable helpers that keep the element type intact.',
    explanation: [
      'A generic function can describe a transformation involving a type parameter. first<T> takes T[] and returns T | undefined: an element of that array, or absence when the array is empty.',
      'The undefined branch matters. Generics should preserve the true behavior of the function, not promise that an element always exists. Callers must handle the result before using type-specific methods.',
      'Let inference do the work when an argument already supplies the type. Use an explicit type argument when the call would otherwise lack enough information, such as initializing an empty collection.',
    ],
    code: 'function first<T>(items: readonly T[]): T | undefined {\n  return items[0];\n}\n\nconst lesson = first(["Types", "Functions"]);\nconst score = first([8, 9, 10]);\nconst empty = first<string>([]);\nconst heading = lesson?.toUpperCase() ?? "No lesson";',
    inspectSymbols: ['first', 'lesson', 'score', 'empty', 'heading'],
    visual: flow('The element type stays connected', 'The container changes, but the result remembers which kind of element was inside.', [
      node('array', 'string[]', 'The argument supplies the element type.', 'value'),
      node('generic', 'T = string', 'first uses one shared type parameter.', 'type'),
      node('result', 'string | undefined', 'An empty array means the result may be absent.', 'type'),
    ]),
    challenge: { id: 'generic-functions-check', title: 'Describe an honest return type', topic: 'Generics', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the missing type for an empty-array result', code: 'function first<T>(items: T[]): T | ___ {\n  return items[0];\n}', answer: 'undefined', answerType: 'undefined', hint: 'Reading element zero from an empty array produces this value.', explanation: 'T | undefined represents both a present element and an empty collection. It keeps the function’s type aligned with its runtime behavior.', solution: 'function first<T>(items: T[]): T | undefined {\n  return items[0];\n}' },
    recap: ['Generic helpers preserve element relationships.', 'Include real absence in the result contract.', 'Infer type arguments when the inputs provide enough information.'], relatedConcepts: ['generic-functions', 'arrays', 'nullish-values'],
  },
  {
    id: 'generic-constraints', title: 'Generic Constraints', moduleId: 'generics', minutes: 8,
    description: 'Require just enough structure while preserving the complete input type.',
    explanation: [
      'An unconstrained T could be any type, so the function cannot assume it has properties such as length or id. A constraint describes the minimum structure the function needs.',
      'T extends { id: string } means T must be assignable to that shape. The function can use id while preserving additional properties such as name and completed in its returned T.',
      'Constraints can relate type parameters to one another. K extends keyof T allows a key only when it belongs to T, and T[K] describes the corresponding property value. That connection prevents mismatched object/key pairs.',
    ],
    code: 'function withLabel<T extends { id: string }>(value: T) {\n  return { ...value, label: `Item ${value.id}` };\n}\n\nfunction getProperty<T, K extends keyof T>(object: T, key: K): T[K] {\n  return object[key];\n}\n\nconst learner = withLabel({ id: "u-1", name: "Maya" });\nconst name = getProperty(learner, "name");',
    inspectSymbols: ['withLabel', 'getProperty', 'learner', 'name'],
    visual: flow('Minimum requirement, preserved details', 'The constraint grants access to id without throwing away the rest of the input shape.', [
      node('input', '{ id; name }', 'A concrete object provides more than the minimum.', 'value'),
      node('constraint', 'T extends { id: string }', 'The function may safely read id.', 'type'),
      node('output', 'T & { label: string }', 'The result keeps original properties and adds label.', 'type'),
    ]),
    challenge: { id: 'generic-constraints-check', title: 'Require the property you read', topic: 'Generics', difficulty: 'Advanced', kind: 'fill', prompt: 'Complete the keyword that constrains T to values with a length', code: 'function lengthOf<T ___ { length: number }>(value: T): number {\n  return value.length;\n}', answer: 'extends', hint: 'Here the keyword sets a minimum compatible shape.', explanation: 'extends constrains T to types with a numeric length property. Strings and arrays both satisfy that structural requirement.', solution: 'function lengthOf<T extends { length: number }>(value: T): number {\n  return value.length;\n}' },
    recap: ['A constraint grants safe access to a minimum shape.', 'Additional input details stay preserved in T.', 'K extends keyof T connects a key to its object.'], relatedConcepts: ['generic-constraints', 'keyof', 'indexed-access'],
  },
  {
    id: 'generic-interfaces', title: 'Generic Interfaces', moduleId: 'generics', minutes: 7,
    description: 'Reuse a container shape with different kinds of data.',
    explanation: [
      'An interface can accept a type parameter just like a function. Page<T> describes shared pagination metadata while leaving the item type open. Page<Lesson> and Page<Learner> share structure without confusing their contents.',
      'Supplying the type argument resolves every occurrence of T within that interface. items becomes Lesson[] when T is Lesson. Consumers know exactly which fields each item provides.',
      'A generic container should express a meaningful relationship. Keep unrelated metadata concrete: the page number is still number regardless of the item type. More type parameters are useful only when they describe independent choices that callers actually need.',
    ],
    code: 'interface Page<T> {\n  items: T[];\n  page: number;\n  hasNext: boolean;\n}\n\ntype Lesson = { id: string; title: string };\nconst lessons: Page<Lesson> = {\n  items: [{ id: "generics", title: "Generics" }],\n  page: 1,\n  hasNext: false,\n};\nconst titles = lessons.items.map(item => item.title);',
    inspectSymbols: ['lessons', 'titles'],
    visual: flow('One container, a specific payload', 'A type argument specializes each use of T while the surrounding interface remains reusable.', [
      node('template', 'Page<T>', 'A reusable container with items: T[].', 'type'),
      node('argument', 'T = Lesson', 'This instance holds lesson records.', 'type'),
      node('resolved', 'items: Lesson[]', 'Each item exposes id and title.', 'value'),
    ]),
    challenge: { id: 'generic-interfaces-check', title: 'Specialize the container', topic: 'Generics', difficulty: 'Intermediate', kind: 'fill', prompt: 'Supply the type argument for a box holding a number', code: 'interface Box<T> { value: T }\nconst score: Box<___> = { value: 95 };', answer: 'number', answerType: 'number', hint: 'The type argument replaces T in the value property.', explanation: 'Box<number> requires value to be a number. A different type argument could reuse the same interface for another payload.', solution: 'interface Box<T> { value: T }\nconst score: Box<number> = { value: 95 };' },
    recap: ['Generic interfaces parameterize reusable containers.', 'A type argument replaces every occurrence of T.', 'Keep unrelated fields concrete.'], relatedConcepts: ['generic-interfaces', 'generics', 'interfaces'],
  },
]
