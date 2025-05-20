import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    betterSearchParams: z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "betterSearchParams",
    settingsUiRouteSegment: "better-search-params",
    title: "Better Search Params",
    description:
      "Extends search param to include model, focus modes, and incognito mode, etc.",
    categories: ["featured", "misc"],
    tags: ["new"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
