# Architecture Overview

The application is a React SPA bootstrapped by `src/main.tsx`. `BrowserRouter` wraps the app; `App` provides `OpenProjectProvider`, the global shell, and environment-gated warning notices. `I18nProvider`, the skip-to-content link, `Navbar`, and the semantic `main` landmark surround the route outlet.

## Routes

- `/`: home, project status, sponsors, navigation.
- `/page/registration`: multi-step participant registration.
- `/list/participants`: participant list/status.
- `/sale/shirt`: shirt order form.
- `/sale/shirt/tracking`: shirt order tracking.

## Request Flow

`pages/components -> routers/GetRouter.tsx or PostRouter.tsx -> Axios -> external API`. `configs/conf.tsx` selects the API base URL from Vite environment variables using the resolved app environment. There is no server implementation in this repository.

## Folder Responsibilities

- `src/pages`: route-level screens; `src/components`: reusable UI and registration steps.
- `src/routers`: API request functions; `src/providers` and `src/contexts`: context wiring.
- `src/types`, `src/configs`, `src/constant`: types, config, constants/assets.
- `src/assets`, `public`: bundled/public assets, locales, and fonts.

The tracking page imports FingerprintJS Pro React directly to obtain a visitor identifier; no separate application provider is mounted in `src/main.tsx`.

## State and Persistence

React state holds form, loading, and local shell state. `OpenProjectProvider` fetches project status once per provider lifetime using a ref guard. `App` opens a warning `AlertModal` automatically outside `PROD`; `DEV` notices are non-dismissible while `TEST` notices can be acknowledged. `localStorage` stores `language` and a temporary `items` flag. No global state library or SSR is present.
