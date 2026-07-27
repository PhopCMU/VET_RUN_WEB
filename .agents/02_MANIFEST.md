# Knowledge Base Manifest

| Module | Load when | Source of truth |
|---|---|---|
| `01_PROJECT_FACTS.md` | Stack, commands, repo identity | `package.json`, configs |
| `architecture/overview.md` | Component flow, routing, folder ownership | `src/main.tsx`, `src/App.tsx`, folders |
| `api/overview.md` | Endpoint or payload work | `src/routers/*.tsx`, `src/configs/conf.tsx` |
| `database/overview.md` | Persistence or schema questions | Repository scan |
| `standards/typescript-react.md` | Implementation conventions | `tsconfig.app.json`, `eslint.config.js`, source |
| `business/rules.md` | Registration, sale, validation behavior | page/component source |
| `features/overview.md` | User-facing workflows and routes | `src/pages`, `src/components` |
| `overrides/README.md` | Explicit project-specific exceptions | No overrides currently found |

## Loading Policy

Read this file and `00_AI_RULES.md` first. Do not load every module for a narrow task. Re-scan source when a module is stale or a claim is disputed.

