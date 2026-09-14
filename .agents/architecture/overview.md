# Architecture Overview

The application is a React SPA bootstrapped by `src/main.tsx`. `BrowserRouter` wraps the app; `App` provides `OpenProjectProvider`, the global shell, and a TEST-only warning notice. `I18nProvider` wraps either the DEV maintenance screen or the normal shell containing the skip-to-content link, `Navbar`, and semantic `main` landmark.

## Routes

- `/`: home, project status, sponsors, navigation.
- `/page/registration`: multi-step participant registration.
- `/list/participants`: participant list/status.
- `/sale/shirt`: shirt order form.
- `/sale/shirt/tracking`: shirt order tracking.

When `VITE_ENV` resolves to `DEV`, `src/main.tsx` renders `pages/dev_mode.tsx` instead of the normal routes. TEST and PROD render the normal route set; TEST also shows the dismissible warning modal from `App`.

## Request Flow

`pages/components -> routers/GetRouter.tsx or PostRouter.tsx -> Axios -> external API`. `configs/conf.tsx` selects the API base URL from Vite environment variables using the resolved app environment. There is no server implementation in this repository.

## Folder Responsibilities

- `src/pages`: route-level screens; `src/components`: reusable UI and registration steps.
- `src/routers`: API request functions; `src/providers` and `src/contexts`: context wiring.
- `src/types`, `src/configs`, `src/constant`: types, config, constants/assets.
- `src/assets`, `public`: bundled/public assets, locales, and fonts.

The tracking page queries orders by normalized email; no visitor-identification provider is mounted in `src/main.tsx`.

## State and Persistence

React state holds form, loading, and local shell state. `OpenProjectProvider` fetches project status once per provider lifetime using a ref guard. `App` opens a dismissible TEST warning `AlertModal`; DEV uses the dedicated maintenance screen and PROD has no environment notice. `localStorage` stores `language` and a temporary `items` flag. No global state library or SSR is present.
