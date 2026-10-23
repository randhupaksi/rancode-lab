# Curriculum and learner state

The main frontend journey contains nine stages, 272 lessons, nine checkpoints, and nine self-assessed stage projects. Optional Tailwind CSS and Vibe Coding companion paths extend the catalog without adding mandatory stages. Course material progresses from concepts to visible practice, challenges, and recap.

## Source and generation

Author curriculum in `src/content/`. `npm run content:generate` validates content and produces committed reproducible data in `src/generated/`.

Never edit `src/generated/` manually. Change the authored material or generator, run generation, and inspect the generated diff. Generation checks translation coverage, empty copy, challenge option alignment, and preservation of code/identifier/graph/scoring contracts.

## Stable learning contracts

Lesson, course, concept, challenge, checkpoint, and project IDs are used by direct URLs, recommendations, saved completion, drafts, references, and search. Add a new ID instead of renaming an established one whenever possible. A migration needs an explicit compatibility plan and focused tests.

Each lesson follows **Explain → Visualize → Play → Challenge → Recap**. Preserve this flow when expanding material. Checkpoints are readiness samples: every answer must be correct, and passing allows an experienced learner to proceed to that stage project. Projects are self-reviewed, not automatically graded.

## Localization

English source content has matching Indonesian display copy in `src/content/locales/id/<course>.json`; shared copy is in `common.json`. Exact English text is the translation key. Keep authored logic-lesson overrides and shared reference copy synchronized.

`localize.ts` translates display fields only. Canonical options, answers, accepted answers, identifiers, executable examples, and validation logic remain unchanged. Use `Challenge.optionLabels` for translated option labels. Brand names and compiler diagnostics preserve their original spelling.

## Browser-only learner state

Progress, checkpoint results, onboarding starting point, project drafts, project reviews, locale, and challenge state stay in the current browser. There is no account or cloud sync. Existing v1 progress is retained through additive schema defaults.

Storage may fail. In that case, the learner can continue for the current session and download project work, but it will not survive reload. New persistence must preserve this failure path and avoid silently changing what the product stores.
