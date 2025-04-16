/// <reference types="vite/client" />

declare const __APP_VERSION__: string;

declare module "*?script&module" {
  const filePath: string;
  export default filePath;
}
