# Rancode Lab contributor guide

Rancode Lab is a bilingual, browser-only learning path for frontend development. It combines structured curriculum, interactive practice, checkpoints, projects, and safe local previews. Read [docs/INDEX.md](docs/INDEX.md) with this guide before changing learning content or a lab.

## Commands

Use npm and the committed lockfile.

```sh
npm ci
npm run content:generate
npm run lint
npm run format:check
npm test
npm run build
npm run perf:check
```

`content:generate` runs before development, tests, and builds. Do not bypass it. `npm run format` writes formatting changes and should be intentional.

## Non-negotiable contracts

- Curriculum source lives in `src/content/`; `src/generated/` is reproducible committed output. Edit source or generator scripts, never generated files by hand.
- Lesson, concept, checkpoint, project, and course IDs are public contracts for routes and saved browser state. Preserve existing IDs or design/test a deliberate migration.
- Indonesian and English learner-facing content must stay aligned. Keep executable code, canonical answers, accepted answers, identifiers, graph structure, and scoring contracts unchanged by translation.
- Learner progress, project drafts, reviews, locale, and starting point stay in local browser storage. There is no account or cloud sync; storage failure must retain the session-only fallback.
- A sandboxed preview, a simulator, and reading-mode instructions are different capabilities. Do not claim an external request, Next.js server API, package install, or persistent same-origin storage runs inside a lab when it does not.
- Keep user code inside the existing preview/worker boundaries. Do not add network, external resource, or outbound-form access incidentally.

## Architecture boundaries

- `src/content/` owns course data and public catalog lookup; `src/content/journey.ts` defines stages, projects, and checkpoints.
- `src/content/framework/`, `foundations/`, and `expansion/` own course-specific source. `src/content/locales/` owns display translations.
- `src/features/journey/` owns onboarding, recommendation, and milestone interface; locale/progress providers own browser state.
- `src/pages/` composes routes; `src/components/` contains shared interface/layout; `src/generated/` is runtime data output.
- Heavy learning routes are lazy loaded. The home/recommendation boundary uses light navigation metadata instead of importing every full lesson.

## Before finishing

1. Regenerate content after source or translation changes and review generated diff.
2. Check the affected deep link, next-step recommendation, and saved-progress compatibility.
3. Verify both locales and correct presentation of a preview, simulator, or reading-mode exercise.
4. Run focused tests plus the relevant static/build/performance check for code or catalog changes.
5. Update docs if the curriculum structure, generator, browser storage, preview boundary, route, or performance budget changes.

Do not alter hosting, dependencies, Git history, remote state, or privacy behavior without explicit instruction.
