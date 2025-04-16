import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "sidebar:toggleableRecentThreads": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "sidebar:toggleableRecentThreads",
    settingsUiRouteSegment: "sidebar-toggleable-recent-threads",
    title: "Hide Recent Threads",
    categories: ["sidebar"],
    tags: ["ui"],
    description: "Hide recent threads on the sidebar",
    dependentDomObservers: ["sidebar"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
