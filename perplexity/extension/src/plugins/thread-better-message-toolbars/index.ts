import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  sticky: z.boolean(),
  hideUnnecessaryButtons: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterMessageToolbars": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:betterMessageToolbars",
    settingsUiRouteSegment: "thread-better-message-toolbars",
    title: "Better Message Toolbars",
    description: "Enhance message toolbars (in threads)",
    categories: ["thread"],
    tags: ["ui"],
    dependentDomObservers: ["thread:messageBlocks"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      sticky: true,
      hideUnnecessaryButtons: true,
    },
  },
});
