import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:toc": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:toc",
    settingsUiRouteSegment: "thread-toc",
    title: "Table of Contents",
    description:
      "Quickly navigate between messages in a thread. Only shows up when there are more than 2 messages",
    categories: ["thread"],
    tags: ["ui"],
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
