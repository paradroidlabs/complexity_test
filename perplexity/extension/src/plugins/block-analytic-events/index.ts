import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    blockAnalyticEvents: z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "blockAnalyticEvents",
    settingsUiRouteSegment: "block-analytic-events",
    title: "Block Analytic Events",
    description: "Prevent Perplexity from sending analytic/tracking events",
    categories: ["misc"],
    tags: ["privacy"],
    dependentMainWorldCorePlugins: ["networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
