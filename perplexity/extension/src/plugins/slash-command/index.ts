import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:slashCommandMenu": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
});

export default definePlugin({
  manifest: {
    id: "queryBox:slashCommandMenu",
    settingsUiRouteSegment: "query-box-slash-command-menu",
    title: "Slash Command Menu: Core",
    description:
      "Allows you to use various slash commands to quickly access advanced features",
    categories: ["misc"],
    tags: ["desktopOnly"],
    uiGroup: ["queryBoxes:toolbar:main", "queryBoxes:toolbar:followUp"],
    dependentDomObservers: ["queryBoxes"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
    },
  },
});
