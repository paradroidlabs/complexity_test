import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "thread:exportThread": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "thread:exportThread",
    settingsUiRouteSegment: "thread-export-thread",
    title: "Export Thread",
    description:
      "Export the current thread in markdown format (with optional citations). More formatting options coming soon",
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
