/// <reference types="vite/client" />

interface ImportMetaEnv {

  readonly VITE_LOGO_BG_COLOR: string;
  readonly VITE_REST_CALL_TIMEOUT_MS: number|string;

  readonly VITE_DarkTheme: number|string;

}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
