import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    spaceNavigator: z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "spaceNavigator",
    settingsUiRouteSegment: "space-navigator",
    title: "Space Navigator",
    description: "Search & navigate between spaces",
    categories: ["queryBox", "sidebar"],
    tags: ["ui"],
    uiGroup: ["queryBoxes:toolbar:main"],
    dependentDomObservers: ["queryBoxes", "sidebar", "spacesPage"],
    dependentMainWorldCorePlugins: ["spaRouter"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
