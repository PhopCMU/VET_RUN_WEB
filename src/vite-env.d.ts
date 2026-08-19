/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENV: "DEV" | "TEST" | "PROD" | "dev" | "test" | "prod";
  readonly VITE_URL_API: string;
  readonly VITE_URL_API_DEV: string;
  readonly VITE_URL_API_TEST?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
