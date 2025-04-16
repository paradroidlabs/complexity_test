import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";

const schema = z.object({
  enabled: z.boolean(),
  trigger: z.object({
    onSubmit: z.boolean(),
    onNavigation: z.boolean(),
  }),
});

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:slashCommandMenu:promptHistory": z.infer<typeof schema>;
  }
}

export default definePlugin({
  manifest: {
    id: "queryBox:slashCommandMenu:promptHistory",
    settingsUiRouteSegment: "query-box-slash-command-menu-prompt-history",
    title: "Prompt History",
    description: "Reuse previous prompts",
    categories: ["queryBox"],
    tags: ["slashCommand", "desktopOnly", "ui"],
    dependentDomObservers: ["queryBoxes"],
    dependentPlugins: ["queryBox:slashCommandMenu"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      trigger: {
        onSubmit: true,
        onNavigation: true,
      },
    },
  },
});
