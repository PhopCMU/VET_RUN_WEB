# AI Rules

- Treat source code and configuration as the authority. Do not infer business rules that are not evidenced there.
- Load `02_MANIFEST.md` first, then only the module document needed for the task.
- Treat backend behavior, database schema, authentication, deployment, and production operations as unknown unless documented by repository evidence.
- Do not expose values from `.env`; document variable names and purpose only.
- Keep changes scoped to the relevant source area and preserve the existing React/Vite conventions.
- When documentation conflicts with source code, report the conflict and prefer current source code.

