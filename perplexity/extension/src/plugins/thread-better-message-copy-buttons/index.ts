import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:betterMessageCopyButtons": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:betterMessageCopyButtons",
    settingsUiRouteSegment: "thread-better-message-copy-buttons",
    title: "Better Message Copy Buttons",
    description:
      "Copy message content without citations. More formatting options coming soon",
    categories: ["thread"],
    tags: ["ui"],
    uiGroup: ["thread:messageBlocks:toolbar"],
    dependentDomObservers: ["thread:messageBlocks"],
    dependentMainWorldCorePlugins: ["spaRouter", "reactVdom"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
