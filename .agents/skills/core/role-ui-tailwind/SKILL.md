---
name: role-ui-tailwind
description: Guidelines for implementing UI using Tailwind in this repo.
---

When to use

- When building or updating UI components following project patterns.

Steps

- Use `src/components/ui/**` for primitives; keep pages in `src/pages/**` and features in `src/features/**`.

## Update notes

- 2026-07-27: For app-wide visual refreshes, define Tailwind v4 `@theme` tokens in `src/index.css`, scope legacy palette normalization under the app shell, and reuse `page-frame`/`content-panel` primitives. Keep route handlers, state, and service calls unchanged; validate with build plus browser screenshots.
