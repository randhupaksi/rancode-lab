# Development, performance, and delivery

## Commands

```sh
npm ci
npm run content:generate
npm run lint
npm run format:check
npm test
npm run build
npm run perf:check
npm run check
```

Development, build, and tests generate runtime data first. `npm run check` runs lint, formatting, and the production build; `perf:check` measures the home route static JavaScript graph, worker size, and emitted fonts against enforced budgets.

## Change-based verification

| Change                        | Minimum evidence                                                                      |
| ----------------------------- | ------------------------------------------------------------------------------------- |
| Curriculum or localization    | Generate data, review generated diff, run relevant tests, inspect both locales        |
| ID or recommendation behavior | Deep-link, saved-progress compatibility, focused tests                                |
| Preview/compiler/lab          | Error/reset behavior, boundary accuracy, focused tests and build                      |
| Home/catalog loading          | Build and performance budget check                                                    |
| Layout/interaction            | Browser check at desktop/narrow widths with keyboard and reduced-motion consideration |

## CI and hosting

CI runs the repository quality workflow; keep it aligned with package scripts and performance budget expectations. The app is a client-side SPA, so static hosts require history fallback for direct links such as `/learn/react/react-state-events`. Vercel configuration provides that SPA fallback.

`dist/`, dependencies, generated runtime output, and local browser data are separate concerns. Do not change deployment, package policy, performance budgets, or storage behavior as incidental cleanup. When any of those contracts change intentionally, update this document, the README, and relevant runtime docs together.
