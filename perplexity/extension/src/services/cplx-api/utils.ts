import { APP_CONFIG } from "@/app.config";

export function getTParam() {
  if (APP_CONFIG.IS_DEV) return Date.now();

  const nowInMilliseconds = Date.now();
  const cacheResetIntervalMs = 1000 * 60 * 30;

  return (
    Math.floor(nowInMilliseconds / cacheResetIntervalMs) * cacheResetIntervalMs
  );
}
