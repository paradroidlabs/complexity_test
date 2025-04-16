import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  alwaysActive: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:rawTextPaste": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "queryBox:rawTextPaste",
    settingsUiRouteSegment: "query-box-raw-text-paste",
    title: "Raw Text Paste",
    description:
      "Prevent automatic file creation when pasting (very) long text into the query box",
    categories: ["queryBox"],
    tags: [],
    dependentDomObservers: ["queryBoxes"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      alwaysActive: false,
    },
  },
});
