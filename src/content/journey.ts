export interface CheckpointQuestion {
  id: string
  prompt: string
  options: string[]
  answer: string
  explanation: string
  lessonId: string
}
export interface StageProject {
  title: string
  brief: string
  starter: string
  mode: 'web' | 'console' | 'document' | 'react' | 'nextjs'
  criteria: string[]
  steps: string[]
}
export interface JourneyStage {
  courseId: string
  outcome: string
  bridge: string
  project: StageProject
  checkpoint: CheckpointQuestion[]
}

function q(id: string, prompt: string, options: string[], answer: string, explanation: string, lessonId: string): CheckpointQuestion { return { id, prompt, options, answer, explanation, lessonId } }

export const journey: JourneyStage[] = [
  { courseId: 'logic', outcome: 'Explain a solution as steps, decisions, and repetition.', bridge: 'You can now describe a solution. Next, discover the tools that turn it into a web page.', project: {
    title: 'Plan a basket calculator', mode: 'console', brief: 'Build a small calculator for a shop basket. Add the item prices, offer free delivery from a subtotal of 50, and explain the final total.', starter: 'const prices = [15, 20, 10];\n// 1. Add the prices.\n// 2. Choose delivery: 0 at a subtotal of 50 or more, otherwise 5.\n// 3. Print the final total.\n',
    steps: ['Write the inputs and expected outputs in your notes.', 'Build the calculation one step at a time.', 'Try an empty basket and a subtotal of exactly 50.'], criteria: ['Every price contributes to the subtotal.', 'A subtotal of exactly 50 receives free delivery.', 'The empty basket is handled deliberately.', 'I can explain the steps without reading the code.'],
  }, checkpoint: [
    q('logic-order', 'You need a final basket total. What should happen first?', ['Read prices and quantity', 'Display an uncalculated total', 'Choose a button color'], 'Read prices and quantity', 'A calculation needs its inputs before producing an output.', 'logic-instructions'),
    q('logic-boundary', 'Free delivery starts at 50. Which comparison includes exactly 50?', ['total >= 50', 'total > 50', 'total < 50'], 'total >= 50', 'The equality part includes the boundary.', 'logic-decisions'),
    q('logic-stop', 'A loop keeps adding 1 to a counter. What else does it need?', ['A reachable stopping condition', 'An image', 'A global stylesheet'], 'A reachable stopping condition', 'A terminating condition prevents endless repetition.', 'logic-repetition'),
  ] },
  { courseId: 'web', outcome: 'Navigate files, inspect a page, and explain local version history.', bridge: 'Your tools are ready. Use HTML to give your first page a meaningful structure.', project: {
    title: 'Set up your first web workspace', mode: 'document', brief: 'Plan a three-file website and practice finding evidence in browser developer tools. Record the folder structure and explain how you would save a meaningful version.', starter: 'Project folder:\n  index.html\n  styles.css\n  app.js\n\nWhat each file does:\n\nOne observation from the Elements panel:\n\nOne observation from the Network panel:\n\nHow I would review changes before a local commit:\n',
    steps: ['Create a project folder locally, or outline its structure here.', 'Inspect any public page using Elements and Network.', 'Explain the difference between a local commit and a push.'], criteria: ['Each file has an explained responsibility.', 'The stylesheet path matches its location.', 'I recorded an actual observation from developer tools.', 'I can distinguish saving, committing, and pushing.'],
  }, checkpoint: [
    q('web-structure', 'What gives a web page its content structure?', ['HTML', 'CSS', 'Git'], 'HTML', 'HTML expresses document structure and meaning.', 'web-browser'),
    q('web-path', 'styles.css is next to index.html. Which relative URL is appropriate?', ['./styles.css', './images/styles.css', '/a/random/folder'], './styles.css', './ starts from the current directory.', 'web-files'),
    q('web-history', 'A new local Git commit is created. Where is it published automatically?', ['Nowhere; pushing is separate', 'Every GitHub repository', 'The production website'], 'Nowhere; pushing is separate', 'Recording local history does not publish it.', 'web-version-control'),
  ] },
  { courseId: 'html', outcome: 'Create a semantic page that works with keyboard navigation.', bridge: 'Your content has structure. CSS will make its hierarchy and layout visible.', project: {
    title: 'Create a personal profile', mode: 'web', brief: 'Introduce yourself with a main heading, an about section, a list of interests, and a labeled contact form. Make the page understandable without styling.', starter: '<main>\n  <h1>Your name</h1>\n  <!-- Add an about section, interests, and a contact form. -->\n</main>',
    steps: ['Organize the content with headings and landmarks.', 'Add descriptive navigation and properly labeled inputs.', 'Use Tab to inspect the controls in the preview.'], criteria: ['There is a meaningful main heading and main region.', 'The heading order reflects the content structure.', 'Navigation link text describes its destination.', 'Inputs have visible labels connected by for and id.', 'Interactive elements are reachable using the keyboard.'],
  }, checkpoint: [
    q('html-label', 'What connects a visible label to its input?', ['Matching for and id', 'Matching colors', 'A placeholder only'], 'Matching for and id', 'The label’s for attribute references the input’s id.', 'html-forms'),
    q('html-action', 'Which element should save a draft on the current page?', ['button', 'div without keyboard support', 'h2'], 'button', 'A native button provides action semantics and keyboard activation.', 'html-accessibility'),
    q('html-list', 'Which structure represents a sequence of steps?', ['ol with li children', 'Several br tags', 'A heading for every word'], 'ol with li children', 'An ordered list communicates a meaningful sequence.', 'html-lists'),
  ] },
  { courseId: 'css', outcome: 'Make a responsive page with readable spacing and visible focus.', bridge: 'The page looks clear. JavaScript will let it respond to changing values and decisions.', project: {
    title: 'Style a responsive project gallery', mode: 'web', brief: 'Build on your profile idea with a gallery that uses one column on a small screen and multiple columns when space allows.', starter: '<style>\n/* Add spacing, readable colors, and a responsive grid. */\n</style>\n<main><h1>My projects</h1><div class="projects"><article><h2>Profile</h2><a href="#profile">View profile</a></article><article><h2>Gallery</h2><a href="#gallery">View gallery</a></article></div></main>',
    steps: ['Style the smallest layout first.', 'Introduce a grid breakpoint when the content needs it.', 'Inspect wide and narrow previews, then test keyboard focus.'], criteria: ['Small screens display a readable single column.', 'Wider screens use a deliberate grid.', 'Content does not overflow the preview.', 'Spacing distinguishes headings, content, and controls.', 'Links retain a visible focus indicator.'],
  }, checkpoint: [
    q('css-space', 'What creates space inside an element’s border?', ['padding', 'margin', 'href'], 'padding', 'Padding separates the content from the border.', 'css-box-model'),
    q('css-parent', 'Where should display: grid be applied?', ['The parent of the items', 'Only the last item', 'Every text node'], 'The parent of the items', 'The container establishes the layout for its children.', 'css-grid'),
    q('css-small', 'What is a useful starting point for a responsive gallery?', ['A readable small-screen layout', 'A fixed 1600px width', 'Hiding all text on phones'], 'A readable small-screen layout', 'Begin with usable content in small spaces and expand deliberately.', 'css-responsive'),
  ] },
  { courseId: 'javascript', outcome: 'Transform data with functions and handle asynchronous failures.', bridge: 'You can work with data. Connect those values to visible browser interactions next.', project: {
    title: 'Build a study-task data model', mode: 'console', brief: 'Represent study tasks with IDs, titles, and completion state. Write functions to find remaining tasks and return a new list with one task toggled.', starter: 'const tasks = [\n  { id: "read", title: "Read a lesson", done: true },\n  { id: "build", title: "Build a project", done: false },\n];\n\n// Write remainingTasks(tasks) and toggleTask(tasks, id).\n// Print the original and updated lists.\n',
    steps: ['Model tasks as objects with stable IDs.', 'Use filter to find unfinished tasks.', 'Use map and object spread to toggle one task without changing the original.'], criteria: ['Tasks have stable IDs and clear properties.', 'The remaining-task function works for an empty list.', 'Toggling returns a new array.', 'Unrelated tasks keep their existing values.', 'The original data remains unchanged.'],
  }, checkpoint: [
    q('js-map', 'Which operation returns one transformed value per array item?', ['map', 'filter', 'console.log'], 'map', 'map transforms each item; filter chooses a subset.', 'js-transform'),
    q('js-copy', 'How can you create an object with an updated done property?', ['{ ...task, done: true }', 'task = null', 'Delete every property'], '{ ...task, done: true }', 'Spreading creates a shallow copy; the later property replaces done on that copy.', 'js-objects'),
    q('js-reject', 'An awaited Promise rejects inside try. Where can recovery happen?', ['catch', 'A CSS selector', 'An export statement'], 'catch', 'await throws the rejection so the surrounding catch can handle it.', 'js-async'),
  ] },
  { courseId: 'browser', outcome: 'Build a working task interface with explicit state and feedback.', bridge: 'You have written the state-to-view loop yourself. React helps organize that loop into reusable components.', project: {
    title: 'Make an interactive study list', mode: 'web', brief: 'Connect your task data model to a form and a rendered list. Support adding and completing tasks, and show a useful message when nothing remains.', starter: '<form id="tasks-form"><label for="task-title">New task</label><input id="task-title" required><button>Add task</button></form>\n<p id="status" role="status"></p><ul id="tasks"></ul>\n<script>\nconst tasks = [];\n// Add a submit handler and render the list from tasks.\n</script>',
    steps: ['Handle submit on the form and validate the title.', 'Create DOM elements and set user text with textContent.', 'Keep a render function that derives the view from tasks.'], criteria: ['Keyboard and button submission both add tasks.', 'Blank or whitespace-only titles receive useful feedback.', 'User-entered text is rendered as text, not HTML.', 'Completing a task updates the data and visible view.', 'The empty state explains what to do next.'],
  }, checkpoint: [
    q('browser-null', 'querySelector finds no match. What does it return?', ['null', 'An automatically created element', 'true'], 'null', 'Check for null before using a selected element.', 'browser-dom'),
    q('browser-text', 'Which property should show a user-entered title as plain text?', ['textContent', 'innerHTML', 'outerHTML'], 'textContent', 'textContent does not parse the supplied value as markup.', 'browser-dom'),
    q('browser-empty', 'A request succeeds with an empty array. What should the UI show?', ['A useful empty state', 'A network failure', 'A permanent spinner'], 'A useful empty state', 'A successful empty result is different from an error.', 'browser-data-states'),
  ] },
  { courseId: 'react', outcome: 'Organize a stateful interface into components with clear inputs.', bridge: 'Your React model is in place. TypeScript can now describe the component and data contracts you already understand.', project: {
    title: 'Rebuild the study list in React', mode: 'react', brief: 'Use your browser project as the behavior specification. Build it with components, props, and state in a local React project. Keep this workspace as your component draft and review notes.', starter: 'import { useState } from "react";\n\nexport default function StudyList() {\n  const [tasks, setTasks] = useState([]);\n  // Add a controlled form and render tasks with stable keys.\n  return <main><h1>My study list</h1></main>;\n}',
    steps: ['Create the React project locally with a supported build tool.', 'Split the form and task item where each has a clear responsibility.', 'Use the same keyboard, validation, and empty-state scenarios as the browser version.'], criteria: ['Components have focused responsibilities.', 'Props are treated as read-only.', 'State updates create new values.', 'Repeated items use stable IDs as keys.', 'Keyboard, validation, and empty-state behavior were checked in the running app.'],
  }, checkpoint: [
    q('react-input', 'Where do a child component’s props come from?', ['Its parent', 'A global CSS file', 'Only its own state'], 'Its parent', 'Parents pass values to children through props.', 'react-jsx-props'),
    q('react-key', 'Which key is suitable for a reorderable list?', ['A stable ID from the data', 'Math.random() each render', 'Always the array index'], 'A stable ID from the data', 'Stable identity lets React follow an item between renders.', 'react-lists-keys'),
    q('react-effect', 'What is an effect primarily used for?', ['Synchronizing with an external system', 'Every derived value', 'Mutating props'], 'Synchronizing with an external system', 'Effects connect React to systems outside rendering.', 'react-effects'),
  ] },
  { courseId: 'typescript', outcome: 'Describe data contracts and narrow uncertain values deliberately.', bridge: 'You can model UI and its contracts. Next.js adds routes and explicit server/client boundaries.', project: {
    title: 'Add types to the study model', mode: 'console', brief: 'Give your task model a contract and model loading, success, and error as a discriminated union. Narrow the union before reading state-specific data.', starter: 'type Task = { id: string; title: string; done: boolean };\n\n// Define a LoadState union and a function that describes each state.\n// Try valid and invalid examples with the type checker.\n',
    steps: ['Define Task without using any.', 'Create state variants that only contain relevant properties.', 'Write a function that narrows by status before reading data.'], criteria: ['Task fields have deliberate types.', 'Loading, success, and error cannot be confused.', 'Data is only read after narrowing to success.', 'An invalid object is rejected by the checker.', 'I can explain why types do not validate network data at runtime.'],
  }, checkpoint: [
    q('ts-runtime', 'Does a TypeScript annotation validate an API response at runtime?', ['No; runtime validation is separate', 'Yes, automatically', 'Only if the type name is long'], 'No; runtime validation is separate', 'Type annotations are erased; external data still needs runtime checks.', 'why-typescript'),
    q('ts-narrow', 'How should you read a property that only exists on one union member?', ['Narrow to that member first', 'Use any everywhere', 'Ignore the possible variants'], 'Narrow to that member first', 'A guard establishes which variant is present.', 'union-types'),
    q('ts-generic', 'What is a generic useful for?', ['Preserving relationships between types', 'Fetching data automatically', 'Replacing all runtime logic'], 'Preserving relationships between types', 'A type parameter can connect an input type to an output type.', 'why-generics'),
  ] },
  { courseId: 'nextjs', outcome: 'Bring routes, rendering boundaries, and data states into one application.', bridge: 'Finish with a project review: explain the decisions, demonstrate recovery, and record what you would improve next.', project: {
    title: 'Capstone: a learning dashboard', mode: 'nextjs', brief: 'Build a local Next.js application with a dashboard, a project detail route, interactive task controls, and complete loading, empty, and error states. Document where data and interactivity belong.', starter: '// app/page.tsx\nexport default function Page() {\n  return <main><h1>Learning dashboard</h1></main>;\n}\n\n// Plan a detail route and a separate interactive client component.\n// Implement the project in a local Next.js workspace.\n',
    steps: ['Sketch the routes and decide what runs on the server or client.', 'Build the complete happy path with synthetic project data.', 'Demonstrate empty data, errors, keyboard use, and a narrow viewport.'], criteria: ['The dashboard and detail route can be opened directly.', 'Interactive components have intentional client boundaries.', 'Loading, empty, error, and success views are understandable.', 'Untrusted inputs are validated at the relevant boundary.', 'The app was checked with keyboard and narrow-screen use.', 'My review explains tradeoffs and the next improvement.'],
  }, checkpoint: [
    q('next-page', 'Which file provides UI for an App Router route?', ['page.tsx', 'route.ts', 'README.md'], 'page.tsx', 'page.tsx is the route UI entry point; route.ts defines a request handler.', 'next-file-routing'),
    q('next-client', 'Where should stateful button interaction live?', ['A Client Component', 'A CSS file', 'A metadata object'], 'A Client Component', 'Interactive state and browser event handlers need a client boundary.', 'next-client-components'),
    q('next-recovery', 'What should a failed data view offer?', ['A useful explanation and recovery action', 'A permanent spinner', 'A blank screen'], 'A useful explanation and recovery action', 'Users need to understand the failure and how to continue.', 'next-error-ui'),
  ] },
]

export function getStage(courseId: string | undefined) { return journey.find(stage => stage.courseId === courseId) }
export const experienceOptions = [
  { id: 'new', startCourseId: 'logic', assessCourseId: null, label: 'I am new to coding', labelId: 'Aku baru mulai coding', detail: 'Start with clear steps and small wins.', detailId: 'Mulai dari langkah sederhana dan hasil kecil.' },
  { id: 'markup', startCourseId: 'javascript', assessCourseId: 'css', label: 'I have built HTML/CSS pages', labelId: 'Aku pernah membuat halaman HTML/CSS', detail: 'Check your layout foundations before JavaScript.', detailId: 'Cek fondasi layout sebelum masuk JavaScript.' },
  { id: 'javascript', startCourseId: 'browser', assessCourseId: 'javascript', label: 'I know JavaScript basics', labelId: 'Aku sudah paham dasar JavaScript', detail: 'Connect your code to browser interactions.', detailId: 'Hubungkan kodemu dengan interaksi di browser.' },
  { id: 'react', startCourseId: 'typescript', assessCourseId: 'react', label: 'I have used React', labelId: 'Aku sudah pernah memakai React', detail: 'Check components and state, then add type contracts.', detailId: 'Cek components dan state, lalu lanjut ke kontrak tipe.' },
] as const
