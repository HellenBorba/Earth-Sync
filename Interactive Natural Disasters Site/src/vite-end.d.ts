/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // adicione aqui outras variáveis de ambiente que você usar
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
