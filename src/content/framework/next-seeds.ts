import type { Seed } from './seed'

export const nextSeeds: Seed[] = [
  {
    id: 'next-file-routing',
    title: 'File-based Routing',
    moduleId: 'next-routing',
    minutes: 7,
    description:
      'In the App Router, folders and special files describe routes. A page file is the UI entry point for one URL segment.',
    code: 'const segments = ["learn", "react"];\nconst path = `/${segments.join("/")}`;\nconsole.log(path);',
    symbols: ['segments', 'path'],
    topic: 'Next.js routing',
    question: 'Which file defines UI for a route in the App Router?',
    answer: 'page.tsx',
    recap: [
      'Folders describe URL segments.',
      'page.tsx renders a route.',
      'Keep route UI close to its route.',
    ],
  },
  {
    id: 'next-layouts-dynamic',
    title: 'Layouts and Dynamic Segments',
    moduleId: 'next-routing',
    minutes: 8,
    description:
      'Layouts provide shared structure for related routes. A bracketed folder captures a URL value so a route can find the resource it needs.',
    code: 'type Params = { slug: string };\nfunction lessonPath({ slug }: Params) { return `/learn/${slug}`; }\nconst url = lessonPath({ slug: "react-state" });',
    symbols: ['Params', 'lessonPath', 'url'],
    topic: 'Next.js routing',
    question: 'What does [slug] represent in a route folder?',
    answer: 'A value captured from the URL',
    recap: [
      'Layouts wrap related child routes.',
      'Dynamic segments capture URL values.',
      'Validate missing or invalid data.',
    ],
  },
  {
    id: 'next-server-components',
    title: 'Server Components',
    moduleId: 'next-rendering',
    minutes: 8,
    description:
      'Server Components render on the server by default. They can fetch data close to the component without shipping their implementation to the browser.',
    code: 'type Lesson = { title: string };\nasync function getLesson(): Promise<Lesson> { return { title: "Server Components" }; }\nconst lesson = await getLesson();\nconsole.log(lesson.title);',
    symbols: ['Lesson', 'getLesson', 'lesson'],
    topic: 'Next.js rendering',
    question: 'Where do Server Components render by default?',
    answer: 'On the server',
    recap: [
      'App Router components are server components by default.',
      'They can await data directly.',
      'Their code is not automatically sent to the browser.',
    ],
  },
  {
    id: 'next-client-components',
    title: 'Client Components',
    moduleId: 'next-rendering',
    minutes: 8,
    description:
      'Use "use client" at the boundary that needs browser state, effects, or event handlers. Keep that boundary small so the browser receives only what it needs.',
    code: 'type Menu = { open: boolean };\nfunction toggleMenu(menu: Menu): Menu { return { open: !menu.open }; }\nconst nextMenu = toggleMenu({ open: false });\nconsole.log(nextMenu.open);',
    symbols: ['Menu', 'toggleMenu', 'nextMenu'],
    topic: 'Next.js rendering',
    question: 'When is "use client" needed?',
    answer: 'When a component needs browser interactivity',
    recap: [
      'Client Components enable browser APIs and state.',
      'The directive creates a client boundary.',
      'Keep client boundaries narrow.',
    ],
  },
  {
    id: 'next-data-fetching',
    title: 'Data Fetching and States',
    moduleId: 'next-experience',
    minutes: 8,
    description:
      'Fetch data where it is needed, then deliberately design loading, success, empty, and error states. Request data has a lifecycle, not only a final value.',
    code: 'type Result = { title: string };\nasync function fetchLesson(): Promise<Result> { return { title: "Data Fetching" }; }\nconst result = await fetchLesson();\nconsole.log(result.title);',
    symbols: ['Result', 'fetchLesson', 'result'],
    topic: 'Next.js experience',
    question: 'What should a data-driven route plan for?',
    answer: 'Loading, success, empty, and error states',
    recap: [
      'Fetch data close to its consumer.',
      'Plan for each request state.',
      'Keep data shape explicit.',
    ],
  },
  {
    id: 'next-metadata-route-handlers',
    title: 'Metadata and Route Handlers',
    moduleId: 'next-experience',
    minutes: 8,
    description:
      'Metadata describes a route for people and browsers. Route Handlers create server endpoints that should validate input and return clear responses.',
    code: 'type Input = { name: string };\ntype Output = { greeting: string };\nfunction greet(input: Input): Output { return { greeting: `Hello, ${input.name}` }; }\nconsole.log(greet({ name: "Mira" }).greeting);',
    symbols: ['Input', 'Output', 'greet'],
    topic: 'Next.js experience',
    question: 'Where should sensitive Route Handler work run?',
    answer: 'On the server',
    recap: [
      'Metadata belongs with the route it describes.',
      'Route Handlers create HTTP endpoints.',
      'Validate data at the server boundary.',
    ],
  },
]
