/// <reference types="vite/client" />

interface ImportMetaEnv {

  readonly VITE_FAVOR_COLOR: string;
  readonly VITE_LOGO_BORDER_THICK: number;
      
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
