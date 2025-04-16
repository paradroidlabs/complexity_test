import { asyncLoaderRegistry } from "@/data/async-dep-registry";
import { ExtensionSettingsService } from "@/services/extension-settings";
import type { ExtensionSettings } from "@/services/extension-settings/types";

declare module "@/data/async-dep-registry" {
  interface AsyncLoadersRegistry {
    "cache:extensionSettings": ExtensionSettings;
  }
}

export default function loader() {
  asyncLoaderRegistry.register({
    id: "cache:extensionSettings",
    dependencies: [],
    loader: async () => {
      return await ExtensionSettingsService.get();
    },
  });
}
