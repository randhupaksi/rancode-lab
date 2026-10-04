import type { Challenge, Concept, CourseModule, Lesson } from './types'
import { flow, node } from './visuals'
import { reactExamples } from './react-examples'
import { nextExamples } from './next-examples'

type Seed = { id: string; title: string; moduleId: string; minutes: number; description: string; code: string; symbols: string[]; topic: string; question: string; answer: string; recap: string[] }

function graph(title: string, input: string, output: string) {
  return flow(title, 'Follow the information through the pattern. Select a node to read its role.', [
    node('input', input, 'A value enters this part of the pattern.', 'value'),
    node('logic', title, 'This focused piece decides how to use that value.'),
    node('output', output, 'A new value or view is ready for the next step.', 'type'),
  ], [{ from: 'input', to: 'logic', label: 'passes data' }, { from: 'logic', to: 'output', label: 'returns' }])
}

const frameworkPractice: Record<string, string> = {
  "react-components": "Render two Profile components locally with different names and roles. Run the label model with the same inputs and identify the component’s responsibility.",
  "react-jsx-props": "Change title and minutes in the model and predict its logged summary. Locally, pass new props to LessonCard without changing its implementation.",
  "react-state-events": "Run increment with count 0 and 2. Locally, click Counter twice and explain the render snapshot and queued updater. Keep useState before any early return.",
  "react-lists-keys": "Reverse the todo array and inspect the logged labels. Locally, reorder TaskList while retaining each task.id key; explain why indices identify positions.",
  "react-effects": "Run the connection model. Locally, toggle browser offline mode with OnlineStatus mounted; unmount it and explain how listener cleanup mirrors setup.",
  "react-composition-hooks": "Run toggle twice using each returned value. Locally, render two Details components and confirm opening one leaves the other closed.",
  "react-conditional-rendering": "Run screen with signedIn true and false. Locally, render Results with empty and populated arrays and check both branches.",
  "react-component-boundaries": "Change the model’s heading. Locally, change ProfileHeader while retaining Biography and explain their separate props and responsibilities.",
  "react-styling-ui": "Run cardClass with two tones. Locally, toggle Status’s done prop and style task/task-complete so the text and visual state agree.",
  "react-updating-objects": "Print the original profile beside subscribe’s result. Locally, edit Profile’s name and verify city remains unchanged and the original object is preserved.",
  "react-updating-arrays": "Add a second task and finish only read; compare original and returned arrays. Locally, toggle either task while preserving unrelated items and IDs.",
  "react-controlled-inputs": "Inspect changeEmail’s copied form. Locally, type into Search, add a button that clears query, and confirm the displayed input follows state.",
  "react-refs": "Change current in the ref model. Locally, activate FocusInput with the keyboard; verify focus moves and explain why ref updates do not render UI.",
  "react-effect-dependencies": "Run requestKey with two terms. Locally, change PageTitle’s title prop and verify document.title changes; explain the title dependency.",
  "react-effect-cleanup": "Inspect stop’s logged result. Locally, repeatedly mount and unmount Timer; verify one active timer per mount and explain Strict Mode’s development cleanup check.",
  "react-lifting-state": "Run select with two IDs. Locally, add another Input bound to Parent’s name; editing either must update both inputs and the greeting.",
  "react-context": "Run label with light and dark. Locally, nest Label under an intermediate component, then change the provider value and verify the consumer updates.",
  "react-reducer": "Run increment and an unknown action with the same state. Locally, add a Reset button dispatching reset and keep the reducer free of side effects.",
  "react-derived-state": "Change cart quantities and inspect total. Locally, change TaskSummary’s tasks and verify remaining updates without duplicate state or an effect.",
  "react-memo": "Run expensiveTotal with a larger array. Locally, measure Results before memoizing, then change items/query to verify both dependencies control the cache.",
  "react-callbacks": "Compare two newly created arrow functions by identity. Locally, change unrelated Counter state and compare AddButton renders with and without useCallback.",
  "react-transitions": "Run beginSearch with another term. Locally, type into Search with a large list; keep input updates urgent and compare the list transition with an ordinary update.",
  "react-accessibility": "Try canSubmit with an empty label and disabled true. Locally, navigate EmailField with the keyboard and confirm its visible label focuses the input.",
  "react-form-validation": "Try @, a@, a b@example.com, and learner@example.com in the email model. Locally, submit NameForm empty and populated; inspect associated field feedback.",
  "react-request-states": "Extend message to distinguish error and empty results. Locally, render Results with loading, error, empty success, and populated success fixtures.",
  "react-error-boundaries": "Run fallback with an error and a value. Locally, wrap a child that throws during render in ErrorBoundary and add a reset/remount recovery button.",
  "react-testing-behavior": "Run the scenario model. Locally, perform the Counter scenario in the comparison, then check failed submission and keyboard activation through visible UI outcomes.",
  "react-feature-architecture": "Inspect the model’s feature files. Locally, let a parent own tasks/onToggle while TaskList renders them; identify the public data and event contract.",
  "react-preserving-state": "Run editorKey with two IDs. Locally, type a draft, change person.id, and compare Draft with and without the key.",
  "react-virtualized-lists": "Run visible with windows at both array ends. Locally, change VisibleRows’s start/count and identify the scroll geometry, overscan, and keyboard behavior a complete virtualizer still needs.",
  "next-file-routing": "Create both page files and open /learn and /learn/react directly. Rename a folder and predict the URL change.",
  "next-layouts-dynamic": "Keep the generated root layout, add the learn layout and [slug] page, then visit two slugs. Await params and verify the shared navigation.",
  "next-server-components": "Run the async server page. Replace its synthetic helper with a server read and explain which fields may safely reach the UI.",
  "next-client-components": "Split Menu and Page into separate files and toggle the menu. Remove use client temporarily, inspect the error, then restore the Menu boundary.",
  "next-data-fetching": "Visit the page normally, with ?demo=empty, and with ?demo=error. Add loading.tsx/error.tsx from the companion lessons and inspect each state.",
  "next-metadata-route-handlers": "Create the page and endpoint separately. Inspect the document title; call /api/greeting?name=Ada and the URL without name, comparing status and JSON.",
  "next-link-navigation": "Create both pages and navigate using Link, including keyboard activation. Open each destination directly and verify the URLs.",
  "next-route-groups": "Create (learning)/learn with its group layout. Verify the URL excludes parentheses and avoid defining a second page for the same /learn route.",
  "next-not-found": "Open /learn/react and /learn/missing. Check that notFound stops rendering and that the segment fallback offers a working recovery link.",
  "next-streaming-suspense": "Run the delayed Progress example and reload directly. Verify the heading appears before progress; move the Suspense boundary and compare what waits.",
  "next-caching-revalidation": "Use the default App Router with Cache Components disabled. Inspect revalidate: 60, compare cache: no-store, and explain the freshness tradeoff for public data.",
  "next-server-actions": "Create the action and form, save a goal, and inspect its cookie. Send blank/oversized input and explain the additional permission checks for a sensitive write.",
  "next-loading-ui": "Create /learn with loading.tsx and the delayed page. Navigate and reload directly; inspect the loading message and its replacement by ready content.",
  "next-error-ui": "Run the failing demo and activate Try again. Verify segment containment and explain why its error.tsx cannot catch its own segment’s layout.",
  "next-fonts-images": "Add your own study.jpg with the stated dimensions and matching alt text. Resize the page and verify reserved image space and the font layout.",
  "next-forms-validation": "Render EmailForm from the server page. Check valid, blank, @, and whitespace-containing values; bypass browser hints and verify server errors and pending feedback.",
  "next-optimistic-ui": "Read the cookie in the server page and pass initialSaved. Toggle the bookmark; make saveBookmark throw and verify pending feedback and rollback.",
  "next-revalidate-path": "Visit /learn twice, invalidate its cache with the action, then revisit. Explain why a real mutation must complete successfully before invalidation.",
  "next-auth-boundaries": "Call the demo endpoint and inspect 403. Set the trusted adapter to editor, send invalid JSON, and explain why request-body roles cannot grant permission.",
  "next-route-handlers": "POST valid JSON, invalid JSON, missing title, and a whitespace-only title to /api/lessons. Compare statuses and identify where sensitive writes need authorization.",
  "next-code-splitting": "Create EditorPanel and Editor and render the panel from a server page. Toggle notes while inspecting network modules and the loading fallback. Measure before claiming a speed gain.",
  "next-client-boundaries": "Split CompletionButton from the server page and toggle it. Inspect which file needs use client while keeping data and surrounding layout on the server.",
  "next-seo-metadata": "Visit both known slugs and an unknown slug. Inspect title, description, and Open Graph fields; confirm they describe the visible lesson.",
  "next-web-vitals": "Mount Vitals in the root layout and inspect browser reports. Record a baseline, change one measured bottleneck, and compare the same loading/interaction scenario.",
  "next-environment-variables": "Use synthetic environment values and restart locally. Inspect /api/config and HelpLink; explain why the public URL is visible but the token must not be returned.",
  "next-deployment-checklist": "Build and start the local production app with the listed commands. Check success, unknown, empty, and error routes and record configuration differences from development.",
  "next-observability": "Call /api/demo and match the response requestId to the server log. Confirm the log has controlled context and no bodies, cookies, or credentials.",
  "next-security-headers": "Add the baseline headers, restart locally, and inspect network response headers. Explain the framing tradeoff and why validation/authorization are still necessary.",
  "next-full-route-review": "Assemble the companion route files. Check direct/detail URLs, empty/error queries, loading, recovery links, keyboard focus, narrow screens, and metadata.",
  "next-bundle-analysis": "Install the local analyzer and run the platform-specific command using the Webpack build. Narrow a client boundary and record the actual client-module size difference."
}

const frameworkDistractors: Record<string, [string, string]> = {
  "react-components": [
    "Every nested HTML tag needs its own component",
    "Only UI that owns state can be a component"
  ],
  "react-jsx-props": [
    "Its own state automatically",
    "A child component’s return value"
  ],
  "react-state-events": [
    "Inside the event handler that needs state",
    "Inside a condition when the component is visible"
  ],
  "react-lists-keys": [
    "The item’s current index in a reorderable list",
    "A random value created for each render"
  ],
  "react-effects": [
    "Recalculating a value that can be derived during render",
    "Handling every button click after rendering"
  ],
  "react-composition-hooks": [
    "One shared state instance across every call",
    "The DOM nodes of the first component"
  ],
  "react-conditional-rendering": [
    "A useEffect that directly edits the DOM",
    "The position of the JSX in the file"
  ],
  "react-component-boundaries": [
    "Whenever another HTML element is nested",
    "Only after a file reaches a fixed line count"
  ],
  "react-styling-ui": [
    "The current nesting depth of the DOM",
    "A random name unrelated to the component state"
  ],
  "react-updating-objects": [
    "Mutate the existing object, then pass it to the setter",
    "Replace the object with only the changed field"
  ],
  "react-updating-arrays": [
    "push, which updates an existing array in place",
    "forEach, whose return value is the new array"
  ],
  "react-controlled-inputs": [
    "Only from defaultValue after every render",
    "From direct DOM edits that bypass state"
  ],
  "react-refs": [
    "For the count displayed on a button",
    "For replacing every state value with mutable storage"
  ],
  "react-effect-dependencies": [
    "Only values that changed during the last render",
    "Only values you want to allow to rerun the effect"
  ],
  "react-effect-cleanup": [
    "Only after the next effect has already connected",
    "Only when the entire browser tab closes"
  ],
  "react-lifting-state": [
    "In a separate state copy inside each child",
    "In the deepest child even when its sibling needs it"
  ],
  "react-context": [
    "Every temporary input value in one global provider",
    "A replacement for every parent-to-child prop"
  ],
  "react-reducer": [
    "The action after mutating it",
    "A Promise that changes the old state later"
  ],
  "react-derived-state": [
    "In an effect that keeps duplicate state synchronized",
    "Only once when the component initializes"
  ],
  "react-memo": [
    "For every calculation regardless of cost",
    "To make an impure render function safe"
  ],
  "react-callbacks": [
    "So the callback always keeps its first render’s data",
    "Because ordinary event handlers cannot be recreated"
  ],
  "react-transitions": [
    "The state that controls each input keystroke",
    "A synchronous validation check before submitting"
  ],
  "react-accessibility": [
    "A div with an onClick handler alone",
    "An anchor with no destination for an in-page action"
  ],
  "react-form-validation": [
    "Only in the browser’s developer console",
    "In an unrelated panel without a field association"
  ],
  "react-request-states": [
    "Only success and a permanently hidden error",
    "A single ready state for every completed request"
  ],
  "react-error-boundaries": [
    "Automatic handling of every event-handler error",
    "A silent blank screen until the app reloads"
  ],
  "react-testing-behavior": [
    "Private state variable names",
    "The exact nesting of implementation components"
  ],
  "react-feature-architecture": [
    "A fixed number of files for every feature",
    "Separating each HTML tag into a different folder"
  ],
  "react-preserving-state": [
    "Changing a prop always resets all local state",
    "Changing a CSS class resets component identity"
  ],
  "react-virtualized-lists": [
    "Every item hidden only with CSS",
    "Only one item regardless of viewport size"
  ],
  "next-file-routing": [
    "layout.tsx, which defines shared wrapping UI",
    "route.ts, which defines an HTTP endpoint"
  ],
  "next-layouts-dynamic": [
    "A literal URL segment named [slug]",
    "A query-string value available only from searchParams"
  ],
  "next-server-components": [
    "Only after hydration in the browser",
    "Inside a browser click handler"
  ],
  "next-client-components": [
    "Whenever a component renders HTML",
    "Whenever a component awaits server data"
  ],
  "next-data-fetching": [
    "Only loading and success, because empty means failure",
    "Only success, with failures sent to the console"
  ],
  "next-metadata-route-handlers": [
    "In the Client Component before sending a request",
    "In a browser effect after the response arrives"
  ],
  "next-link-navigation": [
    "A button that assigns window.location for every link",
    "An onClick handler that rewrites the page HTML"
  ],
  "next-route-groups": [
    "Yes, including the parentheses",
    "Only when the group contains a layout"
  ],
  "next-not-found": [
    "Show an empty success view for every missing record",
    "Keep a permanent loading indicator"
  ],
  "next-streaming-suspense": [
    "Every asynchronous operation is automatically canceled",
    "A browser state update becomes a server mutation"
  ],
  "next-caching-revalidation": [
    "The longest duration that makes the build pass",
    "A fixed interval shared by all data regardless of use"
  ],
  "next-server-actions": [
    "Only in the input’s required attribute",
    "Only inside a client submit handler"
  ],
  "next-loading-ui": [
    "A permanent placeholder that hides completed content",
    "Internal server stack traces while data loads"
  ],
  "next-error-ui": [
    "A spinner with no way to leave the failure",
    "The complete server stack trace for every visitor"
  ],
  "next-fonts-images": [
    "To make every image load before all text",
    "To remove the need for meaningful alt text"
  ],
  "next-forms-validation": [
    "Only on the client because its UI owns the form",
    "Only when the browser’s validation is disabled"
  ],
  "next-optimistic-ui": [
    "Treating the optimistic result as permanently confirmed",
    "Skipping server validation to match the optimistic view"
  ],
  "next-revalidate-path": [
    "Before every attempted mutation, including failures",
    "Only when a browser refresh button is clicked"
  ],
  "next-auth-boundaries": [
    "Only by hiding the button in the browser",
    "By trusting a role supplied in the request JSON"
  ],
  "next-route-handlers": [
    "Trust the TypeScript annotation as runtime validation",
    "Perform the write first and validate its result afterward"
  ],
  "next-code-splitting": [
    "For every small function regardless of loading cost",
    "To move a server secret safely into client code"
  ],
  "next-client-boundaries": [
    "At the root of every page regardless of interactivity",
    "Around all data fetching even when it is server-only"
  ],
  "next-seo-metadata": [
    "The same generic title for every unrelated page",
    "Keywords unrelated to the visible route content"
  ],
  "next-web-vitals": [
    "A larger number of optimization hooks",
    "Build success alone without user measurements"
  ],
  "next-environment-variables": [
    "In a NEXT_PUBLIC_ variable referenced by a Client Component",
    "In a hidden HTML element that users cannot see"
  ],
  "next-deployment-checklist": [
    "Deploy first and use visitors to discover broken routes",
    "Check only the development homepage"
  ],
  "next-observability": [
    "The complete request body and all session cookies",
    "Only a generic failed message with no route context"
  ],
  "next-security-headers": [
    "Trust it whenever the browser sends an Origin header",
    "Use a type assertion instead of checking runtime values"
  ],
  "next-full-route-review": [
    "Only success because failures are developer concerns",
    "Only loading because empty data never occurs"
  ],
  "next-bundle-analysis": [
    "Whether every TypeScript type is erased correctly",
    "Whether a database transaction has committed"
  ]
}

function makeLessons(courseId: string, seeds: Seed[]): Lesson[] {
  return seeds.map((seed, index) => {
    const symbols = courseId === 'react' ? seed.symbols.filter(symbol => ['const', 'let', 'function'].some(keyword => seed.code.includes(`${keyword} ${symbol}`))) : seed.symbols
    const code = courseId === 'react' && !seed.code.includes('console.log') ? seed.code + '\nconsole.log(' + symbols.at(-1) + ');' : seed.code
    const authoredOptions = [seed.answer, ...frameworkDistractors[seed.id]]
    const options = [...authoredOptions.slice(index % 3), ...authoredOptions.slice(0, index % 3)]
    const challenge: Challenge = { language: courseId === 'react' ? 'javascript' : 'typescript', id: `${seed.id}-check`, title: `Check: ${seed.title}`, topic: seed.topic, difficulty: 'Beginner', kind: 'choice', prompt: seed.question, code, options, answer: seed.answer, hint: seed.recap[0], explanation: seed.description }
    const comparison = courseId === 'react'
      ? { beforeLabel: 'The model', before: code, afterLabel: 'In a React component', after: reactExamples[seed.id] ?? seed.code }
      : { beforeLabel: 'The model', before: code, afterLabel: 'In a local Next.js project', after: nextExamples[seed.id] }
    return { id: seed.id, courseId, title: seed.title, moduleId: seed.moduleId, minutes: seed.minutes, description: seed.description, language: courseId === 'react' ? 'javascript' : 'typescript', practice: frameworkPractice[seed.id], explanation: [seed.description, courseId === 'react' ? 'The editable example uses plain JavaScript to focus on the data and behavior. Read the component comparison to connect that model to React. TypeScript is introduced in the next stage.' : 'The editable example focuses on the underlying JavaScript and TypeScript model. The comparison connects it to a Next.js route.'], code, inspectSymbols: symbols, visual: graph(seed.title, symbols[0] ?? 'input', symbols.at(-1) ?? 'result'), challenge, recap: seed.recap, relatedConcepts: [`${courseId}-${seed.id}`], comparison }
  })
}

const reactSeeds: Seed[] = [
  { id: 'react-components', title: 'Thinking in Components', moduleId: 'react-foundations', minutes: 7, description: 'A component is a focused function that turns inputs into one meaningful part of an interface. Find product boundaries before splitting markup.', code: "\"use strict\";\nfunction profileLabel(profile) {\n    return `${profile.name} · ${profile.role}`;\n}\nconst label = profileLabel({ name: \"Ada\", role: \"Engineer\" });\nconsole.log(label);", symbols: ['Profile', 'profileLabel', 'label'], topic: 'React foundations', question: 'What should a well-scoped component represent?', answer: 'One meaningful piece of the interface', recap: ['Components describe focused pieces of UI.', 'They receive data and return a view.', 'Choose boundaries based on meaning and reuse.'] },
  { id: 'react-jsx-props', title: 'JSX and Props', moduleId: 'react-foundations', minutes: 7, description: 'JSX describes a UI tree, while props let a parent provide the values a child needs. Curly braces bring JavaScript expressions into JSX.', code: "\"use strict\";\nfunction summary({ title, minutes }) {\n    return `${title} · ${minutes} min`;\n}\nconst text = summary({ title: \"Props\", minutes: 7 });", symbols: ['LessonCardProps', 'summary', 'text'], topic: 'React foundations', question: 'Who provides a component’s props?', answer: 'Its parent', recap: ['JSX describes a UI tree.', 'Props are read-only inputs from a parent.', 'Props make the component’s inputs explicit.'] },
  { id: 'react-state-events', title: 'State and Events', moduleId: 'react-state', minutes: 8, description: 'State is a component’s changing memory. Hooks such as useState must be called at the top level of a React component or custom Hook, before early returns; never call them in conditions, loops, ordinary functions, or event handlers. Each render sees a state snapshot: setters queue the next render instead of changing the current handler’s variable. Use a pure updater when the next value depends on the previous queued state, and create new objects instead of mutating existing state.', code: "\"use strict\";\nfunction increment(counter) {\n    return { count: counter.count + 1 };\n}\nconst next = increment({ count: 2 });\nconsole.log(next.count);", symbols: ['Counter', 'increment', 'next'], topic: 'React state', question: 'Where may useState be called?', answer: 'At the top level of a React component or custom Hook', recap: ['Keep Hook calls in a stable order on every render.', 'Each render sees its own state snapshot.', 'Use pure updaters and create new state values.'] },
  { id: 'react-lists-keys', title: 'Lists and Keys', moduleId: 'react-state', minutes: 7, description: 'A list maps data to repeated UI. A stable key lets React recognize the same item when the list changes.', code: "\"use strict\";\nconst todos = [{ id: \"learn\", title: \"Learn keys\" }, { id: \"build\", title: \"Build a list\" }];\nconst labels = todos.map((todo) => `${todo.id}: ${todo.title}`);\nconsole.log(labels);", symbols: ['Todo', 'todos', 'labels'], topic: 'React state', question: 'What makes a good key for a list item?', answer: 'A stable ID from the data', recap: ['Map data to repeated UI.', 'Keys identify siblings between renders.', 'Use stable IDs when order can change.'] },
  { id: 'react-effects', title: 'Effects and External Systems', moduleId: 'react-effects', minutes: 8, description: 'Effects synchronize a component with something outside React, such as a browser API, timer, subscription, or request. Ordinary derived values belong in render.', code: "\"use strict\";\nfunction connect() {\n    return { active: true };\n}\nconst connection = connect();\nconsole.log(connection.active);", symbols: ['Connection', 'connect', 'connection'], topic: 'React effects', question: 'What is an effect for?', answer: 'Synchronizing with an external system', recap: ['Effects connect React to external systems.', 'Derived values usually belong in render.', 'Clean up subscriptions and timers.'] },
  { id: 'react-composition-hooks', title: 'Composition and Custom Hooks', moduleId: 'react-effects', minutes: 8, description: 'Composition gives one component structure while another provides content. A custom Hook packages reusable stateful logic without sharing component state.', code: "\"use strict\";\nfunction toggle(value) {\n    return { on: !value.on };\n}\nconst nextToggle = toggle({ on: false });\nconsole.log(nextToggle.on);", symbols: ['Toggle', 'toggle', 'nextToggle'], topic: 'React effects', question: 'What does a custom Hook reuse?', answer: 'Stateful logic', recap: ['Composition combines focused pieces.', 'Custom Hooks package stateful logic.', 'Each use receives its own state.'] },
]

const nextSeeds: Seed[] = [
  { id: 'next-file-routing', title: 'File-based Routing', moduleId: 'next-routing', minutes: 7, description: 'In the App Router, folders and special files describe routes. A page file is the UI entry point for one URL segment.', code: 'const segments = ["learn", "react"];\nconst path = `/${segments.join("/")}`;\nconsole.log(path);', symbols: ['segments', 'path'], topic: 'Next.js routing', question: 'Which file defines UI for a route in the App Router?', answer: 'page.tsx', recap: ['Folders describe URL segments.', 'page.tsx renders a route.', 'Keep route UI close to its route.'] },
  { id: 'next-layouts-dynamic', title: 'Layouts and Dynamic Segments', moduleId: 'next-routing', minutes: 8, description: 'Layouts provide shared structure for related routes. A bracketed folder captures a URL value so a route can find the resource it needs.', code: 'type Params = { slug: string };\nfunction lessonPath({ slug }: Params) { return `/learn/${slug}`; }\nconst url = lessonPath({ slug: "react-state" });', symbols: ['Params', 'lessonPath', 'url'], topic: 'Next.js routing', question: 'What does [slug] represent in a route folder?', answer: 'A value captured from the URL', recap: ['Layouts wrap related child routes.', 'Dynamic segments capture URL values.', 'Validate missing or invalid data.'] },
  { id: 'next-server-components', title: 'Server Components', moduleId: 'next-rendering', minutes: 8, description: 'Server Components render on the server by default. They can fetch data close to the component without shipping their implementation to the browser.', code: 'type Lesson = { title: string };\nasync function getLesson(): Promise<Lesson> { return { title: "Server Components" }; }\nconst lesson = await getLesson();\nconsole.log(lesson.title);', symbols: ['Lesson', 'getLesson', 'lesson'], topic: 'Next.js rendering', question: 'Where do Server Components render by default?', answer: 'On the server', recap: ['App Router components are server components by default.', 'They can await data directly.', 'Their code is not automatically sent to the browser.'] },
  { id: 'next-client-components', title: 'Client Components', moduleId: 'next-rendering', minutes: 8, description: 'Use "use client" at the boundary that needs browser state, effects, or event handlers. Keep that boundary small so the browser receives only what it needs.', code: 'type Menu = { open: boolean };\nfunction toggleMenu(menu: Menu): Menu { return { open: !menu.open }; }\nconst nextMenu = toggleMenu({ open: false });\nconsole.log(nextMenu.open);', symbols: ['Menu', 'toggleMenu', 'nextMenu'], topic: 'Next.js rendering', question: 'When is "use client" needed?', answer: 'When a component needs browser interactivity', recap: ['Client Components enable browser APIs and state.', 'The directive creates a client boundary.', 'Keep client boundaries narrow.'] },
  { id: 'next-data-fetching', title: 'Data Fetching and States', moduleId: 'next-experience', minutes: 8, description: 'Fetch data where it is needed, then deliberately design loading, success, empty, and error states. Request data has a lifecycle, not only a final value.', code: 'type Result = { title: string };\nasync function fetchLesson(): Promise<Result> { return { title: "Data Fetching" }; }\nconst result = await fetchLesson();\nconsole.log(result.title);', symbols: ['Result', 'fetchLesson', 'result'], topic: 'Next.js experience', question: 'What should a data-driven route plan for?', answer: 'Loading, success, empty, and error states', recap: ['Fetch data close to its consumer.', 'Plan for each request state.', 'Keep data shape explicit.'] },
  { id: 'next-metadata-route-handlers', title: 'Metadata and Route Handlers', moduleId: 'next-experience', minutes: 8, description: 'Metadata describes a route for people and browsers. Route Handlers create server endpoints that should validate input and return clear responses.', code: 'type Input = { name: string };\ntype Output = { greeting: string };\nfunction greet(input: Input): Output { return { greeting: `Hello, ${input.name}` }; }\nconsole.log(greet({ name: "Mira" }).greeting);', symbols: ['Input', 'Output', 'greet'], topic: 'Next.js experience', question: 'Where should sensitive Route Handler work run?', answer: 'On the server', recap: ['Metadata belongs with the route it describes.', 'Route Handlers create HTTP endpoints.', 'Validate data at the server boundary.'] },
]

type ExpansionSeed = Omit<Seed, 'minutes'> & { minutes?: number }

function expandSeed(seed: ExpansionSeed): Seed {
  return {
    ...seed,
    minutes: seed.minutes ?? 7,
  }
}

const reactExpansionSeeds: Seed[] = [
  expandSeed({ id: 'react-conditional-rendering', title: 'Conditional Rendering', moduleId: 'react-foundations', description: 'Use ordinary JavaScript conditions to choose the UI that matches the current data. Keep each branch meaningful enough to read on its own.', code: "\"use strict\";\nfunction screen(session) {\n    return session.signedIn ? \"Dashboard\" : \"Sign in\";\n}\nconst view = screen({ signedIn: true });", symbols: ['Session', 'screen', 'view'], topic: 'React foundations', question: 'What should decide which UI branch React renders?', answer: 'The current data and state', recap: ['Conditions select the appropriate view.', 'Keep branches readable.', 'Do not use effects to derive conditional UI.'] }),
  expandSeed({ id: 'react-component-boundaries', title: 'Choosing Component Boundaries', moduleId: 'react-foundations', description: 'Split a component when a part has its own responsibility, state, or reuse value. The goal is a map of clear ideas, not the smallest possible files.', code: "\"use strict\";\nfunction sectionSummary(section) {\n    return `${section.heading}: ${section.body}`;\n}\nconst summary = sectionSummary({ heading: \"Profile\", body: \"Account details\" });", symbols: ['Section', 'sectionSummary', 'summary'], topic: 'React foundations', question: 'When is a separate component useful?', answer: 'When a part has a clear responsibility or reuse value', recap: ['Components should have a clear job.', 'Split by meaning, not by arbitrary markup depth.', 'Keep closely related code together.'] }),
  expandSeed({ id: 'react-styling-ui', title: 'Styling a Component', moduleId: 'react-foundations', description: 'Styles should reinforce component states and hierarchy. Build class names from meaningful variants instead of tying style decisions to fragile DOM structure.', code: "\"use strict\";\nfunction cardClass(tone) {\n    return `card card--${tone}`;\n}\nconst className = cardClass(\"highlight\");", symbols: ['Tone', 'cardClass', 'className'], topic: 'React foundations', question: 'What should a styling variant describe?', answer: 'A meaningful visual state or role', recap: ['Use names that describe purpose.', 'Keep visual states explicit.', 'Let component structure guide styling boundaries.'] }),
  expandSeed({ id: 'react-updating-objects', title: 'Updating Objects in State', moduleId: 'react-state', description: 'State updates replace the old value with a new one. Copy the object and change only the field that the event is responsible for.', code: "\"use strict\";\nfunction subscribe(profile) {\n    return { ...profile, subscribed: true };\n}\nconst next = subscribe({ name: \"Ari\", subscribed: false });", symbols: ['Profile', 'subscribe', 'next'], topic: 'React state', question: 'How should an object state update be written?', answer: 'Create a new object with the changed field', recap: ['Treat state as immutable.', 'Copy before changing a field.', 'Each event should make one clear transition.'] }),
  expandSeed({ id: 'react-updating-arrays', title: 'Updating Arrays in State', moduleId: 'react-state', description: 'Array operations such as map, filter, and spread create a new collection. They make adding, changing, and removing items predictable.', code: "\"use strict\";\nfunction finish(tasks, id) {\n    return tasks.map(task => task.id === id ? { ...task, done: true } : task);\n}\nconst tasks = finish([{ id: \"read\", done: false }], \"read\");", symbols: ['Task', 'finish', 'tasks'], topic: 'React state', question: 'Which array method is useful for changing one item?', answer: 'map', recap: ['Map changes matching items.', 'Filter removes items.', 'New arrays preserve React state updates.'] }),
  expandSeed({ id: 'react-controlled-inputs', title: 'Controlled Inputs', moduleId: 'react-state', description: 'A controlled input displays a value from state and reports changes through an event. This gives the UI one dependable source of truth.', code: "\"use strict\";\nfunction changeEmail(form, email) {\n    return { ...form, email };\n}\nconst draft = changeEmail({ email: \"\" }, \"hi@underco.de\");", symbols: ['Form', 'changeEmail', 'draft'], topic: 'React state', question: 'Where does a controlled input get its displayed value?', answer: 'From component state', recap: ['State owns the displayed value.', 'Events create the next value.', 'Controlled inputs make validation easier.'] }),
  expandSeed({ id: 'react-refs', title: 'Refs and DOM Values', moduleId: 'react-effects', description: 'A ref stores a value that React does not need to render, such as a DOM node, timer ID, or previous value. Updating it does not trigger a render.', code: "\"use strict\";\nconst focusTarget = { current: null };\nfocusTarget.current = \"search-input\";\nconsole.log(focusTarget.current);", symbols: ['Ref', 'focusTarget'], topic: 'React effects', question: 'When is a ref appropriate?', answer: 'For a value that does not affect rendering', recap: ['Refs persist between renders.', 'Changing a ref does not re-render.', 'Use refs for DOM and imperative integrations.'] }),
  expandSeed({ id: 'react-effect-dependencies', title: 'Effect Dependencies', moduleId: 'react-effects', description: 'An effect must declare every reactive value it reads. The dependency list communicates when React needs to synchronize the external system again.', code: "\"use strict\";\nfunction requestKey(query) {\n    return `search:${query.term}`;\n}\nconst key = requestKey({ term: \"hooks\" });", symbols: ['Query', 'requestKey', 'key'], topic: 'React effects', question: 'What belongs in an effect dependency list?', answer: 'Every reactive value read by the effect', recap: ['Dependencies describe synchronization inputs.', 'Do not omit values to silence a rerun.', 'Move non-reactive work outside the effect when possible.'] }),
  expandSeed({ id: 'react-effect-cleanup', title: 'Cleaning Up Effects', moduleId: 'react-effects', description: 'Subscriptions, timers, and listeners need a cleanup function so an old connection cannot keep running after the component changes or leaves the page.', code: "\"use strict\";\nfunction stop(timer) {\n    return { active: false };\n}\nconst cleared = stop({ active: true });", symbols: ['Timer', 'stop', 'cleared'], topic: 'React effects', question: 'When does React run an effect cleanup?', answer: 'Before re-synchronizing and when the component unmounts', recap: ['Clean up external resources.', 'Avoid duplicate subscriptions.', 'Match setup and cleanup responsibilities.'] }),
  expandSeed({ id: 'react-lifting-state', title: 'Lifting State Up', moduleId: 'react-composition', description: 'When two components must agree on a value, move that state to their closest shared parent. Pass the value and event callbacks down as props.', code: "\"use strict\";\nfunction select(_, activeId) {\n    return { activeId };\n}\nconst state = select({ activeId: \"one\" }, \"two\");", symbols: ['Selection', 'select', 'state'], topic: 'React composition', question: 'Where should shared state live?', answer: 'In the closest common parent', recap: ['One owner keeps shared UI in sync.', 'Children receive values through props.', 'Children report intent through callbacks.'] }),
  expandSeed({ id: 'react-context', title: 'Context Without Prop Drilling', moduleId: 'react-composition', description: 'Context makes a stable value available to a distant subtree. It works best for broadly needed concerns such as theme, locale, or authenticated user information.', code: "\"use strict\";\nfunction label(theme) {\n    return `Theme: ${theme}`;\n}\nconst text = label(\"dark\");", symbols: ['Theme', 'label', 'text'], topic: 'React composition', question: 'What is a good use for Context?', answer: 'A broadly needed stable value', recap: ['Context avoids passing a value through many layers.', 'Keep providers focused.', 'Do not put every changing value in one context.'] }),
  expandSeed({ id: 'react-reducer', title: 'Reducers for Complex State', moduleId: 'react-composition', description: 'A reducer gathers related state transitions in one function. Actions describe what happened, while the reducer decides the next state.', code: "\"use strict\";\nfunction reducer(state, action) {\n    return action.type === \"increment\" ? { count: state.count + 1 } : state;\n}\nconst next = reducer({ count: 0 }, { type: \"increment\" });", symbols: ['State', 'Action', 'reducer', 'next'], topic: 'React composition', question: 'What should a reducer return?', answer: 'The next state', recap: ['Actions describe events.', 'Reducers centralize related transitions.', 'Keep reducers pure and predictable.'] }),
  expandSeed({ id: 'react-derived-state', title: 'Deriving Values During Render', moduleId: 'react-composition', description: 'If a value can be calculated from props or state, calculate it during render. Storing a duplicate introduces a second value that can fall out of sync.', code: "\"use strict\";\nfunction total(items) {\n    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);\n}\nconst amount = total([{ price: 12, quantity: 2 }]);", symbols: ['CartItem', 'total', 'amount'], topic: 'React composition', question: 'Where should a value derived from state be calculated?', answer: 'During render', recap: ['Derive values when possible.', 'Avoid duplicated state.', 'Use an event only when user intent changes stored data.'] }),
  expandSeed({ id: 'react-memo', title: 'Memoizing Expensive Work', moduleId: 'react-performance', description: 'Memoization is a targeted optimization for calculations that are noticeably expensive. First keep renders pure and measure where the actual cost lives.', code: "\"use strict\";\nfunction expensiveTotal(values) {\n    return values.reduce((sum, value) => sum + value, 0);\n}\nconst total = expensiveTotal([2, 4, 8]);\nconsole.log(total);", symbols: ['expensiveTotal', 'total'], topic: 'React performance', question: 'When should you add memoization?', answer: 'After finding a meaningful performance cost', recap: ['Measure before optimizing.', 'Memoization caches a calculation.', 'Keep inputs and outputs predictable.'] }),
  expandSeed({ id: 'react-callbacks', title: 'Stable Callbacks', moduleId: 'react-performance', description: 'A callback changes identity when it is created again. Stabilize one only when a memoized child or Hook contract needs that stable reference.', code: "\"use strict\";\nconst save = () => \"saved\";\nconst result = save();\nconsole.log(result);", symbols: ['Action', 'save', 'result'], topic: 'React performance', question: 'Why might a callback need a stable reference?', answer: 'A memoized consumer depends on its identity', recap: ['Functions are values too.', 'Stable callbacks are an optimization.', 'Do not add them by default.'] }),
  expandSeed({ id: 'react-transitions', title: 'Transitions and Responsive UI', moduleId: 'react-performance', description: 'A transition marks a state update as non-urgent so typing and direct feedback can remain responsive while a larger view catches up.', code: "\"use strict\";\nfunction beginSearch(term) {\n    return { term, pending: true };\n}\nconst search = beginSearch(\"react\");", symbols: ['Search', 'beginSearch', 'search'], topic: 'React performance', question: 'What kind of update suits a transition?', answer: 'A non-urgent view update', recap: ['Urgent input should stay responsive.', 'Transitions communicate priority.', 'Use them around noticeable work.'] }),
  expandSeed({ id: 'react-accessibility', title: 'Accessible Interactive UI', moduleId: 'react-performance', description: 'Use native elements for their native jobs, then verify keyboard focus, visible labels, and feedback. Accessibility is part of a component contract.', code: "\"use strict\";\nfunction canSubmit(button) {\n    return !button.disabled && button.label.length > 0;\n}\nconst ready = canSubmit({ label: \"Save\", disabled: false });", symbols: ['Button', 'canSubmit', 'ready'], topic: 'React performance', question: 'What is the first choice for a clickable action?', answer: 'A native button element', recap: ['Prefer semantic HTML.', 'Every control needs a usable name.', 'Test keyboard and focus behavior.'] }),
  expandSeed({ id: 'react-form-validation', title: 'Form Validation', moduleId: 'react-practice', description: 'Validate the data model at the moment it matters, then communicate errors close to the field. A valid form is an explicit state, not a guess. This email model uses a limited lesson rule: one @, no whitespace, a dotted domain, and at most 254 characters; it is not a full email standards parser.', code: "\"use strict\";\nfunction isValidEmail(email) {\n    return email.value.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.value);\n}\nconst valid = isValidEmail({ value: \"hello@underco.de\" });", symbols: ['Email', 'isValidEmail', 'valid'], topic: 'React practice', question: 'Where should an input error be shown?', answer: 'Close to the field it describes', recap: ['Validate user input deliberately.', 'Connect errors to their fields.', 'Keep submission state explicit.'] }),
  expandSeed({ id: 'react-request-states', title: 'Request States in React', moduleId: 'react-practice', description: 'A request can be idle, loading, successful, empty, or failed. Model those states clearly so the interface never leaves people guessing.', code: "\"use strict\";\nfunction message(state) {\n    return state === \"idle\" ? \"Choose a search\" : state === \"loading\" ? \"Loading…\" : state === \"error\" ? \"Could not load\" : state === \"empty\" ? \"No results\" : \"Ready\";\n}\nconst text = message(\"loading\");", symbols: ['Request', 'message', 'text'], topic: 'React practice', question: 'Which state should a request UI handle besides success?', answer: 'Loading and error states', recap: ['Requests have a lifecycle.', 'Plan empty results too.', 'Keep retry and recovery visible.'] }),
  expandSeed({ id: 'react-error-boundaries', title: 'Recovering From Render Errors', moduleId: 'react-practice', description: 'An Error Boundary gives a failed part of the interface a contained fallback. Pair it with a useful recovery action and enough context for debugging.', code: "\"use strict\";\nfunction fallback(result) {\n    return result.error ?? result.value ?? \"Try again\";\n}\nconst text = fallback({ error: \"Could not load profile\" });", symbols: ['Result', 'fallback', 'text'], topic: 'React practice', question: 'What should an error boundary provide?', answer: 'A contained fallback UI', recap: ['Contain failures when possible.', 'Give people a recovery path.', 'Log enough context to diagnose errors.'] }),
  expandSeed({ id: 'react-testing-behavior', title: 'Testing User Behavior', moduleId: 'react-practice', description: 'A useful component test checks what a person can see and do: render a state, interact, and observe the result. This protects behavior through refactors.', code: "\"use strict\";\nconst test = { name: \"submits form\", expected: \"success message\" };\nconsole.log(test.expected);", symbols: ['TestCase', 'test'], topic: 'React practice', question: 'What should a component test focus on?', answer: 'Observable user behavior', recap: ['Test behavior over implementation details.', 'Cover important states.', 'Keep tests readable as product documentation.'] }),
  expandSeed({ id: 'react-feature-architecture', title: 'Organizing a React Feature', moduleId: 'react-practice', description: 'Group a feature around the work it owns: UI, stateful logic, data boundary, and tests. The folder should help a new reader find the next question quickly.', code: "\"use strict\";\nconst profile = { name: \"profile\", files: [\"ProfileCard\", \"useProfile\"] };\nconsole.log(profile.files);", symbols: ['Feature', 'profile'], topic: 'React practice', question: 'What should guide a feature folder?', answer: 'The responsibility the feature owns', recap: ['Organize around product responsibilities.', 'Keep public boundaries small.', 'Let related code live together.'] }),
  expandSeed({ id: 'react-preserving-state', title: 'Preserving and Resetting State', moduleId: 'react-composition', description: 'React preserves state for a component in the same position in the tree. Change a key when a new identity should begin with fresh state.', code: "\"use strict\";\nfunction editorKey(editor) {\n    return `editor:${editor.documentId}`;\n}\nconst key = editorKey({ documentId: \"lesson-1\", draft: \"\" });", symbols: ['Editor', 'editorKey', 'key'], topic: 'React composition', question: 'What can intentionally reset a component’s state?', answer: 'Changing its key', recap: ['State belongs to a tree position.', 'Keys establish component identity.', 'Reset only when a new identity is intended.'] }),
  expandSeed({ id: 'react-virtualized-lists', title: 'Rendering Long Lists Responsibly', moduleId: 'react-performance', description: 'A very long list can make interaction slow because the browser must create and update many nodes. Virtualize only when the visible window is a small part of the full collection.', code: "\"use strict\";\nfunction visible(items, window) {\n    return items.slice(window.start, window.end);\n}\nconst rows = visible([\"a\", \"b\", \"c\", \"d\"], { start: 1, end: 3 });", symbols: ['Window', 'visible', 'rows'], topic: 'React performance', question: 'What does list virtualization render?', answer: 'A small visible window, often with nearby overscan', recap: ['Measure list cost first.', 'Render the visible window when needed.', 'Keep keyboard navigation and semantics intact.'] }),
]

const nextExpansionSeeds: Seed[] = [
  expandSeed({ id: 'next-link-navigation', title: 'Navigation with Link', moduleId: 'next-routing', description: 'Use Link for in-app navigation so Next.js can preserve the application experience and prefetch likely destinations when appropriate.', code: 'function lessonHref(course: string, lesson: string) {\n  return `/learn/${course}/${lesson}`;\n}\n\nconst href = lessonHref("react", "state");', symbols: ['lessonHref', 'href'], topic: 'Next.js routing', question: 'Which component should handle an in-app route change?', answer: 'Link', recap: ['Use Link for internal navigation.', 'Write route paths deliberately.', 'Keep navigation labels descriptive.'] }),
  expandSeed({ id: 'next-route-groups', title: 'Route Groups and Organization', moduleId: 'next-routing', description: 'A route group organizes related folders without adding a URL segment. It is useful when sections need separate layouts or ownership while keeping clean URLs.', code: 'const folder = "(marketing)";\nconst visibleSegment = folder.startsWith("(") ? "" : folder;\nconsole.log(visibleSegment);', symbols: ['folder', 'visibleSegment'], topic: 'Next.js routing', question: 'Does a route group appear in the URL?', answer: 'No', recap: ['Route groups organize files.', 'They do not change the URL.', 'Use them for layout and ownership boundaries.'] }),
  expandSeed({ id: 'next-not-found', title: 'Not Found States', moduleId: 'next-routing', description: 'Call notFound when a requested resource does not exist or cannot be shown. A dedicated not-found UI makes an invalid route feel intentional and recoverable.', code: 'type Lesson = { title: string } | null;\n\nfunction isMissing(lesson: Lesson) {\n  return lesson === null;\n}\n\nconst missing = isMissing(null);', symbols: ['Lesson', 'isMissing', 'missing'], topic: 'Next.js routing', question: 'What should a route do for missing data?', answer: 'Render a deliberate not-found state', recap: ['Missing data is a normal route state.', 'Keep recovery navigation visible.', 'Do not render a broken empty page.'] }),
  expandSeed({ id: 'next-streaming-suspense', title: 'Streaming with Suspense', moduleId: 'next-rendering', description: 'Suspense lets a route reveal ready UI while a slower child is still loading. Put boundaries around meaningful sections so the fallback matches the work.', code: 'type Section = { ready: boolean };\n\nfunction status(section: Section) {\n  return section.ready ? "Content ready" : "Loading section";\n}\n\nconst text = status({ ready: false });', symbols: ['Section', 'status', 'text'], topic: 'Next.js rendering', question: 'What does a Suspense boundary allow?', answer: 'Part of a route to load independently', recap: ['Stream meaningful route sections.', 'Use useful loading fallbacks.', 'Do not hide the whole page for one slow detail.'] }),
  expandSeed({ id: 'next-caching-revalidation', title: 'Caching and Revalidation', moduleId: 'next-rendering', description: 'Choose freshness based on the data people need, then set a clear cache and revalidation strategy. Caching is a product decision as much as a performance one.', code: 'type CacheRule = { seconds: number };\n\nfunction isFresh(rule: CacheRule, age: number) {\n  return age < rule.seconds;\n}\n\nconst fresh = isFresh({ seconds: 60 }, 24);', symbols: ['CacheRule', 'isFresh', 'fresh'], topic: 'Next.js rendering', question: 'What should determine a revalidation window?', answer: 'How fresh the user needs the data to be', recap: ['Decide data freshness intentionally.', 'Cache keys should reflect the request.', 'Revalidate after meaningful changes.'] }),
  expandSeed({ id: 'next-server-actions', title: 'Server Actions', moduleId: 'next-rendering', description: 'Server Actions handle a form mutation close to the route that owns it. Treat their input as untrusted and return a clear success or error state.', code: 'type Input = { title: string };\n\nfunction normalize(input: Input) {\n  return { title: input.title.trim() };\n}\n\nconst data = normalize({ title: " New lesson " });', symbols: ['Input', 'normalize', 'data'], topic: 'Next.js rendering', question: 'Where should Server Action input be validated?', answer: 'On the server', recap: ['Server Actions own server mutations.', 'Validate every input.', 'Return a state the form can present.'] }),
  expandSeed({ id: 'next-loading-ui', title: 'Loading UI Files', moduleId: 'next-experience', description: 'A loading file supplies an immediate route-level fallback. Make it resemble the incoming content so people understand what is on its way.', code: 'type Loading = { label: string };\n\nconst loading: Loading = { label: "Loading lessons…" };\nconsole.log(loading.label);', symbols: ['Loading', 'loading'], topic: 'Next.js experience', question: 'What should a loading UI communicate?', answer: 'What content is currently being prepared', recap: ['Loading is part of the route design.', 'Match the layout where possible.', 'Keep it quick and informative.'] }),
  expandSeed({ id: 'next-error-ui', title: 'Route Error Recovery', moduleId: 'next-experience', description: 'An error file contains a failure within its route segment and can offer a retry. Write the fallback for the person seeing it, not only the developer reading logs.', code: 'type Failure = { message: string; retryable: boolean };\n\nfunction action(failure: Failure) {\n  return failure.retryable ? "Try again" : "Return home";\n}\n\nconst nextStep = action({ message: "Unavailable", retryable: true });', symbols: ['Failure', 'action', 'nextStep'], topic: 'Next.js experience', question: 'What is a useful route error fallback?', answer: 'A clear explanation with a recovery action', recap: ['Contain errors to a route segment.', 'Offer retry when appropriate.', 'Keep technical details out of the main message.'] }),
  expandSeed({ id: 'next-fonts-images', title: 'Fonts and Images', moduleId: 'next-experience', description: 'Load fonts and images with their display behavior in mind. Reserve image space and avoid shifting content after a person has started reading.', code: 'type ImageSize = { width: number; height: number };\n\nfunction ratio(size: ImageSize) {\n  return size.width / size.height;\n}\n\nconst aspect = ratio({ width: 1200, height: 800 });', symbols: ['ImageSize', 'ratio', 'aspect'], topic: 'Next.js experience', question: 'Why should an image have known dimensions?', answer: 'To reserve space and avoid layout shift', recap: ['Reserve image space.', 'Load fonts deliberately.', 'Protect reading and interaction stability.'] }),
  expandSeed({ id: 'next-forms-validation', title: 'Forms and Server Validation', moduleId: 'next-mutations', description: 'A form can provide immediate client hints, but the server remains the authority for validation. Return field level feedback in a shape the UI can render. This email model uses a limited lesson rule: one @, no whitespace, a dotted domain, and at most 254 characters; it is not a full email standards parser.', code: 'type Signup = { email: string };\n\nfunction validate(input: Signup) {\n  return input.email.length <= 254 && /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(input.email) ? null : "Enter a valid email";\n}\n\nconst error = validate({ email: "hello" });', symbols: ['Signup', 'validate', 'error'], topic: 'Next.js mutations', question: 'Where must form data be validated?', answer: 'On the server', recap: ['Treat every request as untrusted.', 'Return useful field feedback.', 'Keep success and pending states visible.'] }),
  expandSeed({ id: 'next-optimistic-ui', title: 'Optimistic UI', moduleId: 'next-mutations', description: 'Optimistic UI shows the expected result before the server confirms it. Use it for actions that feel safe, then reconcile or recover when the request fails.', code: 'type Todo = { title: string; pending: boolean };\n\nfunction optimistic(title: string): Todo {\n  return { title, pending: true };\n}\n\nconst todo = optimistic("Ship lesson");', symbols: ['Todo', 'optimistic', 'todo'], topic: 'Next.js mutations', question: 'What must optimistic UI plan for?', answer: 'A failed server request', recap: ['Show the expected state quickly.', 'Mark pending work clearly.', 'Recover when the server disagrees.'] }),
  expandSeed({ id: 'next-revalidate-path', title: 'Refreshing Changed Data', moduleId: 'next-mutations', description: 'After a successful mutation, revalidate the route or tag that depends on the changed data. This keeps cached views aligned with the source of truth.', code: 'type Change = { path: string };\n\nfunction refreshTarget(change: Change) {\n  return `refresh:${change.path}`;\n}\n\nconst target = refreshTarget({ path: "/learn" });', symbols: ['Change', 'refreshTarget', 'target'], topic: 'Next.js mutations', question: 'When should a cached route be revalidated?', answer: 'After data it depends on changes', recap: ['Mutations affect cached views.', 'Refresh the smallest relevant area.', 'Keep invalidation near the write.'] }),
  expandSeed({ id: 'next-auth-boundaries', title: 'Authorization Boundaries', moduleId: 'next-mutations', description: 'Authentication identifies a person; authorization decides whether that person may perform this action. Enforce both rules on the server for every sensitive mutation.', code: 'type Actor = { role: "reader" | "editor" };\n\nfunction canPublish(actor: Actor) {\n  return actor.role === "editor";\n}\n\nconst allowed = canPublish({ role: "editor" });', symbols: ['Actor', 'canPublish', 'allowed'], topic: 'Next.js mutations', question: 'Where must authorization be enforced?', answer: 'On the server', recap: ['Authentication and authorization differ.', 'Check permission per action.', 'Never trust a browser-only check.'] }),
  expandSeed({ id: 'next-route-handlers', title: 'Designing Route Handlers', moduleId: 'next-mutations', description: 'A Route Handler is an HTTP boundary. Parse input, validate it, authorize the caller, do one focused job, and return an explicit response.', code: 'type RequestBody = { title?: string };\n\nfunction hasTitle(body: RequestBody) {\n  return typeof body.title === "string" && body.title.length > 0;\n}\n\nconst valid = hasTitle({ title: "New route" });', symbols: ['RequestBody', 'hasTitle', 'valid'], topic: 'Next.js mutations', question: 'What should a Route Handler do before business work?', answer: 'Validate input and authorize the caller', recap: ['HTTP boundaries need validation.', 'Return clear status and data.', 'Keep each handler focused.'] }),
  expandSeed({ id: 'next-code-splitting', title: 'Code Splitting by Route', moduleId: 'next-optimization', description: 'Routes naturally split application code, and dynamic imports can defer an optional heavy feature. Load more JavaScript only when the experience needs it.', code: 'type Feature = { requested: boolean };\n\nfunction shouldLoad(feature: Feature) {\n  return feature.requested;\n}\n\nconst loadEditor = shouldLoad({ requested: true });', symbols: ['Feature', 'shouldLoad', 'loadEditor'], topic: 'Next.js optimization', question: 'When is a dynamic import useful?', answer: 'When a feature is optional or costly to load up front', recap: ['Routes split code naturally.', 'Defer optional heavy features.', 'Optimize based on evidence.'] }),
  expandSeed({ id: 'next-client-boundaries', title: 'Keeping Client Boundaries Small', moduleId: 'next-optimization', description: 'Move interactivity into a focused Client Component and keep surrounding layout and data work on the server. This reduces browser JavaScript without losing usability.', code: 'type Boundary = { interactive: boolean; size: "small" | "large" };\n\nconst boundary: Boundary = { interactive: true, size: "small" };\nconsole.log(boundary);', symbols: ['Boundary', 'boundary'], topic: 'Next.js optimization', question: 'Where should a client boundary usually sit?', answer: 'Around the smallest interactive part', recap: ['Server is the default.', 'Isolate browser-only behavior.', 'Keep data and layout outside when possible.'] }),
  expandSeed({ id: 'next-seo-metadata', title: 'Route Metadata and Sharing', moduleId: 'next-optimization', description: 'Write page titles and descriptions for the route’s actual content. Metadata should help search and sharing previews set accurate expectations before a visit.', code: 'type Metadata = { title: string; description: string };\n\nconst metadata: Metadata = { title: "React lessons", description: "Learn React one idea at a time." };\nconsole.log(metadata.title);', symbols: ['Metadata', 'metadata'], topic: 'Next.js optimization', question: 'What should route metadata describe?', answer: 'The specific content of that route', recap: ['Metadata belongs with its route.', 'Write accurate titles and descriptions.', 'Keep sharing previews intentional.'] }),
  expandSeed({ id: 'next-web-vitals', title: 'Reading Web Vitals', moduleId: 'next-optimization', description: 'Web Vitals describe loading, visual stability, and interaction responsiveness. Use measurements to locate a bottleneck before changing route architecture.', code: 'type Metric = { name: string; value: number };\n\nfunction report(metric: Metric) {\n  return `${metric.name}: ${metric.value}`;\n}\n\nconst line = report({ name: "LCP", value: 1800 });', symbols: ['Metric', 'report', 'line'], topic: 'Next.js optimization', question: 'What should guide a performance change?', answer: 'Measured user-facing behavior', recap: ['Measure real experience.', 'Find the limiting route or asset.', 'Verify improvements after a change.'] }),
  expandSeed({ id: 'next-environment-variables', title: 'Environment Variables', moduleId: 'next-production', description: 'Environment variables separate deployment configuration from source code. Only explicitly public values belong in browser code; secrets must remain server-only.', code: 'type Config = { apiUrl: string };\n\nconst config: Config = { apiUrl: "https://api.example.com" };\nconsole.log(config.apiUrl);', symbols: ['Config', 'config'], topic: 'Next.js production', question: 'Where should a secret environment variable be used?', answer: 'Only on the server', recap: ['Keep secrets out of browser bundles.', 'Document required configuration.', 'Use separate values per environment.'] }),
  expandSeed({ id: 'next-deployment-checklist', title: 'Preparing a Production Build', moduleId: 'next-production', description: 'A production release needs a clean build, expected environment values, route checks, and error visibility. Treat deployment as a repeatable product workflow.', code: 'type Release = { built: boolean; configured: boolean };\n\nfunction ready(release: Release) {\n  return release.built && release.configured;\n}\n\nconst ship = ready({ built: true, configured: true });', symbols: ['Release', 'ready', 'ship'], topic: 'Next.js production', question: 'What should happen before deployment?', answer: 'Build and verify the application in its target configuration', recap: ['Build before release.', 'Check critical routes.', 'Verify runtime configuration.'] }),
  expandSeed({ id: 'next-observability', title: 'Observing Route Failures', moduleId: 'next-production', description: 'Production logs and error reports should answer what failed, where it happened, and how often. Capture context safely without putting private user data into logs.', code: 'type Event = { route: string; outcome: "success" | "error" };\n\nconst event: Event = { route: "/learn/react", outcome: "success" };\nconsole.log(event);', symbols: ['Event', 'event'], topic: 'Next.js production', question: 'What should an error report include?', answer: 'Useful route and failure context without private data', recap: ['Observe important failures.', 'Protect user data in logs.', 'Use evidence to prioritize fixes.'] }),
  expandSeed({ id: 'next-security-headers', title: 'Protecting the Request Boundary', moduleId: 'next-production', description: 'Security belongs at every request boundary: validate input, use secure cookies, set suitable headers, and avoid exposing server internals in errors.', code: 'type Request = { origin: string };\n\nfunction trusted(request: Request) {\n  return request.origin === "https://rancode-lab.example";\n}\n\nconst accepted = trusted({ origin: "https://rancode-lab.example" });', symbols: ['Request', 'trusted', 'accepted'], topic: 'Next.js production', question: 'What should happen to untrusted request input?', answer: 'Validate it before using it', recap: ['Every request is untrusted input.', 'Keep sensitive work server-side.', 'Return safe error messages.'] }),
  expandSeed({ id: 'next-full-route-review', title: 'Reviewing a Complete Route', moduleId: 'next-production', description: 'A complete route connects navigation, data, loading, empty, error, success, metadata, and accessibility. Review the whole journey before calling it done.', code: 'type RouteReview = { loading: boolean; empty: boolean; error: boolean; success: boolean };\n\nconst review: RouteReview = { loading: true, empty: true, error: true, success: true };\nconsole.log(review);', symbols: ['RouteReview', 'review'], topic: 'Next.js production', question: 'Which route state is easy to forget but important to design?', answer: 'Empty and error states', recap: ['Review the entire route lifecycle.', 'Check loading, empty, error, and success.', 'Verify keyboard and sharing behavior too.'] }),
  expandSeed({ id: 'next-bundle-analysis', title: 'Reviewing What Reaches the Browser', moduleId: 'next-optimization', description: 'A bundle review shows which client dependencies reach a route. Use it to remove unused work and move server-safe logic out of browser boundaries.', code: 'type Bundle = { route: string; kilobytes: number };\n\nfunction isLarge(bundle: Bundle) {\n  return bundle.kilobytes > 200;\n}\n\nconst review = isLarge({ route: "/learn", kilobytes: 180 });', symbols: ['Bundle', 'isLarge', 'review'], topic: 'Next.js optimization', question: 'What does bundle analysis help you find?', answer: 'Client code that is unnecessarily large or unused', recap: ['Inspect what each route sends.', 'Move eligible logic to the server.', 'Remove dependencies with no user benefit.'] }),
]

export const frameworkModules: CourseModule[] = [
  { id: 'react-foundations', courseId: 'react', number: '01', title: 'React Foundations', description: 'Build a clear model of components, JSX, and props.' },
  { id: 'react-state', courseId: 'react', number: '02', title: 'State & Interaction', description: 'Model changing UI, events, and lists.' },
  { id: 'react-effects', courseId: 'react', number: '03', title: 'Thinking Beyond Render', description: 'Connect external systems, reusable logic, and composition.' },
  { id: 'react-composition', courseId: 'react', number: '04', title: 'Sharing & Structuring State', description: 'Coordinate related components, shared values, and complex transitions.' },
  { id: 'react-performance', courseId: 'react', number: '05', title: 'Responsive, Accessible UI', description: 'Keep interactions fast, focused, and usable for everyone.' },
  { id: 'react-practice', courseId: 'react', number: '06', title: 'Reliable React Features', description: 'Handle forms, requests, recovery, testing, and feature boundaries.' },
  { id: 'next-routing', courseId: 'nextjs', number: '01', title: 'Routes & Layouts', description: 'Use the App Router to shape navigation and nested UI.' },
  { id: 'next-rendering', courseId: 'nextjs', number: '02', title: 'Rendering & Data', description: 'Choose server and client boundaries, then fetch data deliberately.' },
  { id: 'next-experience', courseId: 'nextjs', number: '03', title: 'Reliable Route Experiences', description: 'Design loading, error, metadata, and HTTP route behavior.' },
  { id: 'next-mutations', courseId: 'nextjs', number: '04', title: 'Forms & Server Mutations', description: 'Validate writes, refresh changed data, and enforce server boundaries.' },
  { id: 'next-optimization', courseId: 'nextjs', number: '05', title: 'Fast, Discoverable Routes', description: 'Shape bundle size, client boundaries, metadata, and user-facing performance.' },
  { id: 'next-production', courseId: 'nextjs', number: '06', title: 'Production-Ready Applications', description: 'Configure, observe, protect, and review complete route experiences.' },
]
export const frameworkLessons = [...makeLessons('react', [...reactSeeds, ...reactExpansionSeeds]), ...makeLessons('nextjs', [...nextSeeds, ...nextExpansionSeeds])]
export const frameworkConcepts: Concept[] = frameworkLessons.map((lesson) => ({ id: `${lesson.courseId}-${lesson.id}`, courseId: lesson.courseId, title: lesson.title, category: lesson.challenge.topic, description: lesson.description, code: lesson.code, lessonId: lesson.id, visual: lesson.visual, language: lesson.language }))
