import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:showMessageLength": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  showTokens: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "thread:showMessageLength",
    settingsUiRouteSegment: "thread-show-message-length",
    title: "Show Message Length",
    description:
      "Show the length of each message in words, characters, and tokens",
    categories: ["thread"],
    tags: ["ui"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
    uiGroup: [
      "thread:messageBlocks:toolbar",
      "thread:messageBlocks:queryHoverContainer",
    ],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      showTokens: false,
    },
  },
});
