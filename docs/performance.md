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
