# Role: UI / Tailwind

When to use
- Implement UI components and primitives for the app.

Steps
- Put shared primitives in `src/components/ui/**`.
- Keep pages in `src/pages/**` and feature logic in `src/features/**`.
- Use Tailwind utility-first classes; prefer small, composable components.

Pitfalls
- Avoid embedding network logic in components. Keep them presentational.

Minimal snippet

```tsx
// src/components/ui/Button.tsx
export const Button: React.FC<{onClick?:()=>void}> = ({children, onClick}) => (
  <button className="px-3 py-2 bg-sky-600 text-white rounded" onClick={onClick}>{children}</button>
)
```

Update notes
- 2026-08-07: Loading guards in page components must `return <Loading />`; a bare JSX expression does not stop rendering.
- 2026-08-07: Render sponsor levels from one ordered tier config so card size, grid density, and accents communicate sponsorship priority consistently.
- 2026-08-11: When a repeatable line-item form has multiple `<select>`s (e.g. color + model), give each its own state field. Binding two different selects to the same field (e.g. both writing to `type`) silently overwrites the first choice with the second — verify each `onChange` targets a distinct key before wiring up grouped/variant forms. Also, dynamic labels (model/color names) shown in a confirmation/summary screen should be looked up from the fetched API list (`shirtModels`/`shirtColors`), not a hardcoded UUID→label map, or new items become "unknown" silently.
