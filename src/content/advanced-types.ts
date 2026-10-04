import type { Lesson } from './types'
import { flow, node } from './visuals'

export const advancedTypes: Lesson[] = [
  {
    id: 'literal-types', title: 'Literal Types', moduleId: 'advanced-types', minutes: 6,
    description: 'Replace any string with a small vocabulary of valid states.',
    explanation: [
      'A literal type describes one exact value, such as "draft", 200, or true. Combine literals with a union to express a finite vocabulary: "draft" | "published".',
      'Finite types catch misspellings and communicate valid choices to callers. They are useful for UI variants, request states, and domain rules that have a small set of options.',
      'A const assertion preserves literal values in an object or array and makes those properties readonly in the type system. It does not freeze the runtime object. Use it when the value really is intended to describe a fixed configuration.',
    ],
    code: 'type Status = "draft" | "published";\n\nfunction statusLabel(status: Status): string {\n  return status === "published" ? "Ready to read" : "Work in progress";\n}\n\nconst status: Status = "published";\nconst label = statusLabel(status);\nconst settings = { theme: "dark", density: "comfortable" } as const;',
    inspectSymbols: ['status', 'label', 'settings'],
    visual: flow('A smaller set of strings', 'The contract permits exactly two strings instead of the entire string type.', [
      node('status', 'Status', 'The union "draft" | "published".', 'type'),
      node('draft', '"draft"', 'Accepted: this exact value is a member.', 'value'),
      node('published', '"published"', 'Accepted: this exact value is a member.', 'value'),
      node('typo', '"publised"', 'Rejected: spelling is part of the type.', 'error'),
    ], [{ from: 'draft', to: 'status', label: 'valid' }, { from: 'published', to: 'status', label: 'valid' }, { from: 'typo', to: 'status', label: 'invalid' }]),
    challenge: { id: 'literal-types-check', title: 'Choose a valid state', topic: 'Composition', difficulty: 'Beginner', kind: 'choice', prompt: 'Which value belongs to RequestState?', code: 'type RequestState = "idle" | "loading" | "ready";', options: ['"complete"', '"ready"', 'true'], answer: '"ready"', hint: 'A literal union is an exact list of permitted values.', explanation: 'Only "idle", "loading", and "ready" satisfy the union. Similar meanings or different spellings do not count.' },
    recap: ['Literal types describe exact values.', 'Unions of literals express a controlled vocabulary.', 'as const preserves literals without runtime freezing.'], relatedConcepts: ['literal-types', 'unions', 'readonly'],
  },
  {
    id: 'narrowing', title: 'Narrowing', moduleId: 'advanced-types', minutes: 8,
    description: 'Follow evidence as a broad type becomes a specific one.',
    explanation: [
      'Narrowing happens when control flow provides evidence about a value. typeof, equality checks, the in operator, and other guards let the checker rule out impossible members of a union.',
      'A discriminated union gives each object variant a common property with a distinct literal value. Checking result.ok tells TypeScript whether the payload has data or error. Related properties stay connected because they belong to the same variant.',
      'After every possible variant has been handled, the remaining value is never. You can use that fact for an exhaustiveness check. When you add a variant later, the checker can point to code that has not handled it.',
    ],
    code: 'type Result =\n  | { ok: true; data: string }\n  | { ok: false; error: string };\n\nfunction describe(result: Result): string {\n  if (result.ok) {\n    return result.data.toUpperCase();\n  }\n  return `Could not load: ${result.error}`;\n}\n\nconst message = describe({ ok: true, data: "Lesson ready" });',
    inspectSymbols: ['describe', 'message'],
    visual: flow('Evidence selects a branch', 'The discriminant links each state to the properties that exist in that state.', [
      node('result', 'Result', 'Either the successful shape or the failure shape.', 'type'),
      node('success', 'ok: true → data', 'Only the success member has data.', 'value'),
      node('failure', 'ok: false → error', 'Only the failure member has error.', 'error'),
    ], [{ from: 'result', to: 'success', label: 'if result.ok' }, { from: 'result', to: 'failure', label: 'otherwise' }]),
    steps: [
      { line: 12, label: 'Call describe', value: '{ ok: true, data: "Lesson ready" }', explanation: 'The example supplies the success variant to a function accepting the full union.' },
      { line: 6, label: 'Evaluate the guard', value: 'result.ok === true', explanation: 'The condition is true, so execution enters the success branch.' },
      { line: 7, label: 'Use the narrowed shape', value: 'result.data: string', explanation: 'Inside this branch the checker knows data exists. The failure member is excluded.' },
      { line: 7, label: 'Return the text', value: '"LESSON READY"', explanation: 'The string is uppercased and returned. The error branch is never executed for this input.' },
    ],
    challenge: { id: 'narrowing-check', title: 'Narrow before reading', topic: 'Composition', difficulty: 'Intermediate', kind: 'fix', prompt: 'Handle both variants before reading data. Return the error text for a failure.', code: 'type Result = { ok: true; data: string } | { ok: false; error: string };\nfunction describe(result: Result): string {\n  return result.data;\n}\nconst message = describe({ ok: true, data: "Ready" });', answer: 'guard', runtimeChecks: [{ expression: 'describe({ ok: true, data: "Ready" })', expected: 'Ready' }, { expression: 'describe({ ok: true, data: "" })', expected: '' }, { expression: 'describe({ ok: false, error: "Try again" })', expected: 'Try again' }], expectedTypes: { message: 'string' }, validationCode: "type __UnderCodeResult = __UnderCodeAssert<__UnderCodeEqual<Result, { ok: true; data: string } | { ok: false; error: string }>>;\ntype __UnderCodeDescribe = __UnderCodeAssert<__UnderCodeEqual<typeof describe, (result: Result) => string>>;\ntype __UnderCodeMessage = __UnderCodeAssert<__UnderCodeEqual<typeof message, string>>;", hint: 'Use if (result.ok) to select the member with data, then handle error.', explanation: 'The success branch can read data; the failure branch can read error. Accessing data on the whole union is unsafe because it does not exist in every member.', solution: 'type Result = { ok: true; data: string } | { ok: false; error: string };\nfunction describe(result: Result): string {\n  if (result.ok) return result.data;\n  return result.error;\n}\nconst message = describe({ ok: true, data: "Ready" });' },
    recap: ['Control flow supplies evidence for narrowing.', 'A discriminant connects a state to its payload.', 'never can reveal an unhandled variant.'], relatedConcepts: ['narrowing', 'discriminated-unions', 'never'],
  },
  {
    id: 'keyof', title: 'keyof', moduleId: 'advanced-types', minutes: 6,
    description: 'Derive a type from the property names of another type.',
    explanation: [
      'keyof turns an object type into a union of its known keys. For Lesson, keyof Lesson is "title" | "minutes". When the shape changes, the key union changes with it.',
      'An indexed access type selects the value type for a key: Lesson["minutes"] is number. Combining keyof and indexed access keeps a model and the code that reads it connected.',
      'keyof is a type-level operator. It does not return an array of keys at runtime. Object.keys is a JavaScript operation with a different job; objects can have additional runtime properties, so its result is generally string[].',
    ],
    code: 'type Lesson = { title: string; minutes: number };\ntype LessonKey = keyof Lesson;\ntype Duration = Lesson["minutes"];\n\nconst key: LessonKey = "title";\nconst duration: Duration = 6;\nconst lesson: Lesson = { title: "keyof", minutes: duration };\nconst value = lesson[key];',
    inspectSymbols: ['key', 'duration', 'lesson', 'value'],
    visual: flow('A shape becomes a key union', 'keyof derives a vocabulary from the source model instead of duplicating property names.', [
      node('shape', '{ title; minutes }', 'The source object type has two known properties.', 'type'),
      node('operator', 'keyof Lesson', 'Select the set of property names.'),
      node('keys', '"title" | "minutes"', 'Only these keys are accepted by LessonKey.', 'type'),
    ]),
    challenge: { id: 'keyof-check', title: 'Derive the keys', topic: 'Composition', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the operator that derives the property-name union.', code: 'type Profile = { name: string; age: number };\ntype ProfileKey = ___ Profile;', answer: 'keyof', hint: 'The operator asks for the keys of a type.', explanation: 'keyof Profile produces "name" | "age". The union stays synchronized if Profile changes.', solution: 'type Profile = { name: string; age: number };\ntype ProfileKey = keyof Profile;' },
    recap: ['keyof produces a union of keys.', 'T[K] selects the type stored at a key.', 'Type-level keys and runtime key enumeration are different operations.'], relatedConcepts: ['keyof', 'indexed-access'],
  },
  {
    id: 'typeof', title: 'typeof', moduleId: 'advanced-types', minutes: 6,
    description: 'Reuse the inferred type of an existing value.',
    explanation: [
      'JavaScript typeof is an expression that returns a string at runtime, such as "number" or "object". In a TypeScript type position, typeof instead refers to the static type of an existing value.',
      'Deriving a type from a well-defined value is useful for configuration objects and function signatures. typeof defaults gives you its property shape without writing the same shape twice.',
      'typeof reflects inference, including literal widening. The as const in this example makes theme exactly "dark". Remove as const to see how the derived type permits other strings. Neither form validates an unrelated value arriving from a server.',
    ],
    code: 'const defaults = { theme: "dark", fontSize: 14 };\ntype Settings = typeof defaults;\n\nconst custom: Settings = { theme: "light", fontSize: 16 };\nconst runtimeKind = typeof defaults;\n\nconst fixedDefaults = { theme: "dark" } as const;\ntype FixedSettings = typeof fixedDefaults;',
    inspectSymbols: ['defaults', 'custom', 'runtimeKind', 'fixedDefaults'],
    visual: flow('One word, two contexts', 'The position of typeof determines whether it is a runtime expression or a type-level query.', [
      node('value', 'defaults', 'An existing object value.', 'value'),
      node('static', 'type S = typeof defaults', 'Derives { theme: string; fontSize: number }.', 'type'),
      node('runtime', 'typeof defaults', 'In an expression, JavaScript returns "object".', 'value'),
    ], [{ from: 'value', to: 'static', label: 'type position' }, { from: 'value', to: 'runtime', label: 'expression position' }]),
    challenge: { id: 'typeof-check', title: 'Read a type query', topic: 'Composition', difficulty: 'Intermediate', kind: 'choice', prompt: 'What does Config represent?', code: 'const config = { retries: 3, verbose: false };\ntype Config = typeof config;', options: ['The string "object"', '{ retries: number; verbose: boolean }', 'An array of the property names'], answer: '{ retries: number; verbose: boolean }', hint: 'Here typeof appears to the right of a type alias declaration.', explanation: 'In this type position, typeof captures the inferred object shape. In an expression, typeof config would evaluate to the string "object".' },
    recap: ['Type-position typeof reuses an existing static type.', 'Expression-position typeof returns a runtime string.', 'Inference choices affect the derived shape.'], relatedConcepts: ['typeof', 'inference', 'literal-types'],
  },
  {
    id: 'utility-types', title: 'Utility Types', moduleId: 'advanced-types', minutes: 8,
    description: 'Transform an existing model without repeating its fields.',
    explanation: [
      'Utility types are reusable type transformations. Partial<T> makes every property optional; Required<T> removes optionality; Readonly<T> prevents writes through the typed reference. These operations are shallow.',
      'Pick<T, K> keeps selected properties and Omit<T, K> removes selected properties. Deriving a public preview or an editable form shape from a source model avoids duplicating definitions that can drift apart.',
      'Record<K, V> maps a key set to a value type. None of these utilities deletes fields, copies objects, or validates values at runtime. Omit<User, "password"> is a type description, not a function that removes a password from an object.',
    ],
    code: 'type Lesson = { id: string; title: string; minutes: number };\ntype LessonPreview = Pick<Lesson, "id" | "title">;\ntype LessonPatch = Partial<Omit<Lesson, "id">>;\n\nconst preview: LessonPreview = { id: "types", title: "Types" };\nconst patch: LessonPatch = { minutes: 7 };\nconst completion: Record<"types" | "functions", boolean> = {\n  types: true,\n  functions: false,\n};',
    inspectSymbols: ['preview', 'patch', 'completion'],
    visual: flow('Transform a single source of truth', 'Derive useful views of a model while keeping the original field definitions connected.', [
      node('source', 'Lesson', 'id, title, and minutes are required.', 'type'),
      node('preview', 'Pick<Lesson, …>', 'Select id and title for a compact preview.', 'type'),
      node('patch', 'Partial<Omit<Lesson, "id">>', 'Allow optional updates to title and minutes.', 'type'),
    ], [{ from: 'source', to: 'preview', label: 'select fields' }, { from: 'source', to: 'patch', label: 'remove id + make optional' }]),
    challenge: { id: 'utility-types-check', title: 'Make an update shape', topic: 'Composition', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the utility that makes all properties optional.', code: 'type Settings = { theme: string; fontSize: number };\ntype SettingsUpdate = ___<Settings>;', answer: 'Partial', hint: 'An update can provide only part of the original model.', explanation: 'Partial<Settings> creates optional theme and fontSize properties. It describes allowed updates but does not apply them at runtime.', solution: 'type Settings = { theme: string; fontSize: number };\ntype SettingsUpdate = Partial<Settings>;' },
    recap: ['Utility types transform type descriptions.', 'Pick and Omit select fields; Partial makes them optional.', 'A type transformation does not transform runtime data.'], relatedConcepts: ['utility-types', 'record', 'readonly'],
  },
]
