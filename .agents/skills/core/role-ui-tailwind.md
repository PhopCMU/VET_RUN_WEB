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
