export type Platform = "windows" | "linux" | "mac";

export default function usePlatformDetection(): Platform {
  return useMemo(() => getPlatform(), []);
}

export const getPlatform = () => {
  if (typeof navigator === "undefined") return "windows";

  if ((navigator as any).userAgentData?.platform != null) {
    const platform = (navigator as any).userAgentData.platform;
    if (/macOS/.test(platform)) return "mac";
    if (/Linux/.test(platform)) return "linux";
    if (/Windows/.test(platform)) return "windows";
  }

  const userAgent = navigator.userAgent;
  if (/Mac|iPod|iPhone|iPad/.test(userAgent)) return "mac";
  if (/Linux/.test(userAgent)) return "linux";
  if (/Windows/.test(userAgent)) return "windows";

  return "windows";
};
