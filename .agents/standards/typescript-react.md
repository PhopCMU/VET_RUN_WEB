# TypeScript and React Standards

## Enforced Configuration

- TypeScript strict mode is enabled with no unused locals/parameters, no fallthrough, and bundler module resolution.
- JSX uses `react-jsx`; source is included from `src`.
- ESLint uses recommended JavaScript and TypeScript rules plus React Hooks and React Refresh rules.
- Functional React components and hooks are the established style.

## Existing Conventions

- Components and pages use `.tsx`; types use interfaces/type aliases near the feature or under `src/types`.
- API functions live in `src/routers`; environment-derived URL selection is centralized in `src/configs/conf.tsx`.
- User-facing strings are primarily read through `react-i18next`; translations are in `public/locales/{en,th}/translation.json`.
- Tailwind utility classes are used in JSX; global CSS imports Tailwind, Material Symbols, and Noto Sans Thai.
- Material Symbols are used for UI icons; Framer Motion supplies page/component animation.

## Observed Risks / Gaps

- Several API response values are typed as `any`.
- No test framework or test files were found.
- The client includes an encryption secret environment variable; its security model and backend contract are not documented here.

