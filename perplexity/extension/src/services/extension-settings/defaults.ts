import { PluginRegistry } from "@/data/plugin-registry/index";
import type { ExtensionSettings } from "@/services/extension-settings/types";

export const DEFAULT_EXTENSION_SETTINGS: ExtensionSettings = {
  plugins: PluginRegistry.fallbackValues,
  theme: "complexity",
  energySavingMode: false,
  extensionIconAction: "perplexity",
  cdnLastUpdated: 0,
  devMode: false,
  showPostUpdateReleaseNotesPopup: false,
  isPostUpdateReleaseNotesPopupDismissed: false,
} as const;
