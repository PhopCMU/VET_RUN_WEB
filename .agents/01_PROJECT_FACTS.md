# Project Facts

## Identity

- Package: `vet-run-2026`, version `1.0.1`, private package.
- Repository content is a client-side Vite application under `src/` with static assets under `public/`.
- Product-facing labels and translation keys identify a VET CMU RUN registration and shirt-sale workflow.

## Technology Stack

- React `19.1.0`, React DOM `19.1.0`, TypeScript `~5.8.3`.
- Vite `6.3.5`, `@vitejs/plugin-react`, Tailwind CSS `4.1.5` with `@tailwindcss/vite`.
- React Router DOM `7.5.3`, Axios `1.10.0`.
- i18next/react-i18next, Framer Motion, CryptoJS, QRCode React, Material Symbols.
- ESLint `9.39.5` with TypeScript, React Hooks, and React Refresh plugins.

## Commands

- `npm run dev`: Vite dev server on port `3002` (strict port; host is not overridden in `vite.config.ts`).
- `npm run build`: `tsc -b && vite build`.
- `npm run lint`: ESLint.
- `npm run preview`: Vite preview.

## Runtime Configuration

- `src/configs/conf.tsx` resolves `VITE_ENV` case-insensitively to `DEV`, `TEST`, or `PROD`; missing or unknown values default to `DEV`.
- API URL selection uses `VITE_URL_API` for `PROD`, `VITE_URL_API_TEST` for `TEST` when present, otherwise `VITE_URL_API_DEV`; `DEV` uses `VITE_URL_API_DEV`.
- `src/vite-env.d.ts` declares the Vite environment variables consumed by the client config.
- Order tracking normalizes the submitted email to lowercase and queries the tracking API by email.
- The application title and favicon identify the 2026 event through `index.html` and `public/logo_vetrun_2026.jpg`.

## Evidence Files

See `architecture/overview.md`, `api/overview.md`, `features/overview.md`, and `standards/typescript-react.md` for source locations.
