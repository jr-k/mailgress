/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
  glob: (pattern: string, options?: { eager?: boolean }) => Record<string, unknown>;
}
