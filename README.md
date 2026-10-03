# UnderCode

UnderCode guides learners from their first programming idea to a complete frontend application. It pairs explanations and visual concept maps with practice, readiness checkpoints, and a project at every stage.

## Learning journey

The recommended path contains **272 lessons, 9 checkpoints, and 9 stage projects**:

| Stage | Lessons | Project |
| --- | ---: | --- |
| Logic & Problem Solving | 12 | Basket calculator |
| Web & Developer Tools | 12 | First web workspace |
| HTML | 32 | Semantic personal profile |
| CSS | 36 | Responsive project gallery |
| JavaScript | 40 | Study-task data model |
| JavaScript in the Browser | 32 | Interactive study list |
| React | 36 | Study list with components and state |
| TypeScript | 36 | Typed study model and data states |
| Next.js | 36 | Learning dashboard capstone |

Introductory modules lead into themed depth modules. The shorter logic and developer-tool stages stay focused instead of being padded to match the larger language courses. Each added lesson includes an explanation, an example, a practice prompt, a concept flow, and a knowledge check. Existing lesson ids remain stable so saved progress and links continue to work.

React, TypeScript, and Next.js depth modules come before their final application/review modules. Existing completed lessons stay completed; new lessons appear as additional available material.

Curriculum references include the [MDN curriculum](https://developer.mozilla.org/en-US/curriculum/), [React learning guide](https://react.dev/learn), [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/), and [Next.js App Router documentation](https://nextjs.org/docs/app). Framework reading examples are intended for current local projects and identify their required files or runtime.

`/start` offers a beginner entry and short readiness checks for learners with experience. Choosing a later starting point does not mark earlier material complete. `/learn` recommends a next lesson, checkpoint, or project. Lessons follow the module order consistently in the syllabus and pagination.

Checkpoints require all three answers to be correct and provide explanations and links for review. They are small readiness samples, not certifications. Passing a checkpoint allows an experienced learner to go straight to that stage's project. A stage is complete when its checkpoint passes and its project review is complete. Project criteria are **self-assessed**, not an automated code grade.

Every stage stays open. Lesson progress, checkpoint results, starting point, project drafts, and review notes stay in this browser using local storage. Existing v1 lesson progress is retained through additive schema defaults. There is no account or cloud sync. Projects offer a text download; editing project code clears its review checklist so it can be checked again. If browser storage is unavailable, work lasts only for the session and can still be downloaded.

Interface controls support English and Indonesian. Full lesson, checkpoint, and project prose localization is intentionally deferred until the curriculum is stable. Brands and code remain unchanged.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` to type-check and create a production build, `npm run lint` for static lint checks, and `npm test` for focused runtime and learning-journey checks.

## Architecture notes

- Course data lives in `src/content/`. `index.ts` is the public catalog and owns course-aware lookup helpers.
- `src/content/foundations/` owns introductory lessons. `src/content/journey.ts` defines stage outcomes, project briefs, and checkpoint questions. `src/features/journey/` owns onboarding, recommendations, and milestone UI.
- `src/content/expansion/` owns the additional themed modules, with separate course files and a shared data adapter. The public catalog numbers modules within each course and includes expanded material in lessons, challenges, reference, and search.
- Each lesson follows Explain → Visualize → Play → Challenge → Recap.
- JavaScript console practice uses the existing isolated runner. HTML/CSS/DOM lessons use an opaque-origin sandboxed preview with network, external resources, and form submissions blocked. Preview updates are explicit and support narrow and wide frames.
- TypeScript lessons retain the real type inspector. React lessons use plain JavaScript models and separate JSX reading examples; TypeScript is not a React prerequisite. Framework projects are drafted here and run in the learner's own local React or Next.js workspace. The browser runner does not install packages or run framework imports.
- Examples requiring network requests, persistent same-origin storage, external media, or Next.js server APIs use reading mode with local practice instructions. They do not claim to execute those capabilities inside the isolated preview.
- `/projects` lists saved work. `/projects/:courseId` provides a brief, workspace, notes, downloadable artifact, and self-review criteria. The Next.js project is the capstone.
- Static hosts need an SPA history fallback for direct lesson URLs such as `/learn/react/react-state-events`.
