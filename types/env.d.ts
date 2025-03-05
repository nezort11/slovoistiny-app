export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EXPO_PUBLIC_HTTP_PROXY_URL: string;
    }
  }
}
