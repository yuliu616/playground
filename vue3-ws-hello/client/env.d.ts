/// <reference types="vite/client" />

interface ImportMetaEnv {

  readonly VITE_REST_API_BASE_URL: string;
  readonly VITE_WS_FULL_URL: string;
  
  readonly VITE_MessageService_debug: number|string;
  readonly VITE_WebSocketMessageStore_debug: number|string;
      
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
