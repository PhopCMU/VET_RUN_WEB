# Architecture Overview

## Runtime Shape

The application is a React SPA bootstrapped by `src/main.tsx`. `BrowserRouter` wraps the app; `App` provides `OpenProjectProvider` and the global page shell. `I18nProvider` and `Navbar` are mounted around the route outlet.

## Request Flow

`pages/components -> routers/GetRouter.tsx or PostRouter.tsx -> Axios -> external API`. `configs/conf.tsx` selects the API base URL from Vite environment variables. There is no server implementation in this repository.

## Routes

- `/`: home, project status, sponsors, navigation.
- `/page/registration`: multi-step participant registration.
- `/list/participants`: participant list/status.
- `/sale/shirt`: shirt order form.
- `/sale/shirt/tracking`: shirt order tracking.

## Folder Responsibilities

- `src/pages`: route-level screens.
- `src/components`: reusable UI and registration step components.
- `src/routers`: API request functions, despite the router name.
- `src/providers` and `src/contexts`: project and i18n context wiring.
- `src/types`, `src/configs`, `src/constant`: types, environment-derived config, and asset/constants.
- `src/assets`, `public`: bundled and public static assets/locales/fonts.

## State and Persistence

React state holds form and loading state. `OpenProjectProvider` fetches project status once per provider lifetime using a ref guard. `localStorage` stores `language` and a temporary `items` flag. No global state library or server-side rendering is present.

