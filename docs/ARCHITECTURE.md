# Architecture

Rancode Lab is a Vite React SPA. It serves static curriculum data, persists learner state only in the browser, and lazy-loads the heavier learning tools.

```text
LocaleProvider + ProgressProvider
  React Router + SiteLayout
    home/recommendation metadata
    lazy learning routes
      curriculum source/generated runtime data
      interactive lab, simulator, or reading-mode guidance
```

## Routes

| Route                                 | Purpose                                               |
| ------------------------------------- | ----------------------------------------------------- |
| `/`                                   | Learning-path overview and entry points               |
| `/start`                              | Beginner entry and optional readiness checks          |
| `/learn`                              | Learning hub and next recommendation                  |
| `/learn/:courseId`                    | Course syllabus                                       |
| `/learn/:courseId/:lessonId`          | Individual lesson                                     |
| `/learn/:courseId/checkpoint`         | Stage checkpoint                                      |
| `/projects` and `/projects/:courseId` | Saved project work, project lab, artifact, and review |
| `/explore/:conceptId?`                | Concept exploration                                   |
| `/playground`                         | Practice workspace                                    |
| `/challenges/:challengeId?`           | Challenge workspace                                   |
| `/cheat-sheet`                        | Searchable code reference                             |

## Boundaries

| Area                                                   | Responsibility                                                        |
| ------------------------------------------------------ | --------------------------------------------------------------------- |
| `src/content/`                                         | Source curriculum and catalog-aware lookup helpers                    |
| `src/content/foundations/`, `framework/`, `expansion/` | Course-specific authored material                                     |
| `src/content/journey.ts`                               | Stage outcomes, checkpoints, and project briefs                       |
| `src/content/locales/`                                 | Learner-facing display translations                                   |
| `src/generated/`                                       | Reproducible committed runtime output                                 |
| `src/features/journey/`                                | Onboarding, milestone, and recommendation UI                          |
| locale/progress features                               | Bilingual presentation and validated browser persistence              |
| `src/pages/` and `src/components/`                     | Route composition and shared interface/layout                         |
| `scripts/`                                             | Runtime-data generation, compiler library graph, and bundle reporting |

The public catalog and light navigation metadata let the home/recommendation experience stay small. Full explanations, examples, challenges, and project briefs load only for learning routes. Keep that split when adding content or imports.

## State flow

Route and content IDs select curriculum data. Providers render it in the chosen locale and record progress, challenge/checkpoint results, onboarding choice, drafts, and self-review locally. Browser-storage failure must keep a session-only experience that still allows project download.

```text
stable URL/content ID → authored curriculum → generated runtime data → route UI
                                     ↑                         ↓
                         localized display copy       local browser progress/draft
```

Do not put direct localStorage reads across pages; use the existing progress/locale boundary so failure and compatibility behavior remain consistent.
