# DEV Maintenance Mode

When `VITE_ENV` is missing, unknown, or resolves to `DEV`, `src/main.tsx` renders `src/pages/dev_mode.tsx` instead of the normal navigation and route outlet. The screen is a static Thai maintenance notice with the planned reopening date shown in the page.

`App` still wraps the screen with `OpenProjectProvider`, but the normal user-facing routes are not rendered in DEV. TEST renders the normal app and shows a dismissible testing warning modal; PROD renders the normal app without an environment notice.

This is client-side environment gating only. It does not establish backend access control or change API behavior.
