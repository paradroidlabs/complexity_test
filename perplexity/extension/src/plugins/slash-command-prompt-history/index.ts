import { z } from "zod";

import { definePlugin } from "@/data/plugin-registry/utils";
import { SlashCommandMenuTabShortcutSchema } from "@/plugins/slash-command/shortcuts.types.public";

declare module "@/data/plugin-registry/types" {
  interface PluginsSettingsRegistry {
    "queryBox:slashCommandMenu:promptHistory": z.infer<typeof schema>;
  }
}

const schema = z.object({
  enabled: z.boolean(),
  shortcut: SlashCommandMenuTabShortcutSchema,
  trigger: z.object({
    onSubmit: z.boolean(),
    onNavigation: z.boolean(),
  }),
});

export default definePlugin({
  manifest: {
    id: "queryBox:slashCommandMenu:promptHistory",
    settingsUiRouteSegment: "query-box-slash-command-menu-prompt-history",
    title: "Prompt History",
    description: "Reuse previous prompts",
    categories: ["featured", "prompting"],
    tags: ["slashCommand"],
    dependentDomObservers: ["queryBoxes"],
    dependentPlugins: ["queryBox:slashCommandMenu"],
    dependentMainWorldCorePlugins: ["spaRouter", "networkIntercept"],
  },
  settingsSchema: {
    schema,
    fallback: {
      enabled: false,
      shortcut: {
        type: "command",
        value: "h",
      },
      trigger: {
        onSubmit: true,
        onNavigation: true,
      },
    },
  },
});
