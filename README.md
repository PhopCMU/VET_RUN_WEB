# VET CMU RUN

Frontend application for the VET CMU RUN participant registration, participant list, shirt sales, and order tracking workflows.

## Stack

- React 19 and TypeScript
- Vite 6
- Tailwind CSS 4
- React Router DOM
- Axios
- i18next / react-i18next
- CryptoJS and Framer Motion

## Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The development server uses port `3002`.

Available commands:

```bash
npm run build
npm run lint
npm run preview
```

## Application Routes

- `/`: Home and project status
- `/page/registration`: Participant registration
- `/list/participants`: Participant list
- `/sale/shirt`: Shirt order form
- `/sale/shirt/tracking`: Order tracking

## Environment Variables

The application reads Vite environment variables for API selection and client-side configuration:

- `VITE_ENV`
- `VITE_URL_API`
- `VITE_URL_API_DEV`
- `VITE_PROJECT_ID`
- `VITE_SECRET_KEY_CRYPTO_FRONTEND`

Do not commit real secrets or environment-specific credentials.

## Project Documentation

The modular AI Knowledge Base is maintained under `.agents/`:

- `.agents/02_MANIFEST.md`: Documentation index and lazy-loading guide
- `.agents/03_TASK_MAP.md`: Task-to-document lookup
- `.agents/architecture/overview.md`: Runtime architecture and folders
- `.agents/api/overview.md`: API endpoints and payload behavior
- `.agents/database/overview.md`: Database findings and unknowns
- `.agents/business/rules.md`: Client-observable business rules
- `.agents/features/overview.md`: Main user-facing features
- `.agents/standards/typescript-react.md`: TypeScript, React, and lint conventions

Backend implementation, database schema, complete API contracts, and server-side business rules are outside this repository and are documented as unknown where applicable.
