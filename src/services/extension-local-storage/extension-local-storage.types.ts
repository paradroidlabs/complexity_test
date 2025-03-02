import { z } from "zod";

import { APP_CONFIG } from "@/app.config";
import { EXTENSION_ICON_ACTIONS } from "@/data/dashboard/extension-storage";
import { PluginsSchema } from "@/services/extension-local-storage/plugins.types";

export const ExtensionLocalStorageSchema = z.object({
  schemaVersion: z.literal(APP_CONFIG.VERSION),
  showPostUpdateReleaseNotesPopup: z.boolean(),
  isPostUpdateReleaseNotesPopupDismissed: z.boolean(),
  plugins: PluginsSchema,
  theme: z.string(),
  preloadTheme: z.boolean(),
  energySavingMode: z.boolean(),
  extensionIconAction: z.enum(EXTENSION_ICON_ACTIONS),
  cdnLastUpdated: z.number(),
  devMode: z.boolean(),
});

export type ExtensionLocalStorage = z.infer<typeof ExtensionLocalStorageSchema>;
