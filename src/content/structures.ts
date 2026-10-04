import type { Lesson } from './types'
import { flow, node } from './visuals'

export const structures: Lesson[] = [
  {
    id: 'type-aliases', title: 'Type Aliases', moduleId: 'structures', minutes: 5,
    description: 'Give a reusable name to a shape or combination of types.',
    explanation: [
      'A type alias gives a name to a type expression. You can name object shapes, unions, primitives, tuples, or function types. Naming a meaningful domain concept keeps its rules consistent across your code.',
      'An alias does not create a new runtime value or an isolated identity. If two object types have compatible structures, they can be compatible even when their aliases have different names.',
      'Use aliases to express relationships. LessonId names a string, and Lesson contains a LessonId. A plain string still fits LessonId; the name documents intent, but does not by itself guarantee a special identifier format.',
    ],
    code: 'type LessonId = string;\ntype Lesson = {\n  id: LessonId;\n  title: string;\n  minutes: number;\n};\n\nconst nextLesson: Lesson = {\n  id: "interfaces",\n  title: "Interfaces",\n  minutes: 6,\n};',
    inspectSymbols: ['nextLesson'],
    visual: flow('Name the model once', 'Aliases let multiple parts of a program refer to the same type expression.', [
      node('id', 'LessonId = string', 'A descriptive name for the identifier type.', 'type'),
      node('lesson', 'Lesson', 'The named shape combines id, title, and minutes.', 'type'),
      node('value', 'nextLesson', 'A concrete object checked against that shape.', 'value'),
    ]),
    challenge: { id: 'type-aliases-check', title: 'Name a finite set', topic: 'Structures', difficulty: 'Beginner', kind: 'fill', prompt: 'Which keyword creates this alias?', code: '___ Status = "draft" | "published";', answer: 'type', hint: 'Aliases can name a union as well as an object shape.', explanation: 'type introduces an alias. This alias names a union of two string literals.', solution: 'type Status = "draft" | "published";' },
    recap: ['Aliases give reusable names to type expressions.', 'They create no JavaScript value.', 'A descriptive alias alone does not enforce a special identity.'], relatedConcepts: ['type-aliases', 'structural-typing', 'unions'],
  },
  {
    id: 'interfaces', title: 'Interfaces', moduleId: 'structures', minutes: 6,
    description: 'Define a shared object contract for values and functions.',
    explanation: [
      'An interface describes an object’s required structure. It can include properties and methods. Values satisfy the interface by having the compatible shape; they do not need to explicitly declare that they implement it.',
      'A type alias and an interface can both describe ordinary objects. Interfaces support extension and declaration merging; aliases can also name unions and other expressions. Prefer the form that makes the contract clearest rather than treating one as universally superior.',
      'readonly prevents writes through that typed reference. It is a checking rule, not a runtime freeze, and it is not automatically deep. You can protect an identifier from accidental reassignment while allowing a title to change.',
    ],
    code: 'interface Course {\n  readonly id: string;\n  title: string;\n  lessonCount: number;\n}\n\nconst course: Course = {\n  id: "typescript",\n  title: "TypeScript, made visible",\n  lessonCount: 30,\n};\ncourse.title = "Learn TypeScript";',
    inspectSymbols: ['course'],
    visual: flow('A shared object contract', 'The interface lists requirements that any compatible object can satisfy.', [
      node('interface', 'Course', 'Requires id, title, and lessonCount.', 'type'),
      node('readonly', 'readonly id', 'Assignments through this reference are rejected.'),
      node('object', 'course', 'A plain object satisfies the interface structurally.', 'value'),
    ], [{ from: 'interface', to: 'readonly', label: 'protects' }, { from: 'object', to: 'interface', label: 'satisfies' }]),
    challenge: { id: 'interfaces-check', title: 'Understand readonly', topic: 'Structures', difficulty: 'Beginner', kind: 'choice', prompt: 'What does readonly enforce here?', code: 'interface Course { readonly id: string }\nconst course: Course = { id: "typescript" };', options: ['The checker rejects course.id = "other"', 'The object is deeply frozen at runtime', 'The id can only hold the literal "typescript"'], answer: 'The checker rejects course.id = "other"', hint: 'TypeScript annotations operate during checking.', explanation: 'readonly prevents this property assignment through the typed reference. It does not call Object.freeze or make string a literal type.' },
    recap: ['Interfaces describe object contracts.', 'Compatibility depends on structure.', 'readonly is a type-level write restriction.'], relatedConcepts: ['interfaces', 'readonly', 'structural-typing'],
  },
  {
    id: 'optional-properties', title: 'Optional Properties', moduleId: 'structures', minutes: 6,
    description: 'Represent missing fields without hiding the possibility of absence.',
    explanation: [
      'Add ? after a property name when the property may be absent. A learner with bio?: string is valid with or without a bio field. Reading that property must account for undefined.',
      'Optional chaining, learner.bio?.trim(), stops when bio is null or undefined and produces undefined. Pair it with ?? when the caller needs a definite fallback value.',
      'An omitted property and a property present with value undefined are not always interchangeable. With exactOptionalPropertyTypes enabled, bio?: string permits omission but not an explicit bio: undefined unless undefined is included in the property type.',
    ],
    code: 'interface Learner {\n  name: string;\n  bio?: string;\n}\n\nconst learner: Learner = { name: "Maya" };\nconst biography = learner.bio?.trim() ?? "No bio yet";',
    inspectSymbols: ['learner', 'biography'],
    visual: flow('Missing is a valid case', 'An optional read branches into a provided value or an absence that needs handling.', [
      node('property', 'bio?: string', 'The object may omit this property.', 'type'),
      node('read', 'string | undefined', 'Reading bio must account for both possibilities.', 'type'),
      node('result', '"No bio yet"', 'A fallback supplies a definite string when bio is absent.', 'value'),
    ]),
    challenge: { id: 'optional-properties-check', title: 'Mark the property optional', topic: 'Structures', difficulty: 'Beginner', kind: 'fill', prompt: 'Fill the single character that allows avatar to be omitted', code: 'interface Profile {\n  name: string;\n  avatar___: string;\n}', answer: '?', hint: 'The same marker makes a function parameter optional.', explanation: 'avatar?: string allows the property to be absent. Reading it has type string | undefined.', solution: 'interface Profile {\n  name: string;\n  avatar?: string;\n}' },
    recap: ['? allows a property to be absent.', 'Optional reads need undefined handling.', '?. and ?? make safe access and fallbacks concise.'], relatedConcepts: ['optional-properties', 'nullish-values', 'interfaces'],
  },
  {
    id: 'extending-interfaces', title: 'Extending Interfaces', moduleId: 'structures', minutes: 6,
    description: 'Build a larger contract from a smaller shared shape.',
    explanation: [
      'An interface can extend another interface to include its members. PublishedLesson contains every Lesson field plus publishedAt. A value cannot satisfy PublishedLesson while missing a required base property.',
      'Extension expresses an “is also” relationship at the type level. A PublishedLesson can be used where Lesson is expected, because it has everything a Lesson needs. The reverse assignment is not generally safe.',
      'This relationship does not create class inheritance or copy values at runtime. It only combines structural requirements. Composition can also use properties, such as author: Author, when one model contains another rather than being a specialized version of it.',
    ],
    code: 'interface Lesson {\n  id: string;\n  title: string;\n}\n\ninterface PublishedLesson extends Lesson {\n  publishedAt: string;\n}\n\nconst published: PublishedLesson = {\n  id: "unions",\n  title: "Union Types",\n  publishedAt: "2026-01-01",\n};\nconst lesson: Lesson = published;',
    inspectSymbols: ['published', 'lesson'],
    visual: flow('More requirements, a more specific shape', 'Every PublishedLesson is structurally a Lesson. An ordinary Lesson may lack a publication date.', [
      node('base', 'Lesson', 'Requires id and title.', 'type'),
      node('extended', 'PublishedLesson', 'Requires id, title, and publishedAt.', 'type'),
      node('value', 'published', 'This value satisfies both shapes.', 'value'),
    ], [{ from: 'extended', to: 'base', label: 'extends' }, { from: 'value', to: 'extended', label: 'satisfies' }]),
    challenge: { id: 'extending-interfaces-check', title: 'Complete the extended shape', topic: 'Structures', difficulty: 'Intermediate', kind: 'fix', prompt: 'Add the missing required title to published. Keep both interface contracts', code: 'interface Lesson { id: string; title: string }\ninterface PublishedLesson extends Lesson { publishedAt: string }\nconst published: PublishedLesson = {\n  id: "unions",\n  publishedAt: "2026-01-01",\n};', answer: 'title', expectedTypes: { published: 'PublishedLesson' }, validationCode: "type __RancodeLabBase = __RancodeLabAssert<__RancodeLabEqual<__RancodeLabShape<Lesson>, { id: string; title: string }>>;\ntype __RancodeLabPublished = __RancodeLabAssert<__RancodeLabEqual<__RancodeLabShape<PublishedLesson>, { id: string; title: string; publishedAt: string }>>;\ntype __RancodeLabPublishedValue = __RancodeLabAssert<__RancodeLabEqual<typeof published, PublishedLesson>>;", hint: 'Extension carries over every required property from Lesson.', explanation: 'PublishedLesson requires id and title from Lesson as well as publishedAt. Adding title completes the required structure.', solution: 'interface Lesson { id: string; title: string }\ninterface PublishedLesson extends Lesson { publishedAt: string }\nconst published: PublishedLesson = {\n  id: "unions",\n  title: "Union Types",\n  publishedAt: "2026-01-01",\n};' },
    recap: ['extends combines object requirements.', 'A more specific shape can satisfy its base contract.', 'Interface extension has no runtime inheritance behavior.'], relatedConcepts: ['interface-extension', 'interfaces', 'structural-typing'],
  },
]
