# UnderCode

UnderCode is a static-first learning space for understanding how modern frontend code fits together. It pairs concise explanations with visual concept maps, editable TypeScript examples, and small challenges.

## Learning paths

- **TypeScript** — 30 lessons spanning type foundations, functions, structures, advanced types, generics, and real-world application models.
- **React** — 30 lessons across components, state, effects, composition, accessibility, performance, forms, requests, and testing.
- **Next.js** — 30 lessons across the App Router, server and client boundaries, data states, mutations, caching, route optimization, and production readiness.

Every path is open: learners can move through lessons in any order. Progress stays in the current browser using local storage; UnderCode does not require an account or send learner data to a server.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` to type-check and create a production build.

## Architecture notes

- Course data lives in `src/content/`. `index.ts` is the public catalog and owns course-aware lookup helpers.
- Each lesson follows Explain → Visualize → Play → Challenge → Recap.
- The editor uses a browser TypeScript worker for type feedback. The interactive runner is sandboxed, has no network access, and supports standalone snippets only. Framework imports are intentionally not executable in the runner; lessons use focused, runnable TypeScript models and explain where they connect to React or Next.js.
- Static hosts need an SPA history fallback for direct lesson URLs such as `/learn/react/react-state-events`.
