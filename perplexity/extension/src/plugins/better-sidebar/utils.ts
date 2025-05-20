import { ExtensionSettingsService } from "@/services/extension-settings";
import { InstantCssService } from "@/services/instant-css";

export async function shouldPreventLayoutShift() {
  return (
    (await InstantCssService.hasPermissions()) &&
    ExtensionSettingsService.cachedSync.plugins.betterSidebar
      .shouldPreventLayoutShift
  );
}
