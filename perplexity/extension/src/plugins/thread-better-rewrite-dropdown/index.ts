import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterRewriteDropdowns": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:betterRewriteDropdowns",
    settingsUiRouteSegment: "thread-better-rewrite-dropdowns",
    title: "Better Rewrite Dropdowns",
    description: "A better dropdown for rewriting messages",
    categories: ["thread"],
    tags: ["new", "ui", "pplxPro"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
    dependentPlugins: ["queryBox:languageModelSelector"],
    uiGroup: ["thread:messageBlocks:toolbar"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
