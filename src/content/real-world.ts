import type { Lesson } from './types'
import { flow, node } from './visuals'

export const realWorld: Lesson[] = [
  {
    id: 'typing-api-responses', title: 'Typing API Responses', moduleId: 'real-world', minutes: 9,
    description: 'Treat external data as unknown until runtime evidence supports a type.',
    explanation: [
      'A type annotation cannot make a server keep its promise. JSON may be missing fields, have a different shape, or come from an error response. Treat external data as unknown until you check the properties you need.',
      'A type guard returns a boolean and describes what is true when that boolean is true. isLearner(value): value is Learner tells the checker how to narrow value after the runtime checks succeed. The guard’s implementation is responsible for making that claim honestly.',
      'For larger models, a schema validator such as Zod can validate data and infer the corresponding TypeScript type. An assertion like response as Learner skips validation. Always handle request failure separately from an invalid payload.',
    ],
    code: 'type Learner = { id: number; name: string };\n\nfunction isLearner(value: unknown): value is Learner {\n  if (typeof value !== "object" || value === null) return false;\n  return "id" in value && typeof value.id === "number"\n    && "name" in value && typeof value.name === "string";\n}\n\nconst payload: unknown = JSON.parse(\'{"id":1,"name":"Maya"}\');\nconst message = isLearner(payload)\n  ? `Welcome, ${payload.name}`\n  : "The response has an unexpected shape";',
    inspectSymbols: ['isLearner', 'payload', 'message'],
    visual: flow('Validate at the boundary', 'Static types become useful after real runtime checks establish the incoming shape.', [
      node('external', 'unknown payload', 'Network and JSON data have not earned a trusted shape yet.'),
      node('guard', 'Runtime validation', 'Check object, null, field presence, and field types.'),
      node('valid', 'Learner', 'The successful branch can safely read name and id.', 'type'),
      node('invalid', 'Invalid response', 'The failure branch can show a useful fallback.', 'error'),
    ], [{ from: 'external', to: 'guard', label: 'inspect' }, { from: 'guard', to: 'valid', label: 'passes' }, { from: 'guard', to: 'invalid', label: 'fails' }]),
    challenge: { id: 'typing-api-responses-check', title: 'Trust the evidence', topic: 'Real world', difficulty: 'Intermediate', kind: 'choice', prompt: 'Which approach checks whether incoming data really has the expected shape?', code: 'const payload: unknown = JSON.parse(responseText);', options: ['payload as Learner', 'A runtime guard or schema validator', 'Renaming payload to learner'], answer: 'A runtime guard or schema validator', hint: 'The solution must inspect values while the program runs.', explanation: 'A runtime validator checks actual fields and values. An assertion only changes what the checker assumes; it cannot transform or validate the payload.' },
    recap: ['Treat untrusted external values as unknown.', 'Runtime validation provides evidence for a type.', 'A type assertion does not validate data.'], relatedConcepts: ['runtime-validation', 'unknown', 'type-guards', 'type-assertions'],
  },
  {
    id: 'async-functions', title: 'Async Functions', moduleId: 'real-world', minutes: 8,
    description: 'Model a future result and handle success or failure deliberately.',
    explanation: [
      'An async function always returns a promise. Returning a string from its body gives callers Promise<string>. await unwraps the fulfilled value within an async context.',
      'Promise<T> describes the fulfilled value, not the rejection value. A failed request may reject, so use try/catch where you can recover. Under strict checking, a caught error is unknown; check it before reading message.',
      'The local example uses an immediately resolved promise so you can study the types without a server. A real fetch flow should also check response.ok and validate the parsed payload before treating it as your domain model.',
    ],
    code: 'type Lesson = { id: string; title: string };\n\nasync function loadLesson(): Promise<Lesson> {\n  return { id: "async", title: "Async Functions" };\n}\n\nasync function getHeading(): Promise<string> {\n  try {\n    const lesson = await loadLesson();\n    return lesson.title;\n  } catch (error) {\n    return error instanceof Error ? error.message : "Unable to load";\n  }\n}\n\nconst pending = getHeading();',
    inspectSymbols: ['loadLesson', 'getHeading', 'pending'],
    visual: flow('A result across time', 'The promise describes a future value. await exposes that value after successful fulfillment.', [
      node('call', 'loadLesson()', 'Calling the async function returns immediately with a promise.'),
      node('promise', 'Promise<Lesson>', 'The fulfilled value is promised to have the Lesson shape.', 'type'),
      node('await', 'await → Lesson', 'Inside the async function, lesson is the resolved object.', 'value'),
    ]),
    challenge: { id: 'async-functions-check', title: 'Describe the future result', topic: 'Real world', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the wrapper required for an async function returning a string.', code: 'async function title(): ___<string> {\n  return "TypeScript";\n}', answer: 'Promise', hint: 'An async call gives the caller a future result.', explanation: 'The function returns Promise<string>, even though its body returns a plain string. await can obtain the fulfilled string.', solution: 'async function title(): Promise<string> {\n  return "TypeScript";\n}' },
    recap: ['async functions always return promises.', 'await exposes a promise’s fulfilled value.', 'Handle rejection and validate external payloads separately.'], relatedConcepts: ['async-await', 'promises', 'unknown'],
  },
  {
    id: 'practical-data-models', title: 'Practical Data Models', moduleId: 'real-world', minutes: 8,
    description: 'Design states that make contradictory combinations difficult to represent.',
    explanation: [
      'Several unrelated optional fields can accidentally permit impossible states: loading: true with an error and stale data, or loading: false with no result at all. A discriminated union can connect each state to exactly the information it needs.',
      'LoadState<T> has an idle state, a loading state, a ready state with data, and an error state with a message. A switch on status makes the allowed operations visible branch by branch.',
      'Good models move repeated assumptions into one contract. They still depend on honest runtime transitions and validated inputs, but they make accidental combinations and unhandled cases easier to detect while developing.',
    ],
    code: 'type LoadState<T> =\n  | { status: "idle" }\n  | { status: "loading" }\n  | { status: "ready"; data: T }\n  | { status: "error"; message: string };\n\nfunction describe(state: LoadState<string[]>): string {\n  switch (state.status) {\n    case "idle": return "Choose a course";\n    case "loading": return "Loading lessons";\n    case "ready": return `${state.data.length} lessons ready`;\n    case "error": return state.message;\n  }\n}\n\nconst message = describe({ status: "ready", data: ["Types", "Functions"] });',
    inspectSymbols: ['describe', 'message'],
    visual: flow('Each state owns its payload', 'A discriminated union describes complete states rather than unrelated switches and optional values.', [
      node('state', 'LoadState<T>', 'One of four mutually exclusive shapes.', 'type'),
      node('waiting', 'idle / loading', 'No payload is required while waiting.'),
      node('ready', 'ready + data: T', 'The result is present exactly in the ready state.', 'value'),
      node('error', 'error + message', 'A failure explains what happened.', 'error'),
    ], [{ from: 'state', to: 'waiting', label: 'waiting states' }, { from: 'state', to: 'ready', label: 'successful state' }, { from: 'state', to: 'error', label: 'failed state' }]),
    challenge: { id: 'practical-data-models-check', title: 'Complete a valid ready state', topic: 'Real world', difficulty: 'Advanced', kind: 'fix', prompt: 'Supply a string array as data while preserving the ready state and the LoadState contract.', code: 'type LoadState<T> =\n  | { status: "loading" }\n  | { status: "ready"; data: T };\nconst state: LoadState<string[]> = { status: "ready" };\nconst summary: string = state.status === "ready" ? state.data.join(", ") : "Loading";', answer: 'data', expectedTypes: { summary: 'string' }, validationCode: "type __UnderCodeStrings = __UnderCodeAssert<__UnderCodeEqual<LoadState<string[]>, { status: \"loading\" } | { status: \"ready\"; data: string[] }>>;\ntype __UnderCodeNumbers = __UnderCodeAssert<__UnderCodeEqual<LoadState<number>, { status: \"loading\" } | { status: \"ready\"; data: number }>>;\ntype __UnderCodeReady = __UnderCodeAssert<__UnderCodeEqual<typeof state.status, \"ready\">>;\ntype __UnderCodeData = __UnderCodeAssert<__UnderCodeEqual<typeof state.data, string[]>>;", hint: 'The ready member requires data of type string[].', explanation: 'A ready state must carry its payload. Adding data: ["Types"] supplies the required string array, so the narrowed branch can safely call join.', solution: 'type LoadState<T> =\n  | { status: "loading" }\n  | { status: "ready"; data: T };\nconst state: LoadState<string[]> = { status: "ready", data: ["Types"] };\nconst summary: string = state.status === "ready" ? state.data.join(", ") : "Loading";' },
    recap: ['Connect state labels to their required payloads.', 'Prefer complete variants over unrelated optional fields.', 'A model helps consumers handle every meaningful case.'], relatedConcepts: ['discriminated-unions', 'generic-interfaces', 'narrowing'],
  },
  {
    id: 'react-props', title: 'React Props / TypeScript in React', moduleId: 'real-world', minutes: 8,
    description: 'Apply object and function contracts to a component boundary.',
    explanation: [
      'A React component receives props as an object. Describe required text, optional presentation choices, and callbacks using the same types you already know. A callback such as (id: string) => void tells the parent what argument the component will provide.',
      'A default value can turn an optional prop into a definite value inside the function body. Literal unions make variants discoverable and reject misspelled choices.',
      'The editable example isolates the props contract in ordinary TypeScript so you can inspect it without a React runtime. The comparison shows how the same model fits a real TSX component. React-specific types such as ReactNode are useful for renderable children; import them when you build the component in a React project.',
    ],
    code: 'type LessonButtonProps = {\n  lessonId: string;\n  label: string;\n  variant?: "primary" | "quiet";\n  onSelect: (id: string) => void;\n};\n\nconst props: LessonButtonProps = {\n  lessonId: "generics",\n  label: "Start lesson",\n  onSelect: id => console.log(id),\n};\n\nconst variant = props.variant ?? "primary";\nprops.onSelect(props.lessonId);',
    inspectSymbols: ['props', 'variant'],
    comparison: { beforeLabel: 'A typed props contract', afterLabel: 'Using it in a React component (TSX)', before: 'type LessonButtonProps = {\n  lessonId: string;\n  label: string;\n  onSelect: (id: string) => void;\n};', after: 'function LessonButton({ lessonId, label, onSelect }: LessonButtonProps) {\n  return (\n    <button onClick={() => onSelect(lessonId)}>\n      {label}\n    </button>\n  );\n}' },
    visual: flow('A component has a boundary too', 'Props flow into the component; a typed callback communicates a user action back to the parent.', [
      node('parent', 'Parent', 'Provides lessonId, label, and an onSelect callback.'),
      node('props', 'LessonButtonProps', 'The shared object contract checks component usage.', 'type'),
      node('button', 'LessonButton', 'Displays the label and calls onSelect with the lesson id.'),
    ], [{ from: 'parent', to: 'props', label: 'supplies props' }, { from: 'props', to: 'button', label: 'checks inputs' }, { from: 'button', to: 'parent', label: 'onSelect(id)' }]),
    challenge: { id: 'react-props-check', title: 'Type the callback result', topic: 'Real world', difficulty: 'Intermediate', kind: 'fill', prompt: 'Complete the callback return type when the caller ignores the result.', code: 'type ButtonProps = {\n  onSelect: (id: string) => ___;\n};', answer: 'void', hint: 'The callback communicates through its action, with no useful result promised.', explanation: 'void tells the consumer not to rely on a return value. The string parameter still checks the identifier passed into the callback.', solution: 'type ButtonProps = {\n  onSelect: (id: string) => void;\n};' },
    recap: ['Props are ordinary object contracts.', 'Callback types describe events sent to a parent.', 'Optional values and literal variants work naturally at component boundaries.'], relatedConcepts: ['react-props', 'function-types', 'optional-properties'],
  },
  {
    id: 'final-challenge', title: 'Final Challenge', moduleId: 'real-world', minutes: 12,
    description: 'Bring models, unions, narrowing, and functions together in one learning summary.',
    explanation: [
      'A small feature can use several type relationships without becoming complicated. This course summary models lessons, represents completion as a literal state, filters by that state, and gives the caller a precise result.',
      'Read each boundary before changing the code: what shape does a lesson need, which states are valid, and what does summarize promise? Fix the mismatched values rather than removing the contracts that revealed them.',
      'After repairing the challenge, experiment with another lesson and a different state. Consider what would change if lesson records arrived from a server: the model stays useful, but those incoming values still need runtime validation.',
    ],
    code: 'type Lesson = {\n  id: string;\n  title: string;\n  status: "ready" | "complete";\n};\ntype Summary = { total: number; completed: number };\n\nfunction summarize(lessons: readonly Lesson[]): Summary {\n  return {\n    total: lessons.length,\n    completed: lessons.filter(lesson => lesson.status === "complete").length,\n  };\n}\n\nconst lessons: Lesson[] = [\n  { id: "types", title: "Types", status: "complete" },\n  { id: "generics", title: "Generics", status: "ready" },\n];\nconst summary = summarize(lessons);\nconst message = `${summary.completed} of ${summary.total} complete`;',
    inspectSymbols: ['lessons', 'summarize', 'summary', 'message'],
    visual: flow('From a model to a useful result', 'Small, explicit contracts connect the collection, the operation, and the interface that consumes its result.', [
      node('lessons', 'Lesson[]', 'Every record has an id, title, and valid status.', 'type'),
      node('filter', 'status === "complete"', 'The function counts records matching the completed state.'),
      node('summary', 'Summary', 'A stable shape with total and completed numbers.', 'type'),
      node('message', '"1 of 2 complete"', 'The UI can format the checked result.', 'value'),
    ]),
    challenge: { id: 'final-challenge-check', title: 'Repair the course summary', topic: 'Real world', difficulty: 'Advanced', kind: 'fix', prompt: 'Fix the invalid status and numeric result. Keep Lesson, Summary, summarize, lessons, and summary with their existing contracts.', code: 'type Lesson = { id: string; status: "ready" | "complete" };\ntype Summary = { total: number; completed: number };\nfunction summarize(lessons: Lesson[]): Summary {\n  return {\n    total: lessons.length.toString(),\n    completed: lessons.filter(lesson => lesson.status === "complete").length,\n  };\n}\nconst lessons: Lesson[] = [\n  { id: "types", status: "done" },\n  { id: "generics", status: "ready" },\n];\nconst summary: Summary = summarize(lessons);', answer: 'complete', expectedTypes: { lessons: 'Lesson[]', summary: 'Summary' }, validationCode: "type __UnderCodeLesson = __UnderCodeAssert<__UnderCodeEqual<__UnderCodeShape<Lesson>, { id: string; status: \"ready\" | \"complete\" }>>;\ntype __UnderCodeSummary = __UnderCodeAssert<__UnderCodeEqual<__UnderCodeShape<Summary>, { total: number; completed: number }>>;\ntype __UnderCodeSummarize = __UnderCodeAssert<__UnderCodeEqual<typeof summarize, (lessons: Lesson[]) => Summary>>;\ntype __UnderCodeLessonsValue = __UnderCodeAssert<__UnderCodeEqual<typeof lessons, Lesson[]>>;\ntype __UnderCodeSummaryValue = __UnderCodeAssert<__UnderCodeEqual<typeof summary, Summary>>;", hint: 'The allowed completed status is "complete". An array’s length is already numeric.', explanation: 'Changing "done" to "complete" satisfies the literal union. Returning lessons.length without toString satisfies Summary.total. The resulting summary has total 2 and completed 1.', solution: 'type Lesson = { id: string; status: "ready" | "complete" };\ntype Summary = { total: number; completed: number };\nfunction summarize(lessons: Lesson[]): Summary {\n  return {\n    total: lessons.length,\n    completed: lessons.filter(lesson => lesson.status === "complete").length,\n  };\n}\nconst lessons: Lesson[] = [\n  { id: "types", status: "complete" },\n  { id: "generics", status: "ready" },\n];\nconst summary: Summary = summarize(lessons);' },
    recap: ['Models connect valid data to useful operations.', 'Fix mismatches without weakening the contract.', 'Keep experimenting: change one input and explain the type feedback.'], relatedConcepts: ['object-shapes', 'literal-types', 'arrays', 'return-types', 'runtime-validation'],
  },
]
