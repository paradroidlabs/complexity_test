import omit from "lodash/omit";

import { DEFAULT_EXTENSION_SETTINGS } from "@/services/extension-settings/defaults";
import type { ExtensionSettings } from "@/services/extension-settings/types";
import { errorWrapper } from "@/utils/error-wrapper";

export const migrations = {
  2: async () => {
    const [result, error] = await errorWrapper(async () => {
      const oldFlatSchema = await chrome.storage.local.get();

      const newSchema = transfromFlatSchema(oldFlatSchema);

      await chrome.storage.local.clear();

      return newSchema;
    })();

    if (error) {
      console.error("Error migrating v2 schema", error);

      return DEFAULT_EXTENSION_SETTINGS;
    }

    console.log("v2 schema migrated");

    return result;
  },
} satisfies Record<number, (oldSettings: any) => any>;

export function transfromFlatSchema(
  oldFlatSchema: Record<string, any>,
): ExtensionSettings {
  return {
    ...omit(oldFlatSchema, "settings", "settings$"),
    plugins: {
      ...oldFlatSchema.plugins,
      "queryBox:rawTextPaste": {
        ...oldFlatSchema.plugins["queryBox:noFileCreationOnPaste"],
      },
    },
  } as ExtensionSettings;
}
