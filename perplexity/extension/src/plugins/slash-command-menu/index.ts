import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  showTriggerButton: z.boolean(),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:slashCommandMenu": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "queryBox:slashCommandMenu",
    settingsUiRouteSegment: "query-box-slash-command-menu",
    title: "Slash Command Menu",
    description: "Invoke actions via slash commands",
    categories: ["queryBox"],
    tags: ["desktopOnly", "ui"],
    uiGroup: ["queryBoxes:toolbar:main", "queryBoxes:toolbar:followUp"],
    dependentDomObservers: ["queryBoxes"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      showTriggerButton: false,
    },
  },
});
