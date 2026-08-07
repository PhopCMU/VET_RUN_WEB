# TypeScript and React Standards

## Enforced Configuration

- TypeScript strict mode, no unused locals/parameters, no fallthrough, and bundler module resolution.
- JSX uses `react-jsx`; source is included from `src`.
- ESLint uses recommended JavaScript/TypeScript rules plus React Hooks and React Refresh rules.

## Existing Conventions

- Functional React components and hooks; `.tsx` for components/pages and types under `src/types` when shared.
- API functions live in `src/routers`; URL selection is centralized in `src/configs/conf.tsx`.
- User-facing strings are primarily read through `react-i18next`; translations are in `public/locales/{en,th}/translation.json`.
- Tailwind utility classes are used in JSX; global CSS imports Tailwind, Material Symbols, and Noto Sans Thai.
- Material Symbols provide UI icons; Framer Motion supplies animation.\n- Global accessibility conventions include a skip-to-content link, semantic landmarks, dialog/status ARIA attributes, visible `:focus-visible` styles, minimum interactive control sizes, and reduced-motion handling in `src/index.css`.\n- The visual theme is centralized in Tailwind v4 `@theme` tokens and shared CSS classes such as `.app-shell`, `.page-frame`, and `.content-panel`.

## Gaps

- Several API response values are typed as `any`.
- No test framework or test files were found.
- The client includes an encryption-secret environment variable; its security model and backend contract are undocumented.

