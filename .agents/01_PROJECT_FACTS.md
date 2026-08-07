# Project Facts

## Identity

- Package: `vet-run-2026`, version `1.0.0`, private package.
- Repository content is a client-side Vite application under `src/` with static assets under `public/`.
- Product-facing labels and translation keys identify a VET CMU RUN registration and shirt-sale workflow.

## Technology Stack

- React `19.1.0`, React DOM `19.1.0`, TypeScript `~5.8.3`.
- Vite `6.3.5`, `@vitejs/plugin-react`, Tailwind CSS `4.1.5` with `@tailwindcss/vite`.
- React Router DOM `7.5.3`, Axios `1.10.0`, FingerprintJS Pro React `2.7.1`.
- i18next/react-i18next, Framer Motion, CryptoJS, QRCode React, Material Symbols.
- ESLint 10 with TypeScript, React Hooks, and React Refresh plugins.

## Commands

- `npm run dev`: Vite dev server on port `3002` (strict port, host `0.0.0.0`).
- `npm run build`: `tsc -b && vite build`.
- `npm run lint`: ESLint.
- `npm run preview`: Vite preview.\n\n## Runtime Configuration\n\n- `src/configs/conf.tsx` selects `VITE_URL_API` for `VITE_ENV === "PROD"`; other environments use `VITE_URL_API_DEV`.\n- Tracking uses `useVisitorData` from FingerprintJS Pro React to obtain the visitor ID sent to the tracking API.\n- The application title and favicon identify the 2026 event through `index.html` and `public/logo_vetrun_2026.jpg`.

## Evidence Files

See `architecture/overview.md`, `api/overview.md`, `features/overview.md`, and `standards/typescript-react.md` for source locations.

