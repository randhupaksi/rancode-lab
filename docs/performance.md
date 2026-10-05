# Performance changes

Measured with the same local production build and dependency installation on 2026-10-03. Decimal kB/MB are used below. These are artifact sizes, not measured browser latency or Core Web Vitals.

| Metric | Before | After | Change |
| --- | ---: | ---: | ---: |
| Home JavaScript, complete static graph, gzip | 254.7 kB | 132.7 kB | −47.9% |
| Home JavaScript, uncompressed | 802.4 kB | 435.4 kB | −45.7% |
| TypeScript worker, uncompressed | 7.29 MB | 6.31 MB | −13.4% |
| Emitted font assets | 146.9 kB / 11 files | 52.5 kB / 2 files | −64.2% |
| Initially rendered reference examples | 281 | 24 | −91.5% |

Font totals describe emitted assets; the browser previously selected subsets using Unicode ranges, so the reduction is not equivalent to every visitor's font transfer savings. Reference counts describe bounded rendering, not a measured frame-time improvement.

## What changed

1. **Navigation data boundary.** Build-time generation extracts only IDs, course membership, titles, and translated titles for the home page and recommendation engine. It evaluates the canonical curriculum, so there is no manually maintained second catalog. Development edits trigger regeneration, and build/test hooks regenerate before use.
2. **Compiler libraries.** Instead of importing every `lib.*.d.ts`, generation follows official triple-slash library references from ES2022 and DOM. The compiler stays deferred until analysis is requested. Existing compiler checks use the same library resolver.
3. **Catalog and search work.** Course, module, and challenge lookups use indexes built once. Returned lesson/module lists are readonly. Translated lesson objects are cached by source identity; search indexes are retained separately for the two locales and reused on reopening the dialog. Syntax highlighting skips unchanged code.
4. **Bounded reference rendering.** Search still matches all examples, including code. Pagination limits mounted examples to 24, preserves category ordering, opens the correct page for a hash link, and moves keyboard focus to the results when paging.
5. **Font delivery.** English/Indonesian use the self-hosted Latin variable fonts with `font-display: swap`. Other glyphs use the existing system fallback.
6. **Build guardrails.** The Vite manifest supports reproducible dependency-graph reporting. CI checks home JavaScript at 175 kB gzip, the compiler worker at 6.5 MB raw, and emitted fonts at 60 kB. Optional search, editor, and compiler chunks must stay out of the home graph. Budget changes should include a reviewed explanation.

During integration, the missing challenge difficulty translation key was corrected, invalid translated topic selections fall back to all topics, and the Next.js translated project checklist was aligned with all six persisted source criteria. Generation rejects a mismatched checklist length.

## Reproduce

```sh
npm run check
npm test
npm run perf:check
```

`perf:check` requires a successful current build. Gzip sums each JavaScript asset once through the home route's static import graph; it excludes CSS, fonts, and dynamically imported tools. It does not simulate HTTP caching or server compression settings.

## Remaining boundaries

- CodeMirror remains about 501 kB raw, loaded only with editing features; Vite still reports its large-chunk warning. The full TypeScript compiler is also deliberately retained for genuine type analysis.
- The full curriculum still loads together on learning/reference routes. This pass removes it from the home path; it does not introduce per-course asynchronous data contracts.
- No browser timing, mobile-device profiling, or visual pagination audit was performed for this optimization pass. Build size reductions must not be described as measured LCP/INP gains.
- No claim is made that total build time improved: generation adds a small preprocessing step and local build timings vary.

## Major loading optimization — 2026-10-05

The previous remaining full-curriculum boundary has now been replaced for browser consumers. Authoring files remain the source of truth; predev/prebuild generate versioned JSON assets for each course and language.

### Evidence

Measured from production artifacts and the full manifest dependency graph. KB below means 1,000 bytes; these are payload sizes, not browser timing measurements.

| Loading cost | Before this pass | After this pass |
| --- | ---: | ---: |
| Home static JavaScript, gzip | 140,143 bytes | 121,138 bytes |
| Home static JavaScript, raw | 451,942 bytes | 384,260 bytes |
| Home initial CSS, gzip | approximately 16.4 KB | 6,964 bytes |
| Home initial CSS, raw | approximately 81.1 KB | 28,747 bytes |
| Home static JavaScript files | 8 | 4 |
| Curriculum data needed for roadmap/course overview, gzip | shared 386.9 KB curriculum/localization bundle | 36.7 KB EN / 52.5 KB ID metadata |
| Curriculum data needed for TypeScript reading, gzip | shared 386.9 KB curriculum/localization bundle | 74.4 KB EN / 91.1 KB ID metadata + selected course |

Curriculum rows compare data requirements, excluding the common UI, optional editors, and compiler. The old journey-localization chunk is also excluded from the baseline, so this is a conservative comparison of the heavy curriculum boundary. Gzip measurements are computed locally; the deployment may negotiate Brotli instead.

### Changes

- Home renders from the initial module graph, removing the extra asynchronous home-page hop.
- Progress validation uses Zod Mini with the same stored schema, bounds, and additive defaults.
- Learning CSS loads with content routes. Shared home demo toolbar rules stay in the home shell. Tailwind scanning excludes curriculum examples and generated data; sandboxed examples compile their own styles.
- Metadata and requested section data load concurrently. A reading route downloads one course in the selected language. Cached routes can render synchronously without a forced data Suspense cycle.
- Explore and code references share a concepts-only payload; challenges load their grading payload; the default playground loads starter examples. An explicit playground example additionally loads its course.
- Search loads its own localized search entries and retains one index per language, without downloading lesson bodies.
- Pointer intent (120 ms) and keyboard focus warm route modules and learning/project content. Speculative data loads are skipped for Save-Data and reported 2G connections; full reference catalogs are never fetched merely on hover.
- Offscreen lesson labs and challenges mount within 400 px of the viewport. Once mounted they remain mounted, preserving edits. Choice/fill challenges do not download CodeMirror just to display their controls.
- Recent successful compiler analyses are cached with a 12-entry limit. The worker reuses its previous program and official library source files; input debounce remains in place after the initial analysis.
- The main font is preloaded. Hashed assets receive explicit immutable caching in Vercel; HTML keeps the platform's normal policy.
- CI budgets now cover initial CSS and all 32 curriculum assets as well as the home JS graph, compiler, and fonts. Optional content/editor/search payloads are prohibited in the home graph.

### Compatibility and tradeoffs

Course/module ordering, lesson IDs, challenge answers and validation code remain authored values. Existing content validation checks 341 lessons, 350 concepts, and 11,981 translated fields during generation. Project review criteria keep their English canonical keys while displayed criteria follow the selected language, preserving existing saved reviews.

The browser runtime distinguishes lesson summaries from complete lessons. Reading/editor consumers use getFullLesson; an unprepared body produces a recoverable load error instead of an empty lesson. The original content/localize modules remain available to build-time validation and curriculum tooling.

There are more generated deployment assets and duplicated prelocalized/reference data across them. This trades total deployment storage for substantially smaller per-route downloads. These generated files are ignored by Git and recreated by npm run dev/build. Curriculum edits in development trigger a full page refresh after regeneration to avoid stale in-memory snapshots; temporary unsaved playground edits can therefore reset during authoring.

The TypeScript worker still contains the full browser compiler and official DOM libraries (about 6.31 MB raw), and CodeMirror remains about 501 KB raw. Both are optional and load on demand. Their sizes were not reduced by removing learning functionality.

### Validation and limits

npm run check passed (lint, content validation, TypeScript, production build). npm run perf:check and git diff --check passed. No unit-test suite or visual/browser session was run for this pass. Actual cold-load timing, LCP/INP, scroll behavior, and mobile/keyboard flows still need measurement in a running browser before claiming a latency percentage or complete visual equivalence. Vercel cache headers have been configured locally, not checked on a deployed response.

Implementation references: [Vite lazy loading and asset imports](https://vite.dev/guide/features.html), [Zod Mini](https://zod.dev/packages/mini), [Vercel cache headers](https://vercel.com/docs/caching/cache-control-headers).
